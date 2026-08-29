# Fiches Contacts

Application mobile (Expo / React Native) pour créer des fiches contact et les
organiser dans des catégories personnalisées (nom + description).

## Fonctionnalités

- **Contacts** : créer, modifier, supprimer des fiches contact (nom,
  téléphone, email, notes) et les rechercher.
- **Catégories** : créer des catégories personnalisées avec un nom, une
  description et une couleur, puis leur associer des contacts. Possible
  aussi de créer une catégorie directement depuis la fiche contact.
- Consulter tous les contacts d'une catégorie donnée, avec sa description.
- Tout est sauvegardé en local sur l'appareil (`AsyncStorage`), donc ça
  fonctionne hors-ligne.

## Lancer l'application

```bash
npm install
npm start
```

Cela ouvre le serveur de développement Expo. Ensuite :

- **Sur votre téléphone** : installez l'app **Expo Go** (App Store /
  Google Play), puis scannez le QR code affiché dans le terminal.
- **Dans un navigateur** : appuyez sur `w` dans le terminal, ou lancez
  `npm run web`.
- **Émulateur Android/iOS** : appuyez sur `a` ou `i` dans le terminal
  (nécessite Android Studio ou Xcode installés).

## Structure du projet

```
App.tsx                       point d'entrée, providers et navigation
src/
  types.ts                    types Contact / Category
  context/DataContext.tsx     état global + persistance (AsyncStorage)
  navigation/                 navigation par onglets (Contacts / Catégories)
  screens/                    écrans (liste, formulaire, détail)
  components/                 composants réutilisables (carte contact, avatar, etc.)
```
