# 🚀 Guide d'installation MindFlow

Ce guide va te permettre de configurer et déployer MindFlow en quelques étapes.

## 📋 Prérequis

- Node.js 18+ et npm
- Un compte Supabase (gratuit)
- Un compte OpenAI avec une clé API
- (Optionnel) Un compte Google Cloud pour les intégrations Calendar/Gmail

## 🔧 Installation locale

### 1. Clone le projet

\`\`\`bash
git clone <ton-repo>
cd mindflow
npm install
\`\`\`

### 2. Configuration Supabase

#### a) Créer un projet Supabase

1. Va sur [supabase.com](https://supabase.com)
2. Crée un nouveau projet
3. Note l'URL et la clé ANON (dans Settings > API)

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

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 4. Lancer l'application

\`\`\`bash
npm run dev
\`\`\`

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

## 🌐 Déploiement sur Vercel

### 1. Connecte ton repo à Vercel

1. Va sur [vercel.com](https://vercel.com)
2. Clique sur "New Project"
3. Importe ton repository GitHub

### 2. Configure les variables d'environnement

Dans les settings du projet Vercel, ajoute toutes les variables de ton fichier `.env` :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL` (l'URL de ton site Vercel)

### 3. Déploie

Vercel va automatiquement déployer ton application. Le build prend environ 2-3 minutes.

## 🔐 Configuration de l'authentification Google (Optionnel)

### 1. Créer un projet Google Cloud

1. Va sur [console.cloud.google.com](https://console.cloud.google.com)
2. Crée un nouveau projet
3. Active l'API Google Calendar et Gmail

### 2. Créer des identifiants OAuth

1. Va dans "APIs & Services" > "Credentials"
2. Crée des identifiants OAuth 2.0
3. Ajoute les URL autorisées :
   - `http://localhost:3000` (dev)
   - `https://ton-domaine.vercel.app` (prod)
4. Ajoute les URL de redirection :
   - `http://localhost:3000/auth/callback`
   - `https://ton-domaine.vercel.app/auth/callback`

### 3. Configurer Supabase Auth

1. Dans ton projet Supabase, va dans Authentication > Providers
2. Active Google OAuth
3. Entre ton Client ID et Client Secret

## 📊 Structure de la base de données

### Tables principales

- **profiles** : Informations utilisateur et abonnement
- **events** : Rendez-vous et meetings
- **contacts** : Contacts clients
- **emails** : Emails synchronisés depuis Gmail
- **tasks** : Tâches liées aux événements
- **integrations** : Tokens OAuth pour Calendar/Gmail

### Row Level Security (RLS)

Toutes les tables sont protégées par RLS. Les utilisateurs ne peuvent accéder qu'à leurs propres données.

## 🤖 Utilisation de l'IA

### Limites par tier

- **Free** : 20 requêtes IA/mois
- **Pro** : Illimité
- **Team** : Illimité + collaboration

### Modèles utilisés

- **GPT-4o-mini** : Chat IA, analyse d'événements
- **GPT-4-turbo** : Génération d'emails, résumés de meetings

### Coût estimé OpenAI

Avec GPT-4o-mini et une utilisation normale :
- ~0.50€/mois pour un utilisateur Free
- ~2-5€/mois pour un utilisateur Pro actif

## 🐛 Debugging

### Problèmes courants

#### "Unauthorized" lors de l'accès au dashboard

→ Vérifie que tu es bien connecté. Essaie de te déconnecter et te reconnecter.

#### Les requêtes IA ne fonctionnent pas

→ Vérifie que ta clé OpenAI est valide et que tu as du crédit.

#### Les tables n'existent pas

→ Assure-toi d'avoir exécuté le script SQL de migration dans Supabase.

### Logs Supabase

Pour voir les logs en temps réel :

1. Va dans ton projet Supabase
2. Clique sur "Logs" dans le menu
3. Sélectionne le type de log (Auth, Database, API, etc.)

### Logs Vercel

Pour voir les logs de production :

1. Va sur vercel.com
2. Sélectionne ton projet
3. Clique sur "Logs"

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation OpenAI](https://platform.openai.com/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)

## 💬 Support

Pour toute question ou problème :

1. Ouvre une issue sur GitHub
2. Consulte la documentation
3. Contacte l'équipe sur [ton-email]

---

**Bon dev ! 🚀**
