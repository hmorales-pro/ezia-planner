import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Clock, AlertCircle } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'

export default async function EmailsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch emails that need attention
  const { data: needsReplyEmails } = await supabase
    .from('emails')
    .select('*, contacts(name)')
    .eq('user_id', user?.id)
    .eq('needs_reply', true)
    .order('received_at', { ascending: false })
    .limit(10)

  const { data: needsFollowupEmails } = await supabase
    .from('emails')
    .select('*, contacts(name)')
    .eq('user_id', user?.id)
    .eq('needs_followup', true)
    .order('received_at', { ascending: false })
    .limit(10)

  const { count: totalEmails } = await supabase
    .from('emails')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">✉️ Emails</h1>
          <p className="text-gray-600 mt-2">Suivi intelligent de tes communications</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">À répondre</p>
                <p className="text-2xl font-bold">{needsReplyEmails?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">À relancer</p>
                <p className="text-2xl font-bold">{needsFollowupEmails?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{totalEmails || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-gray-400" />
              <div>
                <p className="font-medium">Synchronisation Gmail</p>
                <p className="text-sm text-gray-500">
                  Connecte ton compte Gmail pour suivre automatiquement tes emails
                </p>
              </div>
            </div>
            <Button>Connecter Gmail</Button>
          </div>
        </CardContent>
      </Card>

      {/* Needs Reply Section */}
      {needsReplyEmails && needsReplyEmails.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📥 Emails en attente de réponse
          </h2>
          <div className="space-y-3">
            {needsReplyEmails.map((email) => (
              <Card key={email.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{email.subject}</h3>
                          <p className="text-sm text-gray-600 mt-1">De: {email.from}</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(email.received_at)} {formatTime(email.received_at)}
                        </span>
                      </div>

                      {email.contacts && (
                        <p className="text-sm text-blue-600 mt-2">
                          👤 {email.contacts.name}
                        </p>
                      )}

                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {email.body}
                      </p>

                      <div className="flex gap-2 mt-3">
                        <Button size="sm">Répondre avec l'IA</Button>
                        <Button size="sm" variant="outline">Marquer comme traité</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Needs Followup Section */}
      {needsFollowupEmails && needsFollowupEmails.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ⏰ Emails à relancer
          </h2>
          <div className="space-y-3">
            {needsFollowupEmails.map((email) => (
              <Card key={email.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{email.subject}</h3>
                          <p className="text-sm text-gray-600 mt-1">À: {email.to.join(', ')}</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(email.received_at)}
                        </span>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button size="sm">Générer une relance</Button>
                        <Button size="sm" variant="outline">Ne plus relancer</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!needsReplyEmails || needsReplyEmails.length === 0) &&
       (!needsFollowupEmails || needsFollowupEmails.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun email en attente
            </h3>
            <p className="text-gray-600">
              Tous tes emails sont à jour ! 🎉
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
