# Système d'Actualités et Événements

## Vue d'ensemble

Un système complet d'actualités/événements permettant aux enseignants et administrateurs de créer des annonces ciblées par classe, visibles par les étudiants concernés.

## Modifications de la base de données (Prisma Schema)

### Nouveaux modèles

1. **News** - Modèle principal pour les actualités
   - `title`: Titre de l'actualité
   - `content`: Contenu complet (texte long)
   - `excerpt`: Résumé optionnel pour l'aperçu
   - `imageUrl`: URL d'image optionnelle
   - `priority`: Niveau de priorité (HIGH, MEDIUM, LOW)
   - `published`: Statut de publication
   - `publishedAt`: Date de publication
   - `authorId`: Référence à l'auteur (enseignant/admin)
   - Relation many-to-many avec les classes via `NewsGrade`

2. **NewsGrade** - Table de jonction
   - Relie les actualités aux classes
   - Permet à une actualité d'être visible pour plusieurs classes

3. **NewsPriority** - Énumération
   - HIGH (Urgent) - Badge rouge
   - MEDIUM (Important) - Badge orange
   - LOW (Info) - Badge bleu

### Migration requise

```bash
npx prisma migrate dev --name add_news_system
npx prisma generate
```

## API Routes

### `/api/news`

- **GET**: Récupérer toutes les actualités
  - Étudiants: seulement les actualités publiées de leur classe
  - Enseignants/Admins: toutes les actualités avec filtres optionnels
- **POST**: Créer une nouvelle actualité (enseignants/admins uniquement)

### `/api/news/[id]`

- **GET**: Récupérer une actualité spécifique
- **PATCH**: Mettre à jour une actualité (auteur ou admin uniquement)
- **DELETE**: Supprimer une actualité (auteur ou admin uniquement)

### `/api/grades`

- **GET**: Récupérer toutes les classes (pour la sélection lors de la création)

## Composants React

### Pour les étudiants

**`NewsView.tsx`**

- Affichage en grille de cartes des actualités
- Badges de priorité colorés
- Images de couverture optionnelles
- Dialog de détail au clic
- Filtrage automatique par classe de l'étudiant
- Message si aucune actualité

### Pour les enseignants/administrateurs

**`CreateNewsDialog.tsx`**

- Formulaire de création d'actualité
- Sélection multiple de classes (checkboxes)
- Choix de priorité
- Upload d'image (URL)
- Option "Publier immédiatement" ou brouillon
- Validation des champs requis

**`NewsManagement.tsx`**

- Table de gestion de toutes les actualités
- Actions: Publier/Dépublier, Supprimer
- Affichage du statut (Publié/Brouillon)
- Filtrage et tri
- Badges de priorité et classes

## Pages créées

### Étudiants

- `/dashboard/actualites` - Page de consultation des actualités

### Enseignants

- `/teacher/dashboard/actualites` - Page de gestion des actualités

### Administrateurs

- `/admin/dashboard/actualites` - Page de gestion des actualités

## Fonctionnalités principales

### Contrôle d'accès

- ✅ Étudiants: Lecture seule des actualités publiées de leur classe
- ✅ Enseignants: Création, édition et suppression de leurs actualités
- ✅ Admins: Gestion complète de toutes les actualités

### Ciblage par classe

- ✅ Une actualité peut cibler plusieurs classes
- ✅ Filtrage automatique pour les étudiants selon leur classe
- ✅ Affichage des classes concernées dans la liste

### Niveaux de priorité

- ✅ HIGH (Urgent): Badge rouge, trié en premier
- ✅ MEDIUM (Important): Badge orange
- ✅ LOW (Info): Badge bleu

### Gestion de publication

- ✅ Mode brouillon: visible seulement par l'auteur et admins
- ✅ Mode publié: visible par les étudiants des classes ciblées
- ✅ Date de publication automatique
- ✅ Toggle rapide publish/unpublish

### Interface utilisateur

- ✅ Design moderne avec cartes et badges colorés
- ✅ Responsive (grille adaptative)
- ✅ Images de couverture optionnelles
- ✅ Dialog de détail pour lecture complète
- ✅ Formatage de dates en français
- ✅ Messages de confirmation et erreurs (toast)

## Prochaines étapes possibles

1. **Ajout de fonctionnalités**:
   - Système de notifications push pour nouvelles actualités
   - Upload d'images directement (au lieu d'URLs)
   - Éditeur WYSIWYG pour le contenu
   - Ajout de pièces jointes
   - Commentaires sur les actualités
   - Planification de publication (publishAt)

2. **Améliorations UX**:
   - Pagination pour grandes listes
   - Recherche et filtres avancés
   - Tags/catégories d'actualités
   - Vue calendrier pour les événements
   - Archivage automatique des anciennes actualités

3. **Analytics**:
   - Tracking des vues
   - Statistiques de lecture par classe
   - Rapports d'engagement

## Utilisation

### Pour créer une actualité (Enseignant/Admin):

1. Aller sur `/teacher/dashboard/actualites` ou `/admin/dashboard/actualites`
2. Cliquer sur "Nouvelle Actualité"
3. Remplir le formulaire (titre, contenu requis)
4. Sélectionner au moins une classe
5. Choisir la priorité
6. Cocher "Publier immédiatement" si souhaité
7. Cliquer sur "Créer"

### Pour consulter les actualités (Étudiant):

1. Aller sur `/dashboard/actualites`
2. Voir les actualités de sa classe
3. Cliquer sur une carte pour voir les détails

### Pour gérer les actualités (Enseignant/Admin):

1. Voir la liste dans le tableau de gestion
2. Utiliser le menu "..." pour:
   - Publier/Dépublier
   - Supprimer
