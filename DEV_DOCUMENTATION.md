# 🧠 Documentation Technique — Projet "Babyfoot Booking" (Hackathon Ynov Toulouse 2025)

## 1. 🎯 Contexte & Objectifs

L’objectif est de créer une **application web intelligente** permettant aux étudiants et administrateurs Ynov de **réserver, gérer et visualiser en temps réel l’utilisation des babyfoots** du campus.  
L’application inclura :
- un système de **réservation de 15 min** avec **anti-chevauchement**,
- une **file d’attente** automatique si la table est complète,
- la possibilité de **terminer plus tôt ou prolonger** une partie,
- un **dashboard utilisateur et admin**,
- et des **statistiques avancées** sur les usages.

---

## 2. 🧱 Stack Technique

| Côté | Technologie | Détails |
|------|--------------|---------|
| **Frontend** | **Next.js 15 (App Router)** | SPA/SSR combiné |
| | **React + TypeScript** | Écosystème complet |
| | **shadcn/ui** | Composants UI modernes et typés |
| | **GSAP** | Animations fluides |
| | **Tailwind CSS** | Design futuriste (dark + néon) |
| **Backend/API** | **Next.js API Routes** | RESTful architecture |
| | **Prisma ORM** | PostgreSQL |
| | **Zod** | Validation d’inputs |
| **Auth** | **Clerk** | RBAC USER / ADMIN |
| **Infra** | **Docker** + `docker-compose` | DB + App |
| **Docs** | **OpenAPI / Swagger** + Postman | Documentation API |

---

## 3. 🗂️ Architecture du Projet

```
/
├── app/
│   ├── api/
│   │   ├── babyfoot/             # CRUD Admin des babyfoots
│   │   ├── reservations/         # Gestion des réservations
│   │   ├── queue/                # File d’attente
│   │   ├── stats/                # Statistiques
│   │   └── users/                # Gestion utilisateurs (Admin)
│   ├── (auth)/                   # Pages Clerk
│   ├── (user)/dashboard/         # Dashboard utilisateur
│   ├── (admin)/dashboard/        # Dashboard admin
│   └── (public)/                 # Pages publiques (Home, Présentation)
├── components/
│   ├── ui/                       # shadcn components
│   ├── charts/                   # Graphiques stats
│   ├── forms/                    # Formulaires Zod
│   └── features/                 # Composants métiers (BookingCard, QueueStatus)
├── lib/
│   ├── prisma.ts                 # Prisma client
│   ├── auth.ts                   # Clerk + RBAC
│   └── validations/              # Zod schemas
├── prisma/
│   ├── schema.prisma             # Modèle BDD
│   └── seed.ts                   # Données mockées
├── public/assets/
├── scripts/
│   └── openapi.ts                # Génération Swagger
└── README.md
```

---

## 4. ⚙️ Modèle de Données (Prisma)

```prisma
model User {
  id           String   @id @default(cuid())
  clerkId      String   @unique
  email        String   @unique
  role         Role     @default(USER)
  reservations Reservation[]
  queue        QueueEntry[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum Role { USER ADMIN }

model Babyfoot {
  id           String         @id @default(cuid())
  name         String         @unique
  location     String
  status       BabyfootStatus @default(AVAILABLE)
  reservations Reservation[]
  queue        QueueEntry[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Reservation {
  id           String   @id @default(cuid())
  userId       String
  babyfootId   String
  startAt      DateTime
  endAt        DateTime
  finishedAt   DateTime?
  extended     Boolean   @default(false)
  format       MatchFormat
  status       ReservationStatus @default(CONFIRMED)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id])
  babyfoot  Babyfoot @relation(fields: [babyfootId], references: [id])
}

model QueueEntry {
  id          String   @id @default(cuid())
  userId      String
  babyfootId  String
  notifiedAt  DateTime?
  expiredAt   DateTime?
  createdAt   DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
  babyfoot  Babyfoot @relation(fields: [babyfootId], references: [id])
}

enum BabyfootStatus { AVAILABLE OCCUPIED MAINTENANCE }
enum MatchFormat { ONE_VS_ONE ONE_VS_TWO TWO_VS_TWO }
enum ReservationStatus { PENDING CONFIRMED IN_PROGRESS FINISHED CANCELLED EXPIRED }
```

---

## 5. 🔌 API REST — Contrat

### **Babyfoot (Admin)**
```
GET    /api/babyfoot
GET    /api/babyfoot/:id
POST   /api/babyfoot
PUT    /api/babyfoot/:id
DELETE /api/babyfoot/:id
PATCH  /api/babyfoot/:id/status
```

### **Réservations**
```
GET    /api/reservations
POST   /api/reservations                 # création (15min slot)
PATCH  /api/reservations/:id/finish      # terminer avant la fin
PATCH  /api/reservations/:id/extend      # prolonger la session
DELETE /api/reservations/:id             # annuler
```

### **File d’attente**
```
POST   /api/queue                        # rejoindre la file
GET    /api/queue/:babyfootId            # voir file d’attente actuelle
DELETE /api/queue/:id                    # quitter la file
```

### **Utilisateurs (Admin)**
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id/role
DELETE /api/users/:id
```

### **Statistiques**
```
GET    /api/stats                        # globales
GET    /api/stats/babyfoot/:id           # par table
```

---

## 6. 🧩 Règles Métier

- ⏱ Durée par défaut : **15 min**  
- 🔒 Aucune réservation chevauchante par babyfoot  
- 🕓 Un utilisateur peut :
  - Terminer avant la fin → `/finish`
  - Prolonger → `/extend`
- ⛔ Si slot complet → retour 409 `{ queueAvailable: true }`
- 🧍 L’utilisateur peut alors rejoindre la **file d’attente**
- ⚙️ L’admin peut forcer la libération ou la mise en maintenance
- 🪄 Statut du babyfoot = `OCCUPIED` si une réservation `IN_PROGRESS` existe

---

## 7. 📈 Statistiques & Graphiques (shadcn/ui + Recharts)

| Indicateur | Type de chart | Objectif |
|-------------|----------------|-----------|
| ⏳ Temps entre création et début | Boxplot / Histogramme | Analyse d’anticipation |
| 🕒 Durée moyenne effective | Bar chart | Temps réel vs prévu |
| 🔥 Heures d’affluence | Heatmap / Grouped bar | Pics d’activité |
| ⚽ Formats (1v1 / 1v2 / 2v2) | Donut chart | Répartition des matchs |
| 🚦 Taille moyenne de file | Line chart | Mesure de la demande |
| 📉 Nombre d’annulations / extensions | Bar chart | Suivi d’usage |

---

## 8. 🧑‍💻 Répartition des Features (3 Développeurs)

| Dev | Domaine | Tâches principales |
|------|-----------|-----------------------------|
| **Dev A** | 🎮 Réservation (User) | CRUD réservation, anti-chevauchement, UI calendrier, file d’attente |
| **Dev B** | 🛠️ Dashboard Admin | CRUD babyfoots, gestion utilisateurs, statistiques, charts |
| **Dev C** | 🎨 UX & Temps Réel | Intégration shadcn + GSAP, statut live, UI futuriste, responsive |

---

## 9. 🧪 Données Mockées (Seed)

`prisma/seed.ts` :
- 3 babyfoots (`Souk A`, `Souk B`, `Rooftop`)
- 5 users (`admin@ynov.local`, `user1..4`)
- 10 réservations (certaines prolongées / terminées tôt)
- 2 files d’attente actives

---

## 10. 🧰 TODO Avant Démarrage

- [ ] Initialiser projet Next.js + shadcn + Clerk
- [ ] Définir `.env.example` avec `CLERK_*`, `DATABASE_URL`
- [ ] Créer et migrer `schema.prisma`
- [ ] Générer `prisma/seed.ts` mock
- [ ] Mettre en place les routes `/api/reservations`, `/api/queue`
- [ ] Créer Dashboard Admin + User
- [ ] Intégrer charts shadcn/ui
- [ ] Tester les règles métier (chevauchement, file, prolongation)
- [ ] Ajouter OpenAPI / Swagger / Postman
- [ ] Dockeriser le projet

---

## 11. 🔒 Sécurité & Qualité

- Clerk middleware sur routes `(user)` & `(admin)`
- Validation Zod sur toutes les requêtes
- Codes HTTP standard (200, 201, 400, 401, 403, 404, 409, 422, 500)
- Rate limiting sur endpoints sensibles
- ESLint, Prettier, TypeScript strict
- Tests unitaires sur anti-chevauchement et file d’attente

---

## 12. 🎨 Design System

- Thème : **Dark futuriste**, accents **cyan / magenta néon**
- Micro-interactions GSAP sur hover et transitions
- Layout responsive grid, cards glassmorphism
- Font moderne & contrastée
- Accessibilité (focus visible, ARIA, labels)

---

## 13. 🧾 Variables d’Environnement (exemple)

```
# Auth Clerk
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
DATABASE_URL=postgresql://user:pass@db:5432/babyfoot

# Next
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 14. 🧩 Définition de Terminé (DoD)

- [ ] Auth Clerk & RBAC fonctionnels  
- [ ] Réservation sans chevauchement  
- [ ] File d’attente opérationnelle  
- [ ] CRUD Babyfoot & Users OK  
- [ ] Dashboards User/Admin complets  
- [ ] Charts shadcn/ui fonctionnels  
- [ ] OpenAPI généré & Postman exporté  
- [ ] Docker build & run OK  
- [ ] README clair & seed fonctionnel

---

## 15. 🧭 Bonnes Pratiques

- PR petites & claires (Conventional Commits)
- Pas de logique de sécurité côté client
- Commenter les logiques métiers complexes
- Favoriser composants réutilisables et typés
- Priorité à la **stabilité** et **expérience utilisateur**

---

💬 **Dernière remarque :**  
Le projet doit être **fonctionnel avant d’être parfait**.  
Les animations, micro-interactions et esthétisme sont un bonus — la robustesse des réservations et des statistiques passe en premier.
