# Babyfoot Booking - Ynov Toulouse

Plateforme de gestion et réservation de tables de babyfoot pour Ynov Toulouse.

## 🚀 Stack Technique

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Base de données**: PostgreSQL + Prisma ORM
- **Authentification**: Better-Auth (email/password + GitHub OAuth)
- **UI**: Tailwind CSS + shadcn/ui
- **Internationalisation**: next-intl (FR/EN)
- **Animations**: GSAP (micro-interactions)

## 📋 Prérequis

- Node.js 18+ (LTS recommandé)
- pnpm (gestionnaire de paquets)
- PostgreSQL 14+
- Docker & Docker Compose (optionnel, pour faciliter le déploiement)

## ⚙️ Installation

1. **Cloner le repository**

   ```bash
   git clone <repo-url>
   cd hackathon
   ```

2. **Installer les dépendances**

   ```bash
   pnpm install
   ```

3. **Configurer les variables d'environnement**

   ```bash
   cp env.example .env.local
   ```

   Remplir les variables dans `.env.local`:

   - `DATABASE_URL`: URL de connexion PostgreSQL
   - `BETTER_AUTH_SECRET`: Secret pour Better-Auth (32+ caractères)
   - `BETTER_AUTH_URL`: URL de base de l'application
   - `GITHUB_ID` & `GITHUB_SECRET`: OAuth GitHub (optionnel)

4. **Initialiser la base de données**
   ```bash
   pnpm db:push              # Créer les tables
   pnpm db:seed              # Insérer les données de test
   pnpm db:seed-users        # Importer les utilisateurs depuis users.json (optionnel)
   pnpm db:seed-tables       # Importer les tables de babyfoot depuis tables.json (optionnel)
   pnpm db:seed-reservations # Générer 50 réservations aléatoires (optionnel)
   ```

## 🏃 Lancement en développement

```bash
pnpm dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🔐 Authentification

### Comptes de test (après seed)

- **Admin**: `admin@ynov.com` / `password123`
- **User**: `user1@ynov.com` / `password123`

### Configuration GitHub OAuth

1. Créer une OAuth App sur GitHub
2. Callback URL: `http://localhost:3000/api/auth/callback/github`
3. Copier Client ID et Secret dans `.env.local`

## 📦 Scripts disponibles

```bash
pnpm dev                 # Développement
pnpm build               # Build production
pnpm start               # Lancer en production
pnpm lint                # Vérification ESLint
pnpm db:push             # Appliquer les changements du schéma Prisma
pnpm db:seed             # Seed la base de données avec des données de test
pnpm db:seed-users       # Importer les utilisateurs depuis users.json
pnpm db:seed-tables      # Importer les tables de babyfoot depuis tables.json
pnpm db:seed-reservations # Générer 50 réservations aléatoires
pnpm db:studio           # Interface Prisma Studio
```

## 🏗️ Architecture

```
/app
  /[locale]       # Routes internationalisées
    /admin        # Dashboard admin (RBAC)
    /sign-in      # Connexion
    /sign-up      # Inscription
  /api
    /auth         # Routes Better-Auth
    /admin        # API admin
/components       # Composants réutilisables
/lib              # Utilitaires & configs
/prisma           # Schéma & migrations
```

## 🔒 RBAC (Role-Based Access Control)

- **USER**: Réservation de tables, consultation
- **ADMIN**: Gestion complète (tables, users, reservations)

## 🌐 Internationalisation

Langues supportées:

- Français (par défaut)
- Anglais

Changer de langue via le sélecteur dans le header.

## 🐳 Docker (Production)

```bash
docker-compose up -d
```

## 📝 Documentation

- [SPECIFICATIONS.md](./SPECIFICATIONS.md) - Spécifications fonctionnelles
- [DEV_DOCUMENTATION.md](./DEV_DOCUMENTATION.md) - Documentation technique
- [PROMPT_VIBE_CODER.md](./PROMPT_VIBE_CODER.md) - Brief de développement

## 🤝 Contribution

Voir [CONTRIBUTORS](./CONTRIBUTORS) pour la liste des contributeurs.

## 📄 License

MIT
