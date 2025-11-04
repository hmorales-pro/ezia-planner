# 🚀 Guide de démarrage rapide Dokploy

Ce guide te permettra de déployer MindFlow sur Dokploy en moins de 10 minutes.

## ✅ Prérequis

Avant de commencer, assure-toi d'avoir :

1. **Un serveur avec Dokploy installé**
   - VPS Ubuntu/Debian (recommandé : 2GB RAM minimum)
   - Dokploy installé : `curl -sSL https://dokploy.com/install.sh | sh`
   - Accès à l'interface Dokploy : `https://ton-serveur:3000`

2. **Un projet Supabase configuré**
   - Compte créé sur [supabase.com](https://supabase.com)
   - Migration SQL exécutée (voir ci-dessous)
   - Clés API récupérées

3. **Une clé API OpenAI**
   - Compte sur [platform.openai.com](https://platform.openai.com)
   - Clé API créée avec du crédit

## 📋 Étape 1 : Configuration Supabase (5 min)

### 1. Créer le projet Supabase

1. Va sur [supabase.com](https://supabase.com) et connecte-toi
2. Clique sur "New Project"
3. Nomme ton projet : "MindFlow"
4. Choisis une région proche de ton serveur (ex: Paris pour l'Europe)
5. Définis un mot de passe fort pour la base de données
6. Attends que le projet soit créé (~2 minutes)

### 2. Exécuter la migration SQL

1. Dans Supabase, va dans **SQL Editor**
2. Clique sur "New query"
3. Copie-colle le contenu du fichier `supabase/migrations/001_initial_schema.sql`
4. Clique sur "Run" (en bas à droite)
5. Vérifie qu'il n'y a pas d'erreur (tu devrais voir "Success. No rows returned")

### 3. Récupérer les clés API

1. Va dans **Settings** > **API**
2. Note ces 3 valeurs (tu en auras besoin dans Dokploy) :
   - **URL** : `https://xxxxx.supabase.co`
   - **anon public** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role** (clique sur "Reveal" pour voir) : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🐳 Étape 2 : Déploiement sur Dokploy (5 min)

### 1. Connecter le repository

1. Ouvre ton interface Dokploy : `https://ton-serveur:3000`
2. Connecte-toi avec tes identifiants
3. Clique sur **"New Application"**
4. Choisis **"Git Repository"**
5. Entre l'URL : `https://github.com/hmorales-pro/ezia-planner`
6. Sélectionne la branche : `claude/code-review-011CUoQHKeRK6TuGnVnQXseR`
7. Clique sur "Continue"

### 2. Configurer le build

Dans l'onglet **"Build"** :

- **Name** : `mindflow`
- **Build Type** : `Dockerfile`
- **Dockerfile Path** : `./Dockerfile`
- **Container Port** : `3000`

### 3. Ajouter les variables d'environnement

Dans l'onglet **"Environment"**, ajoute ces variables une par une :

```bash
# Supabase (tes valeurs de l'Étape 1)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (ta clé API)
OPENAI_API_KEY=sk-proj-...

# App URL (ton domaine final, par exemple)
NEXT_PUBLIC_APP_URL=https://mindflow.ton-domaine.com

# Configuration Next.js
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### 4. Configurer le Health Check

Dans l'onglet **"Health Check"** :

- **Path** : `/api/health`
- **Interval** : `30` secondes
- **Timeout** : `3` secondes
- **Retries** : `3`

### 5. Configurer le domaine

Dans l'onglet **"Domains"** :

1. Clique sur "Add Domain"
2. Entre ton domaine : `mindflow.ton-domaine.com`
3. Dokploy te donnera l'IP à configurer dans ton DNS
4. Active "Auto SSL" pour Let's Encrypt

**Configuration DNS (chez ton registrar) :**

```
Type: A
Name: mindflow (ou @)
Value: [IP de ton serveur Dokploy]
TTL: 300
```

### 6. Déployer !

1. Clique sur le bouton **"Deploy"** (en haut à droite)
2. Dokploy va :
   - Cloner le repo
   - Builder l'image Docker (2-3 minutes)
   - Lancer le container
   - Configurer le reverse proxy
   - Activer le SSL

3. Suis les logs en temps réel dans l'onglet **"Logs"**

4. Une fois terminé (statut "Running" en vert), ton app est accessible !

## ✅ Étape 3 : Vérification (1 min)

### 1. Tester le health check

```bash
curl https://mindflow.ton-domaine.com/api/health
```

Réponse attendue :
```json
{
  "status": "ok",
  "timestamp": "2025-11-04T20:00:00.000Z",
  "service": "MindFlow",
  "version": "1.0.0"
}
```

### 2. Accéder à l'application

1. Ouvre `https://mindflow.ton-domaine.com` dans ton navigateur
2. Tu devrais voir la landing page de MindFlow
3. Clique sur "Créer un compte"
4. Crée ton premier compte utilisateur
5. Explore le dashboard !

## 🔄 Configuration du déploiement automatique (Bonus)

Pour redéployer automatiquement à chaque push sur GitHub :

### 1. Dans Dokploy

1. Va dans **Settings** de ton app
2. Active **"Auto Deploy"**
3. Copie le **Webhook URL** affiché

### 2. Dans GitHub

1. Va sur ton repo : `https://github.com/hmorales-pro/ezia-planner`
2. Settings > Webhooks > Add webhook
3. **Payload URL** : colle le webhook de Dokploy
4. **Content type** : `application/json`
5. **Which events** : "Just the push event"
6. Clique sur "Add webhook"

Maintenant, chaque push redéploiera automatiquement ! 🎉

## 🐛 Résolution de problèmes

### Le build échoue

1. Vérifie les logs dans Dokploy > Logs
2. Assure-toi que toutes les variables d'environnement sont définies
3. Essaie de builder localement :

```bash
git clone https://github.com/hmorales-pro/ezia-planner
cd ezia-planner
docker build -t mindflow-test .
```

### L'application ne démarre pas

1. Vérifie que le port 3000 est bien configuré
2. Vérifie les logs : recherche "Error" ou "Failed"
3. Teste la connexion à Supabase depuis le serveur :

```bash
curl https://xxxxx.supabase.co/rest/v1/
```

### Erreur "Unauthorized" lors de la connexion

1. Vérifie que les clés Supabase sont correctes
2. Dans Supabase, va dans Authentication > URL Configuration
3. Ajoute ton domaine dans "Site URL" : `https://mindflow.ton-domaine.com`
4. Ajoute dans "Redirect URLs" : `https://mindflow.ton-domaine.com/auth/callback`

### Le SSL ne fonctionne pas

1. Vérifie que ton domaine pointe bien vers l'IP du serveur :

```bash
nslookup mindflow.ton-domaine.com
```

2. Attends quelques minutes (propagation DNS)
3. Dans Dokploy, clique sur "Regenerate SSL"

## 📊 Logs et monitoring

### Voir les logs en temps réel

Dans Dokploy :
1. Sélectionne ton app
2. Onglet "Logs"
3. Active "Auto-scroll"

Ou en CLI :
```bash
dokploy app logs mindflow --follow
```

### Métriques

Dans Dokploy > Metrics, tu peux voir :
- CPU usage
- Memory usage
- Network I/O
- Request rate

## 🎉 C'est terminé !

Ton application MindFlow est maintenant déployée et accessible en HTTPS !

**Prochaines étapes :**

1. Configure Google OAuth (optionnel) - voir SETUP.md
2. Invite tes premiers utilisateurs
3. Configure les webhooks GitHub pour l'auto-deploy
4. Configure un système de backup de Supabase
5. Active le monitoring avec Uptime Robot ou similar

**Besoin d'aide ?**

- Documentation complète : [SETUP.md](./SETUP.md)
- Architecture : [ARCHITECTURE.md](./ARCHITECTURE.md)
- GitHub Issues : https://github.com/hmorales-pro/ezia-planner/issues

---

**Profite bien de MindFlow ! 🧠✨**
