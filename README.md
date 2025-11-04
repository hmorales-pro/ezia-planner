# MindFlow 🧠

**Ton cerveau externe intelligent**

MindFlow est une application SaaS d'aide à l'organisation assistée par l'intelligence artificielle, conçue pour les solopreneurs, freelances, coachs et créateurs.

## 🎯 Objectif

Centraliser agenda, préparations de rendez-vous, et suivi de mails clients sans se perdre dans la complexité des outils classiques.

**Plus rien ne sera oublié** : ni un rendez-vous, ni une pièce jointe, ni un message à relancer.

## ✨ Fonctionnalités principales

- 📅 **Gestion intelligente des rendez-vous** - Synchronisation avec Google Calendar, Outlook, Apple Calendar
- ✉️ **Suivi et relance d'emails** - Détection automatique des messages nécessitant une réponse
- 🤖 **IA compagnon** - Assistant conversationnel intégré pour répondre à tes questions
- 📊 **Préparation contextuelle** - Résumé intelligent avant chaque meeting
- 👥 **Collaboration** - Partage d'agenda avec tes collaborateurs

## 🚀 Démarrage rapide

### Développement local

\`\`\`bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Puis éditer .env avec tes clés API

# Lancer le serveur de développement
npm run dev
\`\`\`

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

### Avec Docker

\`\`\`bash
# Builder et lancer avec Docker Compose
docker-compose up --build
\`\`\`

### Déploiement sur Dokploy

Voir le guide complet dans [SETUP.md](./SETUP.md)

\`\`\`bash
# Sur ton serveur Dokploy
1. Connecte ton repo GitHub
2. Configure les variables d'environnement
3. Déploie en un clic !
\`\`\`

## 🛠️ Stack technique

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Supabase (auth, database, functions)
- **IA**: OpenAI GPT-4o-mini / GPT-4-turbo
- **Intégrations**: Gmail API, Google Calendar API
- **Déploiement**: Docker + Dokploy
- **Containerisation**: Dockerfile multi-stage optimisé

## 📁 Structure du projet

\`\`\`
mindflow/
├── app/              # Next.js App Router
│   ├── (auth)/       # Pages d'authentification
│   ├── (dashboard)/  # Pages principales (agenda, contacts, etc.)
│   ├── api/          # API routes
│   └── layout.tsx    # Layout principal
├── components/       # Composants réutilisables
├── lib/              # Utilitaires et helpers
├── types/            # Types TypeScript
└── public/           # Assets statiques
\`\`\`

## 🔐 Sécurité et RGPD

- Données chiffrées (AES-256)
- Hébergement en UE
- Consentement explicite pour chaque synchronisation
- Suppression totale des données sur demande

## 💰 Business model

- **Free**: 0€/mois - 1 agenda + 20 requêtes IA/mois
- **Pro**: 9€/mois - IA illimitée + relances automatiques + agenda partagé
- **Team**: 19€/mois - Collaboration + intégrations avancées

## 📄 Licence

Propriétaire - Eziom Labs © 2025

---

*"Ton esprit au repos, ton business en mouvement."*
