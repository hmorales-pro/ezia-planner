import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true })

    if (error) throw error

    return NextResponse.json({ contacts })
  } catch (error: any) {
    console.error('Contacts fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, company, notes, tags } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const { data: contact, error } = await supabase
      .from('contacts')
      .insert({
        user_id: user.id,
        name,
        email,
        phone,
        company,
        notes,
        tags: tags || [],
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ contact }, { status: 201 })
  } catch (error: any) {
    console.error('Contact creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
