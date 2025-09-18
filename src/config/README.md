# Configuration des données personnelles

Ce dossier contient tous les fichiers de configuration pour personnaliser votre portfolio sans modifier le code source.

## Fichiers de configuration

### `personalData.js`
Contient toutes vos informations personnelles :
- Nom, titre, biographie
- Photo de profil
- Informations de contact
- Liens vers les réseaux sociaux
- Sections "À propos" (mission, expertise, vision)
- Statistiques
- Badges pour la section hero
- Call-to-action

### `experienceData.js`
Contient votre expérience professionnelle :
- Titre du poste
- Nom de l'entreprise
- Localisation
- Période
- Nom du projet
- Description
- Détails des réalisations
- Tags/technologies utilisées

### `skillsData.js`
Contient vos compétences techniques :
- Nom de la compétence
- Niveau (0-100)
- Catégorie (Mobile, Backend, Data, etc.)

### `projectsData.js`
Contient vos projets personnels :
- Titre et sous-titre
- Période
- Description
- Détails des réalisations
- Tags/technologies
- Images de couverture et galerie

### `educationData.js`
Contient votre formation et certifications :
- Titre
- Sous-titre
- Période
- Institution
- Description

## Comment modifier vos informations

1. Ouvrez le fichier de configuration correspondant
2. Modifiez les valeurs selon vos besoins
3. Sauvegardez le fichier
4. Le portfolio se mettra à jour automatiquement

## Exemple de modification

Pour changer votre nom et titre :

```javascript
// Dans personalData.js
export const personalData = {
  name: "Votre Nouveau Nom",
  title: "Votre Nouveau Titre",
  // ... autres propriétés
};
```

## Notes importantes

- Les images doivent être des URLs valides
- Les liens vers les réseaux sociaux doivent être complets (https://...)
- Les niveaux de compétences vont de 0 à 100
- Les dates doivent être au format "Mois Année – Période"
- Sauvegardez toujours vos modifications avant de tester
