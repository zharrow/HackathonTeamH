# Hackathon - Ynov Toulouse 2025 : Babyfoot du futur - FullStack

## Equipe

- Dev' FullStack 1 : ALBORA Florian
- Dev' FullStack 2 : NOM Prénom
- Dev' FullStack 3 : NOM Prénom

Et si on réinventait l’expérience babyfoot à Ynov ? L’objectif de ce hackathon est de moderniser et digitaliser l’usage des babyfoots présents dans le Souk pour créer un service _next-gen_, pensé pour près de 1000 étudiants !

Que ce soit via des gadgets connectés, un système de réservation intelligent, des statistiques en temps réel ou des fonctionnalités robustes pour une utilisation massive, nous cherchons des solutions innovantes qui allient créativité et technologie.

Toutes les filières sont invitées à contribuer : Dev, Data, Infra, IoT, Systèmes embarqués… chaque idée compte pour rendre le babyfoot plus fun, plus pratique et plus connecté.

Votre mission : transformer le babyfoot classique en expérience high-tech pour Ynov !

---

> Ce fichier contient les informations spécifiques au développement FullStack de votre projet. Il suffit d'en remplir une seule fois, même si vous êtes plusieurs développeurs FullStack dans l'équipe.

# Requis

Ce README contient les requis fonctionnels de la partie FullStack de votre projet. Il doit compléter le README principal à la racine du projet, et servira la partie de votre note propre à votre spécialité.

Basez-vous sur les spécifications dans [SPECIFICATIONS.md](../SPECIFICATIONS.md) pour remplir ce document.

Décrivez ici les fonctionnalités que vous avez implémentées, votre démarche, les choix techniques que vous avez faits, les difficultés rencontrées, etc. Précisez également dans quelle mesure vous avez pu collaborer avec les autres spécialités.

Autrement, il n'y a pas de format imposé, mais essayez de rester clair et concis, je ne vous demande pas de rédiger un roman, passez à l'essentiel, et épargnez-moi de longues pages générées par IA (malusée).

En conclusion, cela doit résumer votre travail en tant que développeur.se FullStack, et vous permettre de garder un trace écrite de votre contribution au projet.

Merci de votre participation, et bon courage pour la suite du hackathon !

---

# Présentation du projet.

## 🎯 **Pitch Projet - Babyfoot Booking Ynov**

**"Transformons l'expérience babyfoot à Ynov en une plateforme digitale compétitive et intelligente !"**

Notre solution **Babyfoot Booking** modernise complètement l'usage des babyfoots du campus pour près de 1000 étudiants.

**Le problème** : Gestion chaotique des tables, pas de suivi des performances, files d'attente non organisées.

**Notre solution** :

- **Réservation intelligente** en créneaux de 15 minutes avec anti-chevauchement
- **Système ELO** pour classer les joueurs et créer de la compétition
- **File d'attente** automatique quand les tables sont pleines
- **Dashboard admin** complet pour gérer tables, utilisateurs et statistiques
- **Interface futuriste** dark + néon avec animations GSAP

**Stack technique** : Next.js 15 + TypeScript + Prisma + PostgreSQL + Better-Auth + shadcn/ui

**Impact** : Une expérience gamifiée qui transforme le babyfoot en véritable sport compétitif, avec classements, statistiques et notifications en temps réel. Les étudiants peuvent réserver, jouer, progresser et se mesurer aux autres dans un environnement moderne et connecté.

**Résultat** : Un babyfoot "next-gen" qui booste l'engagement étudiant et crée une vraie communauté compétitive autour du sport ! 🏆

## 💻 **Stack technique**

## 🛠️ **Stack Technique - Points Clés**

### **Frontend**

- **Next.js 15** (App Router) - Framework React avec SSR/SSG

> Nous avons choisi **Next.js (v15, App Router)** car il permet de développer une application **fullstack moderne**, performante et bien structurée dans un >**même framework**.
> Il combine **frontend réactif** et **API backend** en un seul environnement, ce qui simplifie la maintenance et accélère le développement — un atout clé dans >un contexte de **hackathon**.
>
> **Justifications principales :**
>
> - **Architecture unifiée** : Next.js App Router permet d’héberger le frontend et le backend (API Routes) dans un seul monorepo, idéal pour un MVP rapide et cohérent.
> - **Performances natives** : Rendu côté serveur (SSR) et génération statique (SSG) intégrés, optimisant le temps de chargement et le référencement.
> - **API intégrée** : Les routes `app/api/` servent directement de points d’entrée REST sécurisés sans besoin d’un serveur séparé (comme Express).
> - **Scalabilité** : Compatible avec l’hébergement moderne (Vercel, Docker, etc.) et les middlewares edge.

---

- **TypeScript** - Typage statique pour la robustesse
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Composants UI modernes (Radix UI)

> Nous avons choisi shadcn/ui combiné à TailwindCSS pour accélérer la conception d’une interface moderne et cohérente.
> shadcn/ui fournit des composants réutilisables, accessibles et typés en TypeScript, parfaitement intégrés à l’écosystème React/Next.js, tandis que TailwindCSS permet un style rapide, maintenable et responsive.
> Ensemble, ils offrent un design dark + néon fluide, aligné avec notre identité visuelle et l’esprit futuriste du projet.

---

- **GSAP** - Animations fluides et micro-interactions
- **next-intl** - Internationalisation (FR/EN)
- **Sonner** - Notifications toast/push

### **Backend & API**

- **Next.js API Routes** - API REST intégrée
- **Prisma ORM** - Gestion base de données type-safe
- **PostgreSQL** - Base de données relationnelle
- **Zod** - Validation des schémas et inputs
- **Better-Auth** - Authentification (email/password + GitHub OAuth)

### **Base de Données**

- **PostgreSQL** - Stockage des données
- **Prisma ORM** -

> Nous avons choisi Prisma comme ORM pour sa simplicité, sa robustesse et sa parfaite intégration avec TypeScript et PostgreSQL.
> Il permet une gestion claire du schéma de données, des migrations automatisées et un typage fort côté backend, réduisant ainsi les erreurs.
> Son client généré automatiquement offre une syntaxe fluide et lisible, idéale pour un développement rapide en contexte de hackathon.
> Combiné à PostgreSQL, il assure une base de données fiable, relationnelle et scalable, adaptée à la gestion des réservations, utilisateurs et statistiques du projet.

### **Authentification**

- **Better Auth**

> Nous avons choisi Better Auth pour sa rapidité d’implémentation et sa simplicité de configuration, des atouts essentiels dans un contexte de hackathon où le temps est limité. La solution offre une gestion des rôles intégrée, un stockage de sessions efficace et une manipulation simplifiée des JWT, ce qui permet de sécuriser rapidement l’application sans complexité excessive. Ce choix nous a permis d’avoir une authentification fiable, légère et parfaitement adaptée à notre stack fullstack moderne.
>
> Elle offre également une intégration très simple des providers externes comme Google, GitHub ou d’autres réseaux sociaux, facilitant la connexion des utilisateurs en un clic. Ce choix nous a permis de déployer rapidement une authentification complète, fluide et parfaitement adaptée à notre stack fullstack moderne.

## **⚠️ Difficultés rencontrés**

La principale difficulté rencontrée durant ce hackathon a été la gestion du travail en équipe dans un temps très limité. Il a fallu rapidement s’organiser, définir les rôles et répartir les tâches de manière efficace pour avancer sans se bloquer mutuellement. Cette contrainte de temps a mis en évidence l’importance de la communication et de la coordination technique dans un projet collaboratif.

Sur le plan technique, j’ai également rencontré des difficultés liées à l’implémentation de l’authentification. J’ai testé plusieurs solutions, notamment Clerk et Auth.js, qui se sont révélées plus complexes à configurer dans notre environnement Next.js qu’anticipé.
C’est ce qui m’a conduit à opter pour Better Auth, une alternative plus légère et plus adaptée au contexte du hackathon, offrant une intégration rapide, une gestion simplifiée des rôles et une configuration fluide des providers externes.

Voici la **liste claire et structurée** des fonctionnalités que vous avez implémentées pour **Babyfoot Booking** 👇

---

## ⚙️ Fonctionnalités Implémentées

### Authentification & Autorisation

- Authentification via Clerk avec gestion des sessions et comptes utilisateurs
- **RBAC (Role-Based Access Control)** : rôles **USER** et **ADMIN**
- Protection des routes et API selon les rôles
- Connection avec **Github**

---

### Système de Réservation

- Réservation en **créneaux de 15 minutes** sans chevauchement
- **Anti-chevauchement intelligent** avec gestion d’erreur **409 Conflict**
- **File d’attente automatique** lorsqu’aucune table n’est disponible
- Possibilité de **prolonger** ou **terminer** une réservation
- **Formats de match** : 1v1, 1v2, 2v2
- **Gestion des scores** et résultats de match intégrés

---

### Système ELO & Compétition

- **Classement ELO dynamique** mis à jour après chaque match
- Calcul automatique du score ELO selon les performances des joueurs
- Mise en avant du **joueur MVP** avec animations GSAP
- **Leaderboard** des meilleurs joueurs
- **Statistiques détaillées** : victoires, défaites, nuls

---

### Dashboard Administrateur

- CRUD complet des **tables de babyfoot**
- Gestion des **utilisateurs** (changement de rôle, suppression)
- Vue d’ensemble sur **les réservations** et **les files d’attente**
- **Statistiques en temps réel** (taux d’occupation, top joueurs, etc.)
- Interface de gestion **avancée avec pagination et filtres**

---

### Interface Utilisateur

- **Page d’accueil** immersive présentant le service
- **Dashboard utilisateur** pour gérer ses réservations et consulter son historique
- **Notifications push** via **Sonner**
- **Design futuriste** dark + accents néon
- **Responsive Design** adapté mobile & tablette
- **Multilingue (FR/EN)** via **next-intl**

---

### API REST

- API complète documentée avec **OpenAPI/Swagger**
- Endpoints REST sécurisés et typés
- Codes HTTP standardisés : 200, 201, 400, 401, 403, 404, 409, 500
- **Pagination et filtres avancés** sur les ressources principales

---

### **Fonctionnalités Spéciales**

- **Système ELO** - Calcul de classement des joueurs
- **File d'attente** - Gestion intelligente des réservations
- **RBAC** - Contrôle d'accès basé sur les rôles (USER/ADMIN)
- **Responsive Design** - Interface adaptative mobile/desktop
