# 🏗️ Architecture MindFlow

Ce document décrit l'architecture technique de MindFlow.

## 📦 Stack technique

### Frontend
- **Next.js 15** : Framework React avec App Router
- **TypeScript** : Typage statique
- **Tailwind CSS** : Styling utility-first
- **Lucide React** : Icônes

### Backend
- **Supabase** : Backend-as-a-Service
  - PostgreSQL : Base de données
  - Auth : Authentification
  - Row Level Security : Sécurité des données
  - Realtime : Mises à jour en temps réel

### IA
- **OpenAI GPT-4o-mini** : Chat IA, analyse d'événements
- **OpenAI GPT-4-turbo** : Génération d'emails, résumés

### Déploiement
- **Vercel** : Hébergement et CI/CD
- **Edge Functions** : API routes serverless

## 📁 Structure du projet

\`\`\`
mindflow/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Routes d'authentification
│   │   ├── login/           # Page de connexion
│   │   ├── signup/          # Page d'inscription
│   │   └── callback/        # OAuth callback
│   │
│   ├── (dashboard)/         # Routes protégées
│   │   ├── layout.tsx       # Layout dashboard avec sidebar
│   │   ├── page.tsx         # Dashboard principal
│   │   ├── agenda/          # Gestion des rendez-vous
│   │   ├── contacts/        # Gestion des contacts
│   │   ├── tasks/           # Gestion des tâches
│   │   ├── emails/          # Suivi des emails
│   │   └── settings/        # Paramètres utilisateur
│   │
│   ├── api/                 # API Routes
│   │   ├── ai/              # Endpoints IA
│   │   │   ├── chat/        # Chat avec l'IA
│   │   │   ├── analyze-event/  # Analyse d'événements
│   │   │   └── generate-followup/  # Génération de relances
│   │   ├── events/          # CRUD événements
│   │   ├── contacts/        # CRUD contacts
│   │   └── tasks/           # CRUD tâches
│   │
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Styles globaux
│
├── components/              # Composants React
│   ├── ui/                  # Composants UI réutilisables
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── spinner.tsx
│   └── navigation/          # Composants de navigation
│       ├── sidebar.tsx
│       └── user-menu.tsx
│
├── lib/                     # Utilitaires et helpers
│   ├── supabase/           # Configuration Supabase
│   │   ├── client.ts       # Client-side
│   │   ├── server.ts       # Server-side
│   │   └── middleware.ts   # Middleware
│   ├── openai.ts           # Helpers OpenAI
│   └── utils.ts            # Utilitaires généraux
│
├── types/                   # Types TypeScript
│   └── database.types.ts   # Types générés depuis Supabase
│
├── supabase/               # Configuration Supabase
│   └── migrations/         # Migrations SQL
│       └── 001_initial_schema.sql
│
├── middleware.ts           # Next.js middleware (auth)
├── tailwind.config.ts      # Configuration Tailwind
├── tsconfig.json           # Configuration TypeScript
└── package.json            # Dépendances
\`\`\`

## 🔐 Authentification et sécurité

### Flow d'authentification

1. **Sign up / Login** → Supabase Auth
2. **Session cookies** → httpOnly, secure
3. **Middleware** → Vérifie l'authentification sur chaque requête
4. **RLS** → Supabase protège les données au niveau DB

### Row Level Security (RLS)

Toutes les tables ont des policies RLS :

\`\`\`sql
-- Exemple pour la table events
CREATE POLICY "Users can view own events" ON events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);
\`\`\`

### Middleware

Le middleware Next.js vérifie l'authentification :

\`\`\`typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}
\`\`\`

## 🤖 Architecture IA

### Système de limites

```typescript
// Vérification avant chaque requête IA
if (profile.subscription_tier === 'free' &&
    profile.ai_requests_count >= profile.ai_requests_limit) {
  throw new Error('Limite atteinte')
}

// Incrément après succès
await supabase
  .from('profiles')
  .update({ ai_requests_count: count + 1 })
```

### Flow d'une requête IA

1. **Client** → Envoie une requête à `/api/ai/chat`
2. **Vérification auth** → Middleware Supabase
3. **Vérification limites** → Check du tier
4. **Appel OpenAI** → Génération de la réponse
5. **Incrémentation** → Update du compteur
6. **Response** → Retour au client

### Modèles et coûts

| Fonctionnalité | Modèle | Tokens moyens | Coût estimé |
|----------------|--------|---------------|-------------|
| Chat IA | GPT-4o-mini | 500 | 0.01€ |
| Analyse événement | GPT-4o-mini | 300 | 0.006€ |
| Génération email | GPT-4-turbo | 800 | 0.024€ |
| Résumé meeting | GPT-4-turbo | 1000 | 0.03€ |

## 📊 Base de données

### Schéma relationnel

```
profiles (1) ──< (N) events
profiles (1) ──< (N) contacts
profiles (1) ──< (N) tasks
profiles (1) ──< (N) emails
profiles (1) ──< (N) integrations

contacts (1) ──< (N) events
contacts (1) ──< (N) tasks
contacts (1) ──< (N) emails

events (1) ──< (N) tasks
```

### Triggers automatiques

```sql
-- Création automatique du profil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update automatique de updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🔄 Intégrations

### Google Calendar

1. **OAuth 2.0** → Récupération du token
2. **Stockage** → Table `integrations`
3. **Sync** → Webhook ou polling
4. **Bidirectionnel** → MindFlow ↔ Google Calendar

### Gmail

1. **OAuth 2.0** → Permissions Gmail
2. **Watch** → Gmail Push Notifications
3. **Parsing** → Extraction des infos
4. **IA Analysis** → Détection needs_reply/needs_followup

## 🚀 Performance

### Optimisations

- **Server Components** par défaut
- **Streaming** pour l'IA (à venir)
- **Edge Functions** pour les API routes
- **Database indexes** sur les colonnes fréquentes
- **RLS policies** optimisées

### Caching

- **Static Generation** pour la landing page
- **ISR** pour le dashboard (revalidate: 60)
- **React Cache** pour les requêtes dupliquées

## 📈 Scalabilité

### Limites actuelles

- Supabase Free : 500 MB database
- Vercel Hobby : 100 GB bandwidth
- OpenAI : Rate limits par tier

### Stratégie de scaling

1. **Phase 1** (0-1000 users) : Free tiers OK
2. **Phase 2** (1000-10000 users) : Pro plans
3. **Phase 3** (10000+ users) : Enterprise + CDN

## 🧪 Testing (À venir)

### Stack de test envisagée

- **Vitest** : Unit tests
- **Playwright** : E2E tests
- **Testing Library** : Component tests

## 📚 Documentation API

### Authentication

```typescript
// Toutes les routes API nécessitent une authentification
headers: {
  'Authorization': 'Bearer <token>'
}
```

### Endpoints principaux

#### POST /api/ai/chat
```json
{
  "message": "Quels sont mes rendez-vous cette semaine ?"
}
```

#### POST /api/events
```json
{
  "title": "Meeting avec Marc",
  "start_time": "2025-11-05T14:00:00Z",
  "end_time": "2025-11-05T15:00:00Z",
  "description": "Discussion sur le projet",
  "contact_id": "uuid",
  "tags": ["meeting", "projet"]
}
```

#### POST /api/contacts
```json
{
  "name": "Marc Dupont",
  "email": "marc@example.com",
  "phone": "+33612345678",
  "company": "ACME Corp",
  "tags": ["client", "vip"]
}
```

---

**Architecture v1.0 - Novembre 2025**
