# 📚 Documentation API - Babyfoot Management

## 🚀 Accès à la documentation

### Interface Swagger UI

Visitez l'interface interactive Swagger UI à l'adresse :

```
http://localhost:3000/api/docs
```

### Fichier OpenAPI/Swagger

Le fichier YAML complet est disponible à :

```
http://localhost:3000/api/swagger.yaml
```

## 📋 Vue d'ensemble des endpoints

### 🔐 Authentification

- `POST /api/auth/register` - Inscription d'un nouvel utilisateur

### 👤 Réservations utilisateur

- `GET /api/reservations` - Lister les réservations de l'utilisateur
- `POST /api/reservations` - Créer une nouvelle réservation
- `GET /api/reservations/{id}` - Obtenir une réservation par ID
- `PATCH /api/reservations/{id}` - Mettre à jour le statut d'une réservation
- `DELETE /api/reservations/{id}` - Annuler une réservation

### ⏳ Système de files d'attente

- `GET /api/queue` - Obtenir la position dans la file d'attente

### 🔧 Administration

- `GET /api/admin/reservations` - Lister toutes les réservations
- `POST /api/admin/reservations` - Créer une réservation (admin)
- `GET /api/admin/reservations/{id}` - Obtenir une réservation par ID
- `PATCH /api/admin/reservations/{id}` - Mettre à jour une réservation
- `DELETE /api/admin/reservations/{id}` - Supprimer une réservation
- `GET /api/admin/reservations/queues` - Obtenir toutes les files d'attente

### 🏓 Gestion des tables

- `GET /api/admin/tables` - Lister toutes les tables
- `POST /api/admin/tables` - Créer une nouvelle table
- `GET /api/admin/tables/{id}` - Obtenir une table par ID
- `PATCH /api/admin/tables/{id}` - Mettre à jour une table
- `DELETE /api/admin/tables/{id}` - Supprimer une table

### 👥 Gestion des utilisateurs

- `GET /api/admin/users` - Lister tous les utilisateurs
- `GET /api/admin/users/{id}` - Obtenir un utilisateur par ID
- `DELETE /api/admin/users/{id}` - Supprimer un utilisateur
- `PATCH /api/admin/users/{id}/role` - Modifier le rôle d'un utilisateur

### 📊 Statistiques

- `GET /api/admin/stats/reservations` - Statistiques des réservations
- `GET /api/admin/stats/tables` - Statistiques des tables
- `GET /api/admin/stats/users` - Statistiques des utilisateurs

## 🔑 Authentification

L'API utilise un système d'authentification basé sur JWT. Pour accéder aux endpoints protégés :

1. **Inscription** : `POST /api/auth/register`
2. **Connexion** : Via Clerk (intégré)
3. **Token** : Inclure le token JWT dans l'en-tête `Authorization: Bearer <token>`

## 📝 Exemples d'utilisation

### Créer une réservation

```bash
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "babyfootId": "uuid-table-id",
    "partyDate": "2024-01-15T14:00:00Z",
    "refereeId": "uuid-user-id",
    "redDefenseId": "uuid-user-id",
    "redAttackId": "uuid-user-id",
    "blueDefenseId": "uuid-user-id",
    "blueAttackId": "uuid-user-id"
  }'
```

### Lister les tables disponibles

```bash
curl -X GET "http://localhost:3000/api/admin/tables?status=AVAILABLE" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Obtenir les files d'attente

```bash
curl -X GET http://localhost:3000/api/admin/reservations/queues \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎯 Fonctionnalités clés

### Système de files d'attente

- **Premier arrivé** → Statut `CONFIRMED`
- **Suivants** → Statut `PENDING` (file d'attente)
- **Promotion automatique** quand une réservation confirmée est annulée

### Gestion des conflits

- **Vérification automatique** des créneaux disponibles
- **Réponse 409** en cas de conflit
- **Durée fixe** de 15 minutes par partie

### Pagination et filtres

- **Pagination** : `page`, `limit`
- **Filtres** : `status`, `babyfootId`, `search`
- **Vues calendrier** : `viewMode` (day/week/month)

## 🚨 Codes d'erreur

- `200` - Succès
- `201` - Créé avec succès
- `400` - Données invalides
- `401` - Non authentifié
- `403` - Accès non autorisé
- `404` - Ressource non trouvée
- `409` - Conflit (créneau occupé)
- `500` - Erreur serveur

## 🛠️ Développement

### Ajouter un nouvel endpoint

1. Créer le fichier route dans `app/api/`
2. Mettre à jour `swagger.yaml`
3. Redémarrer le serveur pour voir les changements

### Tester l'API

Utilisez l'interface Swagger UI à `/api/docs` pour tester tous les endpoints interactivement.

## 📱 Intégration mobile/frontend

L'API est conçue pour être consommée par :

- **Frontend Next.js** (composants React)
- **Applications mobiles** (React Native, Flutter)
- **Outils tiers** (Postman, Insomnia)

Tous les endpoints retournent du JSON avec une structure cohérente :

```json
{
  "success": true,
  "data": { ... },
  "pagination": { ... }
}
```

---

**🎮 Happy coding avec l'API Babyfoot Management !**
