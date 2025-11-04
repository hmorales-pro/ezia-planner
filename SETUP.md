# 🚀 Guide d'installation MindFlow

Ce guide va te permettre de configurer et déployer MindFlow en quelques étapes.

## 📋 Prérequis

- Node.js 18+ et npm (pour dev local)
- Docker et Docker Compose (pour déploiement)
- Un compte Supabase (gratuit)
- Un compte OpenAI avec une clé API
- Un serveur avec Dokploy installé
- (Optionnel) Un compte Google Cloud pour les intégrations Calendar/Gmail

## 🔧 Installation locale (développement)

### 1. Clone le projet

\`\`\`bash
git clone <ton-repo>
cd ezia-planner
npm install
\`\`\`

### 2. Configuration Supabase

#### a) Créer un projet Supabase

1. Va sur [supabase.com](https://supabase.com)
2. Crée un nouveau projet
3. Note l'URL et la clé ANON (dans Settings > API)
4. Note aussi la clé SERVICE_ROLE (dans Settings > API)

#### b) Exécuter les migrations

1. Va dans le SQL Editor de Supabase
2. Copie le contenu de `supabase/migrations/001_initial_schema.sql`
3. Exécute le script

Cela va créer toutes les tables nécessaires :
- profiles
- contacts
- events
- emails
- tasks
- integrations

### 3. Configuration des variables d'environnement

Copie le fichier d'exemple :

\`\`\`bash
cp .env.example .env
\`\`\`

Édite `.env` et remplis les valeurs :

\`\`\`env
# Supabase (depuis ton projet Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (depuis platform.openai.com)
OPENAI_API_KEY=sk-...

# App URL (ton domaine de production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 4. Lancer l'application en dev

\`\`\`bash
npm run dev
\`\`\`

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

## 🐳 Test avec Docker en local

### 1. Builder et lancer avec Docker Compose

\`\`\`bash
# Assure-toi que ton fichier .env est bien configuré
docker-compose up --build
\`\`\`

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

### 2. Arrêter l'application

\`\`\`bash
docker-compose down
\`\`\`

## 🌐 Déploiement sur Dokploy

### Option 1 : Déploiement via l'interface Dokploy (Recommandé)

#### 1. Prépare ton serveur Dokploy

Assure-toi que Dokploy est installé et accessible. Si ce n'est pas le cas :

\`\`\`bash
# Sur ton serveur (Ubuntu/Debian)
curl -sSL https://dokploy.com/install.sh | sh
\`\`\`

#### 2. Connecte ton repository

1. Va sur ton interface Dokploy (https://ton-serveur:3000)
2. Connecte-toi
3. Clique sur "New Application"
4. Choisis "Git" comme source
5. Entre l'URL de ton repo GitHub : `https://github.com/hmorales-pro/ezia-planner`
6. Sélectionne la branche : `claude/code-review-011CUoQHKeRK6TuGnVnQXseR` (ou `main` après merge)

#### 3. Configure l'application

Dans les paramètres de l'application :

**Build Settings :**
- **Build Type**: Dockerfile
- **Dockerfile Path**: `./Dockerfile`
- **Port**: 3000

**Environment Variables :**

Ajoute toutes ces variables (dans l'onglet Environment) :

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
OPENAI_API_KEY=sk-...

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=ton-client-id
GOOGLE_CLIENT_SECRET=ton-client-secret
GMAIL_CLIENT_ID=ton-gmail-client-id
GMAIL_CLIENT_SECRET=ton-gmail-client-secret

# App URL (ton domaine de production)
NEXT_PUBLIC_APP_URL=https://mindflow.ton-domaine.com

# Next.js
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

**Health Check :**
- **Path**: `/api/health`
- **Interval**: 30s
- **Timeout**: 3s
- **Retries**: 3

#### 4. Configure le domaine

1. Dans l'onglet "Domains", ajoute ton domaine : `mindflow.ton-domaine.com`
2. Dokploy va automatiquement configurer le SSL avec Let's Encrypt

#### 5. Déploie !

1. Clique sur "Deploy"
2. Dokploy va :
   - Cloner ton repo
   - Builder l'image Docker
   - Lancer le container
   - Configurer le reverse proxy
   - Activer le SSL

Le déploiement prend environ 3-5 minutes.

### Option 2 : Déploiement via CLI

\`\`\`bash
# Se connecter à Dokploy CLI
dokploy login https://ton-serveur:3000

# Créer l'application
dokploy app create mindflow \\
  --git-url https://github.com/hmorales-pro/ezia-planner \\
  --branch claude/code-review-011CUoQHKeRK6TuGnVnQXseR \\
  --dockerfile Dockerfile \\
  --port 3000

# Ajouter les variables d'environnement
dokploy app env set mindflow \\
  NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co \\
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... \\
  SUPABASE_SERVICE_ROLE_KEY=eyJ... \\
  OPENAI_API_KEY=sk-... \\
  NEXT_PUBLIC_APP_URL=https://mindflow.ton-domaine.com

# Déployer
dokploy app deploy mindflow
\`\`\`

### 🔄 Redéploiement automatique

Dokploy peut redéployer automatiquement à chaque push sur Git :

1. Dans l'interface Dokploy, va dans "Settings" de ton app
2. Active "Auto Deploy"
3. Copie le Webhook URL
4. Dans GitHub, va dans Settings > Webhooks > Add webhook
5. Colle l'URL du webhook
6. Choisis "Just the push event"

Maintenant, chaque push sur la branche configurée redéploiera automatiquement !

## 🔐 Configuration de l'authentification Google (Optionnel)

### 1. Créer un projet Google Cloud

1. Va sur [console.cloud.google.com](https://console.cloud.google.com)
2. Crée un nouveau projet "MindFlow"
3. Active l'API Google Calendar et Gmail

### 2. Créer des identifiants OAuth

1. Va dans "APIs & Services" > "Credentials"
2. Crée des identifiants OAuth 2.0
3. Ajoute les URL autorisées :
   - `http://localhost:3000` (dev)
   - `https://mindflow.ton-domaine.com` (prod)
4. Ajoute les URL de redirection :
   - `http://localhost:3000/auth/callback`
   - `https://mindflow.ton-domaine.com/auth/callback`

### 3. Configurer Supabase Auth

1. Dans ton projet Supabase, va dans Authentication > Providers
2. Active Google OAuth
3. Entre ton Client ID et Client Secret
4. Configure l'URL de redirection : `https://xxxxx.supabase.co/auth/v1/callback`

### 4. Ajouter les credentials dans Dokploy

Retourne dans Dokploy > Environment Variables et ajoute :

```
GOOGLE_CLIENT_ID=ton-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GMAIL_CLIENT_ID=ton-gmail-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-...
```

Puis redéploie l'application.

## 📊 Monitoring et logs

### Voir les logs en temps réel

Dans Dokploy :
1. Va dans ton application
2. Clique sur "Logs"
3. Les logs s'affichent en temps réel

Ou via CLI :

\`\`\`bash
dokploy app logs mindflow --follow
\`\`\`

### Health check

Ton application expose un endpoint de santé :

\`\`\`bash
curl https://mindflow.ton-domaine.com/api/health
\`\`\`

Réponse :
\`\`\`json
{
  "status": "ok",
  "timestamp": "2025-11-04T12:00:00.000Z",
  "service": "MindFlow",
  "version": "1.0.0"
}
\`\`\`

## 🐛 Debugging

### Problèmes courants

#### L'application ne démarre pas

→ Vérifie les logs dans Dokploy
\`\`\`bash
dokploy app logs mindflow
\`\`\`

#### Erreur de connexion à Supabase

→ Vérifie que les variables d'environnement sont correctes :
\`\`\`bash
dokploy app env list mindflow
\`\`\`

#### L'image Docker ne build pas

→ Essaie de builder localement pour voir l'erreur :
\`\`\`bash
docker build -t mindflow .
\`\`\`

### Se connecter au container

\`\`\`bash
# Via Dokploy CLI
dokploy app exec mindflow -- /bin/sh

# Ou via Docker directement sur le serveur
docker exec -it mindflow-app /bin/sh
\`\`\`

## 🔄 Mise à jour de l'application

### Méthode 1 : Auto-deploy (recommandé)

Si tu as configuré le webhook GitHub, chaque push redéploiera automatiquement.

### Méthode 2 : Manuel via l'interface

1. Va dans Dokploy
2. Sélectionne ton app
3. Clique sur "Redeploy"

### Méthode 3 : Via CLI

\`\`\`bash
dokploy app deploy mindflow
\`\`\`

## 📈 Scaling

### Augmenter les ressources

Dans Dokploy > Settings :

\`\`\`yaml
resources:
  memory: 1Gi      # Au lieu de 512Mi
  cpu: 1000m       # Au lieu de 500m
\`\`\`

### Scaling horizontal (plusieurs replicas)

\`\`\`yaml
replicas: 3  # Au lieu de 1
\`\`\`

⚠️ **Note** : Pour le scaling horizontal, tu auras besoin d'une base de données partagée (déjà le cas avec Supabase).

## 🔒 Sécurité

### SSL/HTTPS

Dokploy configure automatiquement le SSL avec Let's Encrypt. Assure-toi que ton domaine pointe bien vers ton serveur.

### Firewall

Sur ton serveur, ouvre uniquement les ports nécessaires :

\`\`\`bash
# UFW (Ubuntu)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw enable
\`\`\`

### Secrets

Ne commit JAMAIS tes secrets dans Git. Utilise toujours les variables d'environnement de Dokploy.

## 📚 Ressources

- [Documentation Dokploy](https://docs.dokploy.com)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation OpenAI](https://platform.openai.com/docs)
- [Documentation Docker](https://docs.docker.com)

## 💬 Support

Pour toute question ou problème :

1. Vérifie les logs Dokploy
2. Consulte la documentation
3. Ouvre une issue sur GitHub
4. Contacte l'équipe

---

**Bon déploiement ! 🚀**
