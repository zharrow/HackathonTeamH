# Hackathon - Ynov Toulouse 2025 : Babyfoot du futur - Cloud & Infrastructure

## Equipe

- Cloud & Infra 1 : Pupille Florian
- Cloud & Infra : ALAMI CHENTOUFI Ilias
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

### Travail effectué

### Simplicité de déploiement

L’un des objectifs principaux du projet était de garantir un **déploiement rapide, automatisé et reproductible** de l’infrastructure. Cet objectif a été atteint grâce à l’utilisation de **Terraform**, outil d’Infrastructure as Code (IaC) permettant de décrire et de provisionner les ressources cloud de manière déclarative.

#### Automatisation complète via Terraform

L’ensemble de l’infrastructure a été conçu et déployé entièrement à l’aide de Terraform, couvrant tous les composants nécessaires à la mise en production de l’application :

* **Réseau (VPC, sous-réseaux publics/privés, tables de routage, gateways, security groups)**
* **Équilibreur de charge (ALB)** pour la répartition du trafic
* **Service ECS (Elastic Container Service)** pour l’orchestration et le déploiement des conteneurs
* **Route53** pour la gestion du nom de domaine et des enregistrements DNS
* **IAM Roles & Policies** pour la sécurité et la gestion des permissions

L’exécution du déploiement se fait via une seule commande :

```bash
terraform init
terraform apply -auto-approve
```

Ce qui permet de créer ou de mettre à jour l’infrastructure de manière entièrement automatisée, sans intervention manuelle sur la console AWS.

#### Avantages de cette approche

* **Reproductibilité** : le même code Terraform peut être utilisé pour recréer l’environnement dans une autre région ou un autre compte AWS.
* **Traçabilité et versionnement** : le code étant stocké dans un dépôt Git, chaque modification est historisée et peut être facilement auditée.
* **Cohérence entre environnements** : développement, staging et production sont alignés sur la même configuration.
* **Facilité de maintenance** : les mises à jour ou ajouts de ressources sont effectués directement dans le code Terraform, assurant la cohérence et limitant les erreurs humaines.

### Démonstration en vidéo

Voici une démonstration complète du processus de déploiement depuis l'initialisation jusqu'à la mise en ligne de l'application :

[![Terraform apply](https://asciinema.org/a/3VhblrZPUuOO5T0xVYeOKELUY.svg)](https://asciinema.org/a/3VhblrZPUuOO5T0xVYeOKELUY)

*Cette démonstration montre le déploiement complet de l'infrastructure AWS avec Terraform, incluant la création du VPC, du cluster ECS, de l'ALB et la configuration des certificats SSL.*

- **Host sécurisé et protégé** :

  - Mise en place de règles de sécurité (firewalls, groupes de sécurité).
  - Gestion des accès (IAM, rôles, permissions).

- **Base de données** :
### Objectif
Mettre en place une base de données PostgreSQL managée sur Amazon RDS, déployée automatiquement via Terraform

---

### Déploiement
L’infrastructure est déployée via Terraform, assurant une configuration facilement reproductible.

Deux ressources principales sont créées :

- **aws_db_subnet_group** : associe la base à des subnets privés du VPC.  
- **aws_db_instance** : crée l’instance PostgreSQL avec les paramètres du projet.


### Réseau et accès

- L’instance RDS PostgreSQL est déployée dans le VPC du projet, et en dehors du cluster ECS.  
- Elle est rattachée aux subnets privés définis dans le `db_subnet_group`.  
- Le port 5432 est restreint aux services internes autorisés : ECS, bastion et Power BI.  
- Une NAT Gateway placée dans un subnet public permet les connexions sortantes vers AWS sans exposition directe à Internet.  
- Le paramètre `publicly_accessible` est activé uniquement pour la phase de développement — le désactiver en production.

### Sécurité

- **Isolation réseau** : hébergement dans des subnets privés du VPC.  
- **Contrôle d’accès** : Security Groups limitant le trafic entrant au port `5432`.  
- **Authentification** : utiliser des variables Terraform ou AWS Secrets Manager — pas de credentials en clair.  
- **Chiffrement** : activer `storage_encrypted` en production.  
- **Connexion sécurisée** : forcer SSL/TLS côté client (Prisma, Power BI).


### Intégration

- Backend : connexion via Prisma ORM
- Power BI : connexion directe à l’endpoint RDS pour analyses. Autoriser l’IP ou le Security Group approprié et vérifier la configuration SSL.
- HeidiSQL : outil de test et visualisation manuelle en développement. Restreindre l’accès et ne pas stocker les identifiants en clair.

## Supervision et maintenance
- CloudWatch : suivi CPU, connexions, IOPS, stockage.

- **Scalabilité** :

  - Afin de gérer la mise à l'échelle automatique, nous avons utilisé Amazon ECS ainsi qu'un module d'auto-scaling nous permettant de gérer le dimensionnement de notre cluster ECS en fonction du trafic rentrant. Pour chaques auto scaling group, Amazon ECS crée et gère les ressources suivantes :
    - Une alarme CloudWatch à faible valeur métrique
    - Une alarme CloudWatch à valeur métrique élevée
    Nous devions également établir un pourcentage cible (targetCapacity) pour l'utilisation de l'instance dans le groupe Auto Scaling.

- **Haute disponibilité** :
  
  - En plus de l'utilisation de l'auto-scaling sur le cluster ECS pour la scalabilité, nos applications tournent sur 3 zones de disponibilités (AZ) différentes (eu-west-3a, eu-west-3b, eu-west-3c) pour garder une haute disponibilité. En cas de panne d'une AZ, l'une des deux autres prendrait le relais.

- **Surveillance et journalisation** :

  - Cloudwatch est un outil de surveillance et de journalisation de métriques nativement installé sur aws. C'est ce qui va nous permettre de générer des alertes en fonctions des différentes métriques renvoyé par nos différentes instances et tâches. Ces métriques et alertes sont également stockés (logs).


### Supplémentaires (bonus)

- **Optimisation des coûts** : Stratégies pour minimiser les coûts d’infrastructure
  - Concernant l'optimisation des coûts, nous avons eu l'idée d'utiliser des instances EC2 "spot" afin de réduire les coûts (de €26.255 pour les instances basiques à €9.985 pour les instances "spot". Les instances spot nous permettent d'utiliser le surplus cloud d'aws.
  - Nous avons aussi utiliser des types d'instances dites "micro". Des "t3.micro" coûtant donc bien moins chers et suffisant pour l'ampleur de notre projet.
