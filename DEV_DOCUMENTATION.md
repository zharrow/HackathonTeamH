# Documentation Technique - Développement Frontend & API

## Stack Technique

### Frontend
- **Framework** : React + Next.js 14/15 (App Router)
- **UI Library** : shadcn/ui
- **Composants Modernes** : ReactBits
- **Animations** : GSAP (GreenSock Animation Platform)
- **Style** : Tailwind CSS (via shadcn)
- **Design Direction** : Interface futuriste inspirée des sites Awwwards

### Backend/API
- **Framework** : Next.js API Routes (App Router)
- **Architecture** : API RESTful
- **ORM** : Prisma
- **Base de données** : TBD (PostgreSQL/MySQL - fournie par l'équipe Cloud/Infra)

### Authentification
- **Service** : Clerk (https://clerk.com/)
- **Features** : Gestion des rôles (utilisateur standard / administrateur)

### Infrastructure
- **Containerisation** : Docker + Docker Compose (géré par équipe Infra)
- **Cloud** : AWS (géré par équipe Infra)
- **Déploiement cible** : Linux (Debian/Ubuntu), 4Go RAM, 2 CPU x86_64

## Architecture du Projet

```
/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── babyfoot/        # CRUD Babyfoot
│   │   ├── users/           # Gestion utilisateurs
│   │   └── stats/           # Statistiques
│   ├── (auth)/              # Pages authentification
│   ├── (dashboard)/         # Dashboard admin
│   └── (public)/            # Pages publiques
├── components/
│   ├── ui/                  # shadcn components
│   ├── animations/          # GSAP animations
│   └── features/            # Feature components
├── lib/
│   ├── prisma.ts            # Prisma client singleton
│   ├── clerk/               # Clerk configuration
│   └── utils/               # Utilities
├── prisma/
│   ├── schema.prisma        # Schéma de base de données
│   └── seed.ts              # Données initiales (from Data team)
└── public/
    └── assets/              # Images, fonts, etc.
```

## Fonctionnalités Requises

### 1. Page d'Accueil (Public)
- [ ] Hero section futuriste avec animations GSAP
- [ ] Présentation du service
- [ ] Call-to-action vers inscription/connexion
- [ ] Design inspiré Awwwards (smooth scrolling, micro-interactions)

### 2. Authentification (Clerk)
- [ ] Configuration Clerk
- [ ] Sign up / Sign in
- [ ] Gestion des rôles (user / admin)
- [ ] Middleware de protection des routes
- [ ] Redirection post-authentification

### 3. Dashboard Utilisateur
- [ ] Vue des babyfoots disponibles
- [ ] Statut en temps réel
- [ ] Fonctionnalités TBD

### 4. Dashboard Administrateur
- [ ] Vue d'ensemble des babyfoots
  - État (disponible, occupé, maintenance)
  - Statistiques d'utilisation
- [ ] Gestion CRUD des babyfoots
- [ ] Gestion des utilisateurs
  - Visualisation
  - Modification des rôles
  - Suppression
- [ ] Intégration avec données IA/Data
- [ ] Intégration avec dispositifs IoT

### 5. API RESTful

#### Endpoints Babyfoot (CRUD complet)
```
GET    /api/babyfoot          # Liste tous les babyfoots
GET    /api/babyfoot/:id      # Détails d'un babyfoot
POST   /api/babyfoot          # Créer un babyfoot (admin)
PUT    /api/babyfoot/:id      # Modifier un babyfoot (admin)
DELETE /api/babyfoot/:id      # Supprimer un babyfoot (admin)
```

#### Endpoints Utilisateurs
```
GET    /api/users             # Liste utilisateurs (admin)
GET    /api/users/:id         # Détails utilisateur
PUT    /api/users/:id/role    # Modifier rôle (admin)
DELETE /api/users/:id         # Supprimer utilisateur (admin)
```

#### Endpoints Statistiques
```
GET    /api/stats             # Stats globales
GET    /api/stats/babyfoot/:id # Stats par babyfoot
```

#### Codes HTTP
- 200 : OK
- 201 : Created
- 400 : Bad Request
- 401 : Unauthorized
- 403 : Forbidden
- 404 : Not Found
- 500 : Internal Server Error

### 6. Documentation API
- [ ] Swagger / OpenAPI
- [ ] Collection Postman

## Design System (shadcn + Futuriste)

### Inspirations Awwwards
- Animations fluides et subtiles (GSAP)
- Typographie moderne et bold
- Micro-interactions sur hover/click
- Transitions de page smooth
- Glassmorphism / Neumorphism
- Particules / Background animé
- Dark mode par défaut avec accents néon

### Composants ReactBits
À intégrer pour un rendu ultra-moderne

### Palette (TBD)
- Dark theme dominant
- Accents néon (cyan, magenta, etc.)
- Contraste élevé pour accessibilité

## Bonnes Pratiques

### Code
- TypeScript strict
- Conventions de nommage cohérentes
- Code modulaire et réutilisable
- Commentaires sur logique complexe
- Gestion d'erreurs robuste

### Performance
- Lazy loading des composants
- Optimisation des images (Next.js Image)
- Code splitting automatique (Next.js)
- Minimiser les re-renders (React.memo, useMemo)

### Sécurité
- Validation des inputs (Zod)
- Protection CSRF
- Rate limiting sur API
- Variables d'environnement pour secrets

### Accessibilité
- Sémantique HTML correcte
- ARIA labels
- Contraste suffisant
- Navigation au clavier

## Intégrations à Prévoir

### Équipe Data/IA
- [ ] Récupérer le dataset nettoyé pour le seed Prisma
- [ ] Définir ensemble le schéma Prisma (tables, relations, types)
- [ ] Endpoints pour recevoir les données nettoyées
- [ ] Affichage des insights (top joueurs, meilleurs défenseurs, etc.)
- [ ] Graphiques et visualisations

### Équipe IoT/Embarqué
- [ ] Réception données temps réel
- [ ] Affichage statut babyfoot en direct
- [ ] Notifications d'événements

### Équipe Infra/Cloud
- [ ] Variables d'environnement pour DB
- [ ] Configuration Docker
- [ ] Health check endpoints

## TODO Avant Démarrage

- [ ] Définir le schéma Prisma de base de données avec équipe Data
- [ ] Obtenir credentials AWS/Database de l'équipe Infra (DATABASE_URL)
- [ ] Setup Clerk project et obtenir API keys
- [ ] Configurer Prisma et créer les migrations initiales
- [ ] Créer le script de seed avec les données nettoyées par l'équipe Data
- [ ] Définir les fonctionnalités exactes avec l'équipe
- [ ] Wireframes/Maquettes des pages principales
- [ ] Choisir le nom du projet/branding

## Ressources

### Design Inspiration
- https://www.awwwards.com/websites/animation/
- https://www.awwwards.com/websites/dark/

### Documentation
- Next.js: https://nextjs.org/docs
- shadcn/ui: https://ui.shadcn.com/
- GSAP: https://greensock.com/docs/
- Clerk: https://clerk.com/docs
- Prisma: https://www.prisma.io/docs
- ReactBits: [À compléter avec URL]

### Outils
- Figma/Excalidraw pour wireframes
- Postman pour tests API
- Docker Desktop pour tests locaux

## Notes

- **Date limite** : Vendredi 17 octobre 2025 à 21h00
- **Priorité** : Fonctionnel > Perfection
- **Collaboration** : Communication constante avec autres équipes
- Le code généré par IA doit être revu et adapté
