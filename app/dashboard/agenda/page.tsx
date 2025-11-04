import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar as CalendarIcon } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'

export default async function AgendaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch upcoming events
  const { data: events } = await supabase
    .from('events')
    .select('*, contacts(name)')
    .eq('user_id', user?.id)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(10)

  // Group events by date
  const eventsByDate = events?.reduce((acc: any, event: any) => {
    const date = new Date(event.start_time).toDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(event)
    return acc
  }, {}) || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📅 Agenda</h1>
          <p className="text-gray-600 mt-2">Gère tes rendez-vous intelligemment</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un rendez-vous
        </Button>
      </div>

      {/* Quick Add with AI */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">✨ Ajoute rapidement avec l'IA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: Ajoute un rendez-vous avec Sarah jeudi à 14h pour parler du site web"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button>Créer</Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            L'IA va détecter automatiquement le contact, l'heure et le type de rendez-vous
          </p>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-6">
        {Object.keys(eventsByDate).length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun rendez-vous à venir
              </h3>
              <p className="text-gray-600 mb-4">
                Commence par ajouter ton premier rendez-vous
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Créer un rendez-vous
              </Button>
            </CardContent>
          </Card>
        ) : (
          Object.entries(eventsByDate).map(([date, dateEvents]: [string, any]) => (
            <div key={date}>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {formatDate(new Date(date))}
              </h2>
              <div className="space-y-3">
                {dateEvents.map((event: any) => {
                  const startTime = new Date(event.start_time)
                  const endTime = new Date(event.end_time)

                  return (
                    <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="text-center min-w-[60px]">
                            <p className="text-sm font-medium text-blue-600">
                              {formatTime(startTime)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTime(endTime)}
                            </p>
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{event.title}</h3>
                            {event.contacts?.name && (
                              <p className="text-sm text-gray-600 mt-1">
                                👤 {event.contacts.name}
                              </p>
                            )}
                            {event.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {event.description}
                              </p>
                            )}
                            {event.location && (
                              <p className="text-sm text-gray-500 mt-1">
                                📍 {event.location}
                              </p>
                            )}

                            {event.tags && event.tags.length > 0 && (
                              <div className="flex gap-2 mt-2">
                                {event.tags.map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div>
                            <span
                              className={`px-3 py-1 text-xs rounded-full ${
                                event.status === 'scheduled'
                                  ? 'bg-green-100 text-green-700'
                                  : event.status === 'completed'
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {event.status === 'scheduled' ? 'Prévu' :
                               event.status === 'completed' ? 'Terminé' : 'Annulé'}
                            </span>
                          </div>
                        </div>

                        {event.ai_summary && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">🤖 Préparation IA :</span> {event.ai_summary}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Integration Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Synchronisation calendrier</p>
                <p className="text-xs text-gray-500">
                  Connecte ton Google Calendar pour synchroniser automatiquement
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Connecter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
