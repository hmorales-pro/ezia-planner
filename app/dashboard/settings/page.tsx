import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, Mail, Zap, User, CreditCard } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const { data: integrations } = await supabase
    .from('integrations')
    .select('*')
    .eq('user_id', user?.id)

  const googleCalendarConnected = integrations?.some(i => i.type === 'google_calendar' && i.is_active)
  const gmailConnected = integrations?.some(i => i.type === 'gmail' && i.is_active)

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">⚙️ Paramètres</h1>
        <p className="text-gray-600 mt-2">Gère ton compte et tes intégrations</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profil
          </CardTitle>
          <CardDescription>Informations personnelles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nom complet</label>
            <Input
              type="text"
              defaultValue={profile?.full_name || ''}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              defaultValue={user?.email || ''}
              disabled
              className="mt-1"
            />
          </div>
          <Button>Enregistrer les modifications</Button>
        </CardContent>
      </Card>

      {/* Subscription Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Abonnement
          </CardTitle>
          <CardDescription>Gérer ton plan et ta facturation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="font-semibold text-lg capitalize">{profile?.subscription_tier || 'Free'}</p>
              <p className="text-sm text-gray-600 mt-1">
                {profile?.subscription_tier === 'free' && '20 requêtes IA par mois'}
                {profile?.subscription_tier === 'pro' && 'Requêtes IA illimitées'}
                {profile?.subscription_tier === 'team' && 'Requêtes IA illimitées + Collaboration'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {profile?.ai_requests_count || 0} / {profile?.ai_requests_limit || 20} utilisées ce mois
              </p>
            </div>
            {profile?.subscription_tier === 'free' && (
              <Button>Passer à Pro</Button>
            )}
          </div>

          {profile?.subscription_tier === 'free' && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold mb-2">✨ Passe à Pro pour :</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Requêtes IA illimitées</li>
                <li>✓ Relances automatiques d'emails</li>
                <li>✓ Préparation intelligente des rendez-vous</li>
                <li>✓ Agenda partagé avec collaborateurs</li>
              </ul>
              <Button className="w-full mt-4">Débloquer Pro - 9€/mois</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integrations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Intégrations
          </CardTitle>
          <CardDescription>Connecte tes outils préférés</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Calendar */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium">Google Calendar</p>
                <p className="text-sm text-gray-600">
                  Synchronise automatiquement tes rendez-vous
                </p>
              </div>
            </div>
            {googleCalendarConnected ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-600 font-medium">✓ Connecté</span>
                <Button variant="outline" size="sm">Déconnecter</Button>
              </div>
            ) : (
              <Button size="sm">Connecter</Button>
            )}
          </div>

          {/* Gmail */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-red-600" />
              <div>
                <p className="font-medium">Gmail</p>
                <p className="text-sm text-gray-600">
                  Suivi intelligent de tes emails et relances automatiques
                </p>
              </div>
            </div>
            {gmailConnected ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-600 font-medium">✓ Connecté</span>
                <Button variant="outline" size="sm">Déconnecter</Button>
              </div>
            ) : (
              <Button size="sm">Connecter</Button>
            )}
          </div>

          {/* Outlook */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg opacity-50">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-800" />
              <div>
                <p className="font-medium">Outlook Calendar</p>
                <p className="text-sm text-gray-600">Bientôt disponible</p>
              </div>
            </div>
            <Button size="sm" disabled>Bientôt</Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>🤖 Préférences IA</CardTitle>
          <CardDescription>Configure l'assistant intelligent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Ton de communication préféré</label>
            <select className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Professionnel</option>
              <option>Amical</option>
              <option>Décontracté</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Relances automatiques</p>
              <p className="text-xs text-gray-500">L'IA relance automatiquement les contacts sans réponse</p>
            </div>
            <input type="checkbox" className="w-5 h-5" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Préparation des rendez-vous</p>
              <p className="text-xs text-gray-500">Reçois un résumé avant chaque meeting</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <Button>Enregistrer les préférences</Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Zone de danger</CardTitle>
          <CardDescription>Actions irréversibles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Supprimer toutes les données</p>
              <p className="text-xs text-gray-500">Efface tous tes événements, contacts et emails</p>
            </div>
            <Button variant="destructive" size="sm">Supprimer</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Supprimer le compte</p>
              <p className="text-xs text-gray-500">Supprime définitivement ton compte MindFlow</p>
            </div>
            <Button variant="destructive" size="sm">Supprimer le compte</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
