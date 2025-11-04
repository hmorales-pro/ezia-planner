import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Mail, Users, CheckSquare } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch user stats
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const { count: eventsCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id)
    .eq('status', 'scheduled')

  const { count: contactsCount } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id)

  const { count: tasksCount } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id)
    .eq('completed', false)

  const stats = [
    {
      name: 'Rendez-vous à venir',
      value: eventsCount || 0,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Contacts',
      value: contactsCount || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Tâches en cours',
      value: tasksCount || 0,
      icon: CheckSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Requêtes IA restantes',
      value: `${profile?.ai_requests_count || 0}/${profile?.ai_requests_limit || 20}`,
      icon: Mail,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bonjour, {profile?.full_name || 'bienvenue'} 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Voici un aperçu de ton activité aujourd'hui
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* AI Companion Chat */}
      <Card>
        <CardHeader>
          <CardTitle>🤖 Assistant IA</CardTitle>
          <CardDescription>
            Pose-moi des questions ou demande-moi de t'aider avec ton organisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                💡 <strong>Suggestions :</strong>
              </p>
              <ul className="mt-2 space-y-2">
                <li className="text-sm text-gray-700">
                  • "Quels sont mes rendez-vous cette semaine ?"
                </li>
                <li className="text-sm text-gray-700">
                  • "Relance tous les clients qui n'ont pas répondu"
                </li>
                <li className="text-sm text-gray-700">
                  • "Ajoute un rendez-vous avec Sarah jeudi à 14h"
                </li>
              </ul>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Écris ta question ici..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Envoyer
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">📅 Ajouter un rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Planifie rapidement un nouveau meeting
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">👤 Nouveau contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Ajoute un nouveau contact à ta liste
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">✉️ Relances emails</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Vois les emails qui nécessitent une réponse
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
