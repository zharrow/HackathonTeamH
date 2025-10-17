# Hackathon - Ynov Toulouse 2025 : Babyfoot du futur - Cloud & Infrastructure

## Equipe

- Cloud & Infra 1 : pupille Florian
- Cloud & Infra : ALAMICHE CHENTOUFI Ilias
- CLoud & Infra : Pitrel Corentin 

Et si on réinventait l’expérience babyfoot à Ynov ? L’objectif de ce hackathon est de moderniser et digitaliser l’usage des babyfoots présents dans le Souk pour créer un service _next-gen_, pensé pour près de 1000 étudiants !

Que ce soit via des gadgets connectés, un système de réservation intelligent, des statistiques en temps réel ou des fonctionnalités robustes pour une utilisation massive, nous cherchons des solutions innovantes qui allient créativité et technologie.

Toutes les filières sont invitées à contribuer : Dev, Data, Infra, IoT, Systèmes embarqués… chaque idée compte pour rendre le babyfoot plus fun, plus pratique et plus connecté.

Votre mission : transformer le babyfoot classique en expérience high-tech pour Ynov !

---

> Ce fichier contient les informations spécifiques au Cloud & Infra de votre projet. Il suffit d'en remplir une seule fois, même si vous êtes plusieurs Cloud & Infra dans l'équipe.

# Requis

Ce README contient les requis fonctionnels de la partie Cloud & Infra de votre projet. Il doit compléter le README principal à la racine du projet, et servira la partie de votre note propre à votre spécialité.

Basez-vous sur les spécifications dans [SPECIFICATIONS.md](../SPECIFICATIONS.md) pour remplir ce document.

Décrivez ici les actions que vous avez menées, votre démarche, les choix techniques que vous avez faits, les difficultés rencontrées, etc. Précisez également dans quelle mesure vous avez pu collaborer avec les autres spécialités.

Autrement, il n'y a pas de format imposé, mais essayez de rester clair et concis, je ne vous demande pas de rédiger un roman, passez à l'essentiel, et épargnez-moi de longues pages générées par IA (malusée).

En conclusion, cela doit résumer votre travail en tant qu'expert.e infra, et vous permettre de garder un trace écrite de votre contribution au projet.

Merci de votre participation, et bon courage pour la suite du hackathon !



### Objectif général

Déployer une infrastructure cloud complète pour héberger et gérer l’application web de gestion des babyfoots, incluant des services de base de données, de mise à l’échelle automatique et de surveillance.

- Hébergement de l’application web (frontend et backend)
- Base de données pour stocker les informations des babyfoots et des utilisateurs
- Services de surveillance et de journalisation
- Mise en place de la sécurité (firewalls, gestion des accès, etc.)

### Requis fonctionnels

- **Simplicité de déploiement** :

  - Utilisation d’outils d’automatisation (Terraform, Ansible, Scripts shell...) pour déployer l’infrastructure en une seule commande.
  - Documentation claire pour le déploiement.

- **Host sécurisé et protégé** :

  - Mise en place de règles de sécurité (firewalls, groupes de sécurité).
  - Gestion des accès (IAM, rôles, permissions).

- **Base de données** :

  - Déploiement d’une base de données relationnelle ou NoSQL.
  - Sauvegardes régulières et restauration des données.

- **Scalabilité** :
  - Mise en place de la mise à l’échelle automatique pour gérer les pics de trafic : Afin de gérer la mise à l'échelle automatique, nous avons utilisé Amazon ECS ainsi qu'un module d'auto-scaling nous permettant de gérer le dimensionnement de notre cluster ECS en fonction du trafic rentrant. Pour chaques auto scaling group, Amazon ECS crée et gère les ressources suivantes :
    - Une alarme CloudWatch à faible valeur métrique
    - Une alarme CloudWatch à valeur métrique élevée
    Nous devions également établir un pourcentage cible (targetCapacity) pour l'utilisation de l'instance dans le groupe Auto Scaling.

- **Surveillance et journalisation** :

  - Mise en place de services de surveillance (CPU, mémoire, latence, etc.).
  - Journalisation des événements importants (logs d’accès, erreurs, etc.).

- **Haute disponibilité** :

  - Mise en place de la redondance pour assurer la disponibilité du service. (2 serveurs minimum)
  - Utilisation de plusieurs zones de disponibilité si possible.

### Supplémentaires (bonus)

- **Réplication de la base de données** : Mise en place de la réplication pour assurer la haute disponibilité.
- **Guide de récupération après sinistre** : Documentation et procédures pour la récupération en cas de panne majeure.
- **Optimisation des coûts** : Stratégies pour minimiser les coûts d’infrastructure
- **Tests de charge** : Simulation de trafic pour tester la robustesse de l’infrastructure.
