import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, Contact } from '../types';
import { generateId } from '../utils/id';
import { randomCategoryColor } from '../utils/colors';

const CONTACTS_KEY = '@fiches_contacts/contacts';
const CATEGORIES_KEY = '@fiches_contacts/categories';

type DataContextValue = {
  loading: boolean;
  contacts: Contact[];
  categories: Category[];
  addContact: (input: Omit<Contact, 'id' | 'createdAt'>) => Promise<Contact>;
  updateContact: (id: string, input: Omit<Contact, 'id' | 'createdAt'>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  addCategory: (input: { name: string; description: string; color?: string }) => Promise<Category>;
  updateCategory: (id: string, input: { name: string; description: string; color: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  contactsForCategory: (categoryId: string) => Contact[];
};

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [rawContacts, rawCategories] = await Promise.all([
          AsyncStorage.getItem(CONTACTS_KEY),
          AsyncStorage.getItem(CATEGORIES_KEY),
        ]);
        if (rawContacts) setContacts(JSON.parse(rawContacts));
        if (rawCategories) setCategories(JSON.parse(rawCategories));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persistContacts = useCallback(async (next: Contact[]) => {
    setContacts(next);
    await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(next));
  }, []);

  const persistCategories = useCallback(async (next: Category[]) => {
    setCategories(next);
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(next));
  }, []);

  const addContact = useCallback(
    async (input: Omit<Contact, 'id' | 'createdAt'>) => {
      const contact: Contact = { ...input, id: generateId(), createdAt: Date.now() };
      await persistContacts([contact, ...contacts]);
      return contact;
    },
    [contacts, persistContacts]
  );

  const updateContact = useCallback(
    async (id: string, input: Omit<Contact, 'id' | 'createdAt'>) => {
      const next = contacts.map((c) => (c.id === id ? { ...c, ...input } : c));
      await persistContacts(next);
    },
    [contacts, persistContacts]
  );

  const deleteContact = useCallback(
    async (id: string) => {
      await persistContacts(contacts.filter((c) => c.id !== id));
    },
    [contacts, persistContacts]
  );

  const addCategory = useCallback(
    async (input: { name: string; description: string; color?: string }) => {
      const category: Category = {
        id: generateId(),
        name: input.name,
        description: input.description,
        color: input.color ?? randomCategoryColor(),
        createdAt: Date.now(),
      };
      await persistCategories([category, ...categories]);
      return category;
    },
    [categories, persistCategories]
  );

  const updateCategory = useCallback(
    async (id: string, input: { name: string; description: string; color: string }) => {
      const next = categories.map((c) => (c.id === id ? { ...c, ...input } : c));
      await persistCategories(next);
    },
    [categories, persistCategories]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      await persistCategories(categories.filter((c) => c.id !== id));
      const nextContacts = contacts.map((c) =>
        c.categoryId === id ? { ...c, categoryId: null } : c
      );
      await persistContacts(nextContacts);
    },
    [categories, contacts, persistCategories, persistContacts]
  );

  const contactsForCategory = useCallback(
    (categoryId: string) => contacts.filter((c) => c.categoryId === categoryId),
    [contacts]
  );

  const value = useMemo<DataContextValue>(
    () => ({
      loading,
      contacts,
      categories,
      addContact,
      updateContact,
      deleteContact,
      addCategory,
      updateCategory,
      deleteCategory,
      contactsForCategory,
    }),
    [
      loading,
      contacts,
      categories,
      addContact,
      updateContact,
      deleteContact,
      addCategory,
      updateCategory,
      deleteCategory,
      contactsForCategory,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
