import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ContactsStackParamList, CategoriesStackParamList, RootTabParamList } from './types';
import ContactsScreen from '../screens/ContactsScreen';
import ContactFormScreen from '../screens/ContactFormScreen';
import ContactDetailScreen from '../screens/ContactDetailScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryFormScreen from '../screens/CategoryFormScreen';
import CategoryContactsScreen from '../screens/CategoryContactsScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const ContactsStack = createNativeStackNavigator<ContactsStackParamList>();
const CategoriesStack = createNativeStackNavigator<CategoriesStackParamList>();

function ContactsStackNavigator() {
  return (
    <ContactsStack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <ContactsStack.Screen
        name="ContactsList"
        component={ContactsScreen}
        options={{ title: 'Contacts' }}
      />
      <ContactsStack.Screen
        name="ContactForm"
        component={ContactFormScreen}
        options={({ route }) => ({
          title: route.params?.contactId ? 'Modifier le contact' : 'Nouveau contact',
          presentation: 'modal',
        })}
      />
      <ContactsStack.Screen
        name="ContactDetail"
        component={ContactDetailScreen}
        options={{ title: 'Contact' }}
      />
    </ContactsStack.Navigator>
  );
}

function CategoriesStackNavigator() {
  return (
    <CategoriesStack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <CategoriesStack.Screen
        name="CategoriesList"
        component={CategoriesScreen}
        options={{ title: 'Catégories' }}
      />
      <CategoriesStack.Screen
        name="CategoryForm"
        component={CategoryFormScreen}
        options={({ route }) => ({
          title: route.params?.categoryId ? 'Modifier la catégorie' : 'Nouvelle catégorie',
          presentation: 'modal',
        })}
      />
      <CategoriesStack.Screen
        name="CategoryContacts"
        component={CategoryContactsScreen}
        options={{ title: 'Catégorie' }}
      />
    </CategoriesStack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="ContactsTab"
          component={ContactsStackNavigator}
          options={{ title: 'Contacts' }}
        />
        <Tab.Screen
          name="CategoriesTab"
          component={CategoriesStackNavigator}
          options={{ title: 'Catégories' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
