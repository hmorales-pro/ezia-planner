import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, CheckCircle, Circle, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function TasksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch tasks
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, events(title), contacts(name)')
    .eq('user_id', user?.id)
    .order('due_date', { ascending: true })

  const incompleteTasks = tasks?.filter(t => !t.completed) || []
  const completedTasks = tasks?.filter(t => t.completed) || []

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-orange-600 bg-orange-100'
      case 'low':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">✅ Tâches</h1>
          <p className="text-gray-600 mt-2">Organise tes tâches liées à tes rendez-vous</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle tâche
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">En cours</p>
            <p className="text-2xl font-bold mt-1">{incompleteTasks.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Terminées</p>
            <p className="text-2xl font-bold mt-1">{completedTasks.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold mt-1">{tasks?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Incomplete Tasks */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">À faire</h2>
        {incompleteTasks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">Aucune tâche en cours. Bon travail ! 🎉</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {incompleteTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Circle className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}

                      <div className="flex items-center gap-4 mt-2">
                        {task.due_date && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(task.due_date)}</span>
                          </div>
                        )}

                        {task.events && (
                          <span className="text-sm text-blue-600">
                            📅 {task.events.title}
                          </span>
                        )}

                        {task.contacts && (
                          <span className="text-sm text-gray-600">
                            👤 {task.contacts.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'high' ? 'Haute' :
                       task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Terminées</h2>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <Card key={task.id} className="opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-700 line-through">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
