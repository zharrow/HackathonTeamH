# Hackathon - Ynov Toulouse 2025 : Babyfoot du futur - IA & Data

## Equipe

- IA & Data 1 : MINTEGUI Hugo
- IA & Data 2 : AUGÉ Romain

Et si on réinventait l’expérience babyfoot à Ynov ? L’objectif de ce hackathon est de moderniser et digitaliser l’usage des babyfoots présents dans le Souk pour créer un service _next-gen_, pensé pour près de 1000 étudiants !

Que ce soit via des gadgets connectés, un système de réservation intelligent, des statistiques en temps réel ou des fonctionnalités robustes pour une utilisation massive, nous cherchons des solutions innovantes qui allient créativité et technologie.

Toutes les filières sont invitées à contribuer : Dev, Data, Infra, IoT, Systèmes embarqués… chaque idée compte pour rendre le babyfoot plus fun, plus pratique et plus connecté.

Votre mission : transformer le babyfoot classique en expérience high-tech pour Ynov !

---

# Nettoyage et préparation des données

## Découverte du dataset

Le jeu de données initial présentait de nombreuses incohérences et valeurs mal formatées. Un important travail de nettoyage et de normalisation a été réalisé afin d’assurer la fiabilité des analyses.

### Principales actions menées

- Uniformisation des formats de dates, durées et scores, notamment les colonnes `game_duration` et `possession_time` converties au format standard **MM:SS**.
- Correction des caractères corrompus (�) et suppression des doublons dans plusieurs colonnes (`winner`, `team_color`, `player_name`, etc.).
- Remplacement des valeurs manquantes ou aberrantes par `NULL` pour garantir la cohérence des calculs.
- Harmonisation des catégories textuelles (ex. : Red, Blue, Draw, Yes/No, etc.) afin d’éviter les variations d’écriture.
- Conversion des types de données : les colonnes numériques et temporelles ont été converties en formats adaptés (`INT`, `TIME`, `DATE`).
- Vérification des relations entre colonnes (scores, couleurs gagnantes, identifiants joueurs, etc.) pour s’assurer de la logique des valeurs.

Chaque colonne a été parcourue pour vérifier la cohérence des données, à l’exception de la colonne `player_age`, dont les valeurs sont incohérentes mais conservées pour un usage futur éventuel.

Le nettoyage des données a été assez poussé, réduisant considérablement les incohérences : le nombre d’erreurs restantes est très faible, bien qu’il ne soit pas nul.  
La base obtenue n’est pas parfaite, mais elle est suffisamment propre et exploitable pour une première phase d’analyse.

## Conclusions

Ce travail a permis d’obtenir une base de données homogène, cohérente et exploitable pour les analyses statistiques et les visualisations dans Power BI.

---

# Analyse exploratoire des données

## Compréhension des données

### Colonnes principales

| Catégorie                | Colonnes                                                                 | Description                                           |
|---------------------------|--------------------------------------------------------------------------|-------------------------------------------------------|
| Identifiant               | `game_id`, `player_id`, `table_id`                                       | Identifiants uniques du match, joueur et table       |
| Contexte du match         | `game_date`, `location`, `season`, `attendance_count`, `referee`, `music_playing`, `table_condition` | Informations sur l’environnement du match           |
| Performances de l’équipe  | `final_score_red`, `final_score_blue`, `winner`                          | Résultats de la partie                                |
| Joueur                    | `player_name`, `player_age`, `player_role`, `team_color`, `is_substitute`| Profil du joueur                                     |
| Statistiques individuelles| `player_goals`, `player_own_goals`, `player_assists`, `player_saves`, `possession_time` | Données de performance                               |
| Emotion                   | `mood`, `player_comment`, `rating_raw`                                   | Données subjectives et évaluatives                  |
| Technique                 | `ping_ms`, `duplicate_flag`, `misc`, `created_at`, `recorded_by`         | Métadonnées techniques et qualité des données       |

## Statistiques descriptives globales

Le rapport Power BI présente plusieurs statistiques générales visant à faciliter la compréhension des données clés du projet.  
Il inclut également le **défi Data Science**, enrichi d’une prévision visuelle sur graphique (correspondant à la partie bonus sur l’IA) permettant d’anticiper certaines tendances.  

L’ensemble des graphiques et indicateurs a été élaboré à partir de mesures **DAX personnalisées** et de l’exploitation des colonnes disponibles dans le jeu de données, garantissant une analyse cohérente et pertinente.

![stat generale](Capture_d'écran_2025-10-17_194250.png)

![Top 10 Butteur](Capture_d'écran_2025-10-17_194332.png)

![Top 5 Gardien](Capture_d'écran_2025-10-17_194408.png)

![Repartition des victoires selon la couleur de l'équipe](Capture_d'écran_2025-10-17_194420.png)

![Nombre de match par mois avec prevision par IA sur 6 mois](Capture_d'écran_2025-10-17_194434.png)

---

# Participation à l'élaboration de la base de données du projet

Dans le cadre du projet, nous avons choisi **PostgreSQL** afin de mettre en place une base de données robuste et complète, capable de centraliser l’ensemble des informations nécessaires au bon fonctionnement de l’application.  
Cette décision a permis de simplifier les requêtes et d’optimiser la récupération des données par les développeurs full stack, qui peuvent ainsi effectuer des requêtes HTTP pour afficher les informations dans l’interface utilisateur.

Le **Modèle Conceptuel de Données (MCD)**, détaillant les relations entre les différentes entités, est présenté ci-dessous :

# Modèle Conceptuel de Données (MCD)

Ce document décrit la structure de la base de données PostgreSQL du projet.  
Toutes les clés primaires et étrangères sont de type **UUID**, garantissant unicité et traçabilité dans l’ensemble du système.

---

## 🧩 Table : `user`
| Colonne       | Type / Rôle                    | Description |
|----------------|--------------------------------|-------------|
| `id`           | **UUID (PK)**                 | Identifiant unique de l’utilisateur |
| `name`         | TEXT                          | Nom de l’utilisateur |
| `email`        | TEXT                          | Adresse e-mail |
| `emailVerified`| BOOLEAN                       | Statut de vérification de l’email |
| `image`        | TEXT                          | URL de l’image de profil |
| `createdAt`    | TIMESTAMP                     | Date de création |
| `updatedAt`    | TIMESTAMP                     | Dernière mise à jour |
| `deletedAt`    | TIMESTAMP (nullable)          | Suppression logique éventuelle |
| `role`         | TEXT                          | Rôle de l’utilisateur |
| `elo`          | INTEGER                       | Score Elo du joueur |
| `wins`         | INTEGER                       | Nombre de victoires |
| `losses`       | INTEGER                       | Nombre de défaites |
| `draws`        | INTEGER                       | Nombre de matchs nuls |

---

## 🧩 Table : `account`
| Colonne                 | Type / Rôle | Description |
|--------------------------|-------------|-------------|
| `id`                     | **UUID (PK)** | Identifiant unique du compte |
| `accountId`              | TEXT        | ID du compte externe |
| `providerId`             | TEXT        | Fournisseur d’authentification (Google, GitHub, etc.) |
| `userId`                 | **UUID (FK → user.id)** | Référence vers l’utilisateur |
| `accessToken`            | TEXT        | Jeton d’accès |
| `refreshToken`           | TEXT        | Jeton de rafraîchissement |
| `idToken`                | TEXT        | Jeton d’identité |
| `accessTokenExpiresAt`   | TIMESTAMP   | Expiration du jeton d’accès |
| `refreshTokenExpiresAt`  | TIMESTAMP   | Expiration du jeton de rafraîchissement |
| `scope`                  | TEXT        | Étendue des permissions |
| `password`               | TEXT        | Mot de passe chiffré |
| `createdAt`              | TIMESTAMP   | Date de création |
| `updatedAt`              | TIMESTAMP   | Dernière mise à jour |
| `deletedAt`              | TIMESTAMP   | Suppression logique éventuelle |

---

## 🧩 Table : `session`
| Colonne       | Type / Rôle | Description |
|----------------|-------------|-------------|
| `id`           | **UUID (PK)** | Identifiant unique de session |
| `expiresAt`    | TIMESTAMP   | Date d’expiration de la session |
| `token`        | TEXT        | Jeton de session |
| `createdAt`    | TIMESTAMP   | Création |
| `updatedAt`    | TIMESTAMP   | Mise à jour |
| `ipAddress`    | TEXT        | Adresse IP du client |
| `userAgent`    | TEXT        | Informations du navigateur |
| `userId`       | **UUID (FK → user.id)** | Référence vers l’utilisateur |

---

## 🧩 Table : `verification`
| Colonne      | Type / Rôle | Description |
|---------------|-------------|-------------|
| `id`          | **UUID (PK)** | Identifiant unique |
| `identifier`  | TEXT        | Identifiant lié à la vérification |
| `value`       | TEXT        | Valeur associée |
| `expiresAt`   | TIMESTAMP   | Date d’expiration |
| `createdAt`   | TIMESTAMP   | Création |
| `updatedAt`   | TIMESTAMP   | Mise à jour |
| `deletedAt`   | TIMESTAMP   | Suppression logique éventuelle |

---

## 🧩 Table : `babyfoot`
| Colonne     | Type / Rôle | Description |
|--------------|-------------|-------------|
| `id`         | **UUID (PK)** | Identifiant unique de la table de baby-foot |
| `name`       | TEXT        | Nom ou référence de la table |
| `status`     | TEXT        | État (disponible, occupée, en maintenance…) |
| `location`   | TEXT        | Emplacement physique |
| `condition`  | TEXT        | État du matériel |

---

## 🧩 Table : `reservation`
| Colonne           | Type / Rôle | Description |
|--------------------|-------------|-------------|
| `id`               | **UUID (PK)** | Identifiant unique |
| `babyfoot_id`      | **UUID (FK → babyfoot.id)** | Table de baby-foot concernée |
| `created_at`       | TIMESTAMP   | Date de création |
| `party_date`       | DATE        | Date de la partie |
| `extended`         | BOOLEAN     | Partie prolongée ou non |
| `status`           | TEXT        | Statut de la réservation |
| `table_condition`  | TEXT        | État de la table au moment du match |
| `ball_type`        | TEXT        | Type de balle utilisée |
| `referee_id`       | **UUID (FK → user.id)** | Référence vers l’arbitre |
| `game_duration`    | TIME        | Durée du match |
| `final_score_red`  | INTEGER     | Score final de l’équipe rouge |
| `final_score_blue` | INTEGER     | Score final de l’équipe bleue |
| `result`           | TEXT        | Résultat global (Red, Blue, Draw) |
| `red_defense_id`   | **UUID (FK → user.id)** | Défenseur équipe rouge |
| `red_attack_id`    | **UUID (FK → user.id)** | Attaquant équipe rouge |
| `blue_attack_id`   | **UUID (FK → user.id)** | Attaquant équipe bleue |
| `blue_defense_id`  | **UUID (FK → user.id)** | Défenseur équipe bleue |
| `format`           | TEXT        | Format du match (1v1, 2v2, etc.) |

---

## 🧩 Table : `queueentry`
| Colonne      | Type / Rôle | Description |
|---------------|-------------|-------------|
| `id`          | **UUID (PK)** | Identifiant de l’entrée dans la file |
| `user_id`     | **UUID (FK → user.id)** | Joueur inscrit |
| `babyfoot_id` | **UUID (FK → babyfoot.id)** | Table concernée |
| `notified_at` | TIMESTAMP   | Date de notification |
| `expired_at`  | TIMESTAMP   | Expiration de la réservation ou de la file |
| `created_at`  | TIMESTAMP   | Création de l’entrée |

---

## 🔗 Relations principales
- **Un `user`** peut avoir plusieurs **`accounts`**, **`sessions`**, **`reservations`**, et **`queueentries`**.  
- **Un `babyfoot`** peut être associé à plusieurs **`reservations`** et **`queueentries`**.  
- **Une `reservation`** relie plusieurs **utilisateurs** (joueurs et arbitres) à un **babyfoot**.  
- **Une `queueentry`** indique la présence d’un utilisateur dans une file d’attente pour un babyfoot.  

---

> ✅ Tous les identifiants (`id`, `*_id`) sont de type **UUID**.  
> Ce modèle garantit la cohérence, la sécurité et la scalabilité de la base de données.


Pour initialiser la base, nous avons intégré les données issues du fichier CSV de départ à l’aide de **scripts Python** spécialement développés. Ces scripts ont permis de :

- Gérer correctement les relations entre les tables  
- Respecter les contraintes d’intégrité  
- Normaliser les données  

Cette étape a été essentielle pour garantir la cohérence des informations et faciliter le développement des fonctionnalités du projet.

Cette phase a également représenté l’étape la plus complexe, car il a fallu segmenter le fichier CSV, gérer les identifiants uniques et s’assurer que toutes les relations entre les tables soient correctement établies.  
La manipulation et l’organisation minutieuse de ces données ont été cruciales pour permettre un fonctionnement fiable et performant de la base de données.
