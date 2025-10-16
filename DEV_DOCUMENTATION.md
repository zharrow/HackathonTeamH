# 🧠 Documentation Technique — Projet "Babyfoot Booking" (Hackathon Ynov Toulouse 2025)

## 1. 🎯 Contexte & Objectifs

Créer une **application web intelligente** pour les étudiants et administrateurs Ynov, permettant de **réserver, gérer et visualiser l’utilisation des babyfoots** du campus.

Fonctionnalités principales :
- Réservation en créneaux de **15 minutes**, sans chevauchement.
- **File d’attente** intelligente si la table est complète.
- Possibilité de **terminer ou prolonger** une réservation.
- **Classement des joueurs via système ELO**, basé sur leurs résultats.
- **Joueur MVP** mis en avant grâce à ses performances.
- **Dashboards** utilisateurs et administrateurs avec statistiques détaillées.

---

## 2. 🧱 Stack Technique

| Côté | Technologie | Détails |
|------|--------------|---------|
| **Frontend** | **Next.js 15 (App Router)** | SPA/SSR combiné |
| | **React + TypeScript** | Écosystème complet |
| | **shadcn/ui** | UI Components (moderne et typé) |
| | **GSAP** | Animations fluides |
| | **ReactBits (Electric Border)** | Carte MVP animée |
| | **Tailwind CSS** | Design futuriste dark + néon |
| **Backend/API** | **Next.js API Routes** | RESTful architecture |
| | **Prisma ORM** | PostgreSQL |
| | **Zod** | Validation d’inputs |
| **Auth** | **Clerk** | RBAC USER / ADMIN |
| **Infra** | **Docker + Docker Compose** | Déploiement local & cloud |
| **Docs** | **OpenAPI / Swagger + Postman** | Documentation API |

---

## 3. 🗂️ Architecture du Projet

```
/
├── app/
│   ├── api/
│   │   ├── babyfoot/             # CRUD Admin des babyfoots
│   │   ├── reservations/         # Gestion des réservations
│   │   ├── queue/                # File d’attente
│   │   ├── stats/                # Statistiques & classement ELO
│   │   └── users/                # Gestion utilisateurs (Admin)
│   ├── (auth)/                   # Pages Clerk
│   ├── (user)/dashboard/         # Dashboard utilisateur
│   ├── (admin)/dashboard/        # Dashboard admin
│   └── (public)/                 # Accueil (Présentation + MVP)
├── components/
│   ├── ui/                       # shadcn components
│   ├── charts/                   # Graphiques (stats)
│   ├── features/                 # BookingCard, QueueStatus, MvpPlayerCard
│   ├── animations/               # GSAP & ReactBits
│   └── forms/                    # Zod + RHF
├── lib/
│   ├── prisma.ts                 # Prisma client
│   ├── auth.ts                   # Clerk + RBAC
│   ├── elo.ts                    # Calcul ELO
│   └── validations/              # Schémas Zod
├── prisma/
│   ├── schema.prisma             # Modèle de données
│   └── seed.ts                   # Données mockées
└── scripts/
    └── openapi.ts                # Swagger generation
```

---

## 4. ⚙️ Modèle de Données (Prisma)

```prisma
model User {
  id           String   @id @default(cuid())
  clerkId      String   @unique
  email        String   @unique
  role         Role     @default(USER)
  nickname     String?
  elo          Float    @default(1000)
  wins         Int      @default(0)
  losses       Int      @default(0)
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
  result       MatchResult?
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
enum MatchResult { WIN LOSS DRAW }
```

---

## 5. ⚙️ Système ELO — Calcul & Règles

Chaque joueur a un score initial `ELO = 1000`.

Lorsqu’une partie est terminée :
1. On calcule la **probabilité de victoire** :
   `expectedScore = 1 / (1 + 10^((elo_opponent - elo_player)/400))`
2. On applique :
   `newElo = oldElo + K * (result - expectedScore)`
   - `K = 32`
   - `result = 1` (victoire), `0.5` (match nul), `0` (défaite)
3. Mise à jour :
   - `elo`, `wins`, `losses`
   - `result` dans `Reservation`

📦 Le calcul est effectué dans `lib/elo.ts` à l’appel de `/api/reservations/:id/finish`.

---

## 6. 🧩 API REST — Contrat

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
POST   /api/reservations
PATCH  /api/reservations/:id/finish
PATCH  /api/reservations/:id/extend
DELETE /api/reservations/:id
```

### **File d’attente**
```
POST   /api/queue
GET    /api/queue/:babyfootId
DELETE /api/queue/:id
```

### **Utilisateurs (Admin)**
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id/role
DELETE /api/users/:id
```

### **Statistiques & Classements**
```
GET    /api/stats
GET    /api/stats/mvp
GET    /api/stats/leaderboard
GET    /api/stats/babyfoot/:id
```

---

## 7. 🧠 Joueur MVP (ReactBits “Electric Border”)

### Composant : `MvpPlayerCard.tsx`
Affiche :
- 🏆 Nom / pseudo du joueur MVP
- 📈 ELO, victoires, défaites
- 🎨 Animation *Electric Border* (ReactBits)
- 🪩 Style magenta/cyan futuriste

Placements :
- Page d’accueil publique
- Dashboard admin (“Top joueur du moment”)

---

## 8. 📈 Statistiques & Graphiques

| Indicateur | Type de chart | Objectif |
|-------------|----------------|-----------|
| Temps entre création et début | Boxplot / Histogramme | Anticipation |
| Durée moyenne effective | Bar chart | Temps réel vs prévu |
| Heures d’affluence | Heatmap / Grouped bar | Pics d’activité |
| Formats de match | Donut chart | Répartition |
| Taille moyenne de file | Line chart | Demande |
| Annulations / extensions | Bar chart | Suivi |
| **Top 10 ELO** | Horizontal bar | Classement joueurs |
| **Progression ELO joueur** | Line chart | Performance historique |

---

## 9. 🧑‍💻 Répartition des Features

| Dev | Domaine | Responsabilités principales |
|------|-----------|-----------------------------|
| **Dev A** | 🎮 Réservation | CRUD, file d’attente, anti-chevauchement, maj ELO |
| **Dev B** | 🛠️ Dashboard Admin | CRUD Babyfoots, leaderboard, stats, MVP |
| **Dev C** | 🎨 UI/UX & Temps réel | ReactBits, shadcn, GSAP, dark futuriste |

---

## 10. 🧪 Données Mockées (Seed)

`prisma/seed.ts` :
- 5 utilisateurs (dont 1 admin)
- 3 babyfoots
- 10 réservations avec résultats variés
- Scores ELO ajustés
- 2 files d’attente simulées

---

## 11. 🧰 TODO Avant Démarrage

- [ ] Init Next.js + shadcn + Clerk
- [ ] Configurer Prisma + seed mock
- [ ] Implémenter routes + calcul ELO
- [ ] Créer `MvpPlayerCard.tsx`
- [ ] Intégrer leaderboard
- [ ] Ajouter charts shadcn/ui
- [ ] Dockeriser & OpenAPI
- [ ] Tester réservations / file / ELO

---

## 12. 🎨 Design System

- Thème : **Dark futuriste**, accents **cyan/magenta**
- shadcn + ReactBits
- GSAP micro-animations
- Layout responsive
- Typo bold, contrastée
- A11y complète

---

## 13. 🧩 Définition de Terminé (DoD)

- [ ] Auth Clerk OK
- [ ] Réservation 15 min anti-chevauchement
- [ ] File d’attente active
- [ ] CRUD Babyfoot & Users
- [ ] ELO dynamique & leaderboard
- [ ] MVP Card visible
- [ ] Charts OK
- [ ] OpenAPI + Docker OK

---

## 14. 🧭 Bonnes Pratiques

- Code typé, clair et commenté
- Conventions PR cohérentes
- Zod validation obligatoire
- Calculs côté serveur uniquement
- Priorité stabilité + UX

---

💬 **Conclusion :**
Un projet **fluide, compétitif et fun**, combinant **réservation intelligente**, **classement dynamique** et **design futuriste**.
