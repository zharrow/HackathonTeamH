# 🚀 Guide de Déploiement AWS

## Configuration des Variables d'Environnement

Pour que l'application fonctionne correctement sur AWS, vous devez configurer les variables d'environnement suivantes dans votre environnement de déploiement AWS :

### Variables Critiques

```bash
# URL de l'application (IMPORTANT !)
BETTER_AUTH_URL=https://404infra.aws.corentinptrl.dev
NEXT_PUBLIC_APP_URL=https://404infra.aws.corentinptrl.dev

# Secret d'authentification (générer une clé aléatoire sécurisée)
BETTER_AUTH_SECRET=your-super-secret-key-min-32-characters-long

# Base de données PostgreSQL
DATABASE_URL=postgresql://adminuser:MyStrongPassword@replica-postgresql-master.c5q6sgo20rt2.eu-west-3.rds.amazonaws.com:5432/hackathon

# Internationalisation
NEXT_PUBLIC_DEFAULT_LOCALE=fr
NEXT_PUBLIC_LOCALES=fr,en
```

### OAuth (Optionnel)

Si vous utilisez l'authentification GitHub :

```bash
GITHUB_ID=your_github_client_id_here
GITHUB_SECRET=your_github_client_secret_here
```

## Configuration CORS

Le middleware a été configuré pour gérer automatiquement les CORS pour les routes API. Il :

1. ✅ Accepte les requêtes depuis n'importe quelle origine
2. ✅ Gère les requêtes preflight (OPTIONS)
3. ✅ Autorise les credentials (cookies, headers d'auth)
4. ✅ Supporte tous les verbes HTTP nécessaires (GET, POST, PATCH, DELETE, etc.)

## Configuration Better-Auth

L'authentification utilise maintenant automatiquement :
- L'URL actuelle du site en production (`window.location.origin`)
- La variable `NEXT_PUBLIC_APP_URL` en fallback

**Aucune configuration supplémentaire n'est nécessaire côté code !**

## Étapes de Déploiement

### 1. Configurer les Variables d'Environnement sur AWS

Dans votre service AWS (Elastic Beanstalk, Amplify, ECS, etc.), configurez toutes les variables d'environnement listées ci-dessus.

**⚠️ IMPORTANT** : Assurez-vous que :
- `BETTER_AUTH_URL` = URL complète de votre site AWS
- `NEXT_PUBLIC_APP_URL` = URL complète de votre site AWS
- `BETTER_AUTH_SECRET` = Une clé secrète forte et unique

### 2. Build de l'Application

```bash
# Installer les dépendances
pnpm install

# Générer le client Prisma
pnpm db:generate

# Build de production
pnpm build
```

### 3. Démarrer l'Application

```bash
pnpm start
```

## Vérification Post-Déploiement

### Test des APIs

```bash
# Test de santé
curl https://404infra.aws.corentinptrl.dev/api/reservations

# Test CORS (devrait retourner les headers CORS)
curl -X OPTIONS https://404infra.aws.corentinptrl.dev/api/reservations \
  -H "Origin: https://404infra.aws.corentinptrl.dev" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

### Test d'Authentification

1. Ouvrez votre site : `https://404infra.aws.corentinptrl.dev`
2. Essayez de vous connecter
3. Vérifiez dans la console du navigateur qu'il n'y a pas d'erreurs CORS

## Résolution de Problèmes

### Erreur CORS persiste

Si vous avez toujours des erreurs CORS après le déploiement :

1. **Vérifiez les variables d'environnement** dans AWS
2. **Redémarrez l'application** après avoir modifié les variables
3. **Videz le cache** du navigateur et du CDN (CloudFront)

### L'API pointe toujours vers localhost

Cela signifie que `NEXT_PUBLIC_APP_URL` n'est pas correctement définie :
1. Vérifiez que la variable est bien définie dans AWS
2. Reconstruisez l'application (`pnpm build`)
3. Redéployez

### Erreurs d'authentification

Si l'authentification ne fonctionne pas :
1. Vérifiez que `BETTER_AUTH_URL` correspond exactement à l'URL de votre site
2. Vérifiez que `BETTER_AUTH_SECRET` est défini et identique sur toutes les instances
3. Vérifiez que la base de données est accessible depuis AWS

## Support

Pour toute question sur le déploiement, consultez :
- [Documentation Next.js Deployment](https://nextjs.org/docs/deployment)
- [Documentation Better-Auth](https://www.better-auth.com/docs)
- [AWS Deployment Guide](https://docs.aws.amazon.com/)
