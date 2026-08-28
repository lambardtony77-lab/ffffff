export type ContactsStackParamList = {
  ContactsList: undefined;
  ContactForm: { contactId?: string } | undefined;
  ContactDetail: { contactId: string };
};

export type CategoriesStackParamList = {
  CategoriesList: undefined;
  CategoryForm: { categoryId?: string } | undefined;
  CategoryContacts: { categoryId: string };
};

export type RootTabParamList = {
  ContactsTab: undefined;
  CategoriesTab: undefined;
};
