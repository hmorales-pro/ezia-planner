'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!user) return null

  return (
    <div className="flex items-center gap-3 p-4 bg-white border-b border-gray-200">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
        <span className="text-blue-600 font-semibold">
          {user.email?.[0].toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {user.user_metadata?.full_name || 'Utilisateur'}
        </p>
        <p className="text-xs text-gray-500 truncate">{user.email}</p>
      </div>
    </div>
  )
}
