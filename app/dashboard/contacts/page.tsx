import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Mail, Phone, Building } from 'lucide-react'

export default async function ContactsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch contacts
  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', user?.id)
    .order('name', { ascending: true })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">👥 Contacts</h1>
          <p className="text-gray-600 mt-2">Gère tes contacts et leur historique</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un contact
        </Button>
      </div>

      {/* Contacts Grid */}
      {!contacts || contacts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun contact pour le moment
            </h3>
            <p className="text-gray-600 mb-4">
              Commence par ajouter tes premiers contacts
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un contact
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {contact.name[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{contact.name}</CardTitle>
                      {contact.company && (
                        <p className="text-sm text-gray-500">{contact.company}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {contact.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.company && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="w-4 h-4" />
                      <span>{contact.company}</span>
                    </div>
                  )}

                  {contact.tags && contact.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {contact.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {contact.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {contact.notes}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
