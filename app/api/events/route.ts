import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: events, error } = await supabase
      .from('events')
      .select('*, contacts(name)')
      .eq('user_id', user.id)
      .order('start_time', { ascending: true })

    if (error) throw error

    return NextResponse.json({ events })
  } catch (error: any) {
    console.error('Events fetch error:', error)
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
    const { title, description, start_time, end_time, location, contact_id, tags } = body

    if (!title || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Title, start_time, and end_time are required' },
        { status: 400 }
      )
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        user_id: user.id,
        title,
        description,
        start_time,
        end_time,
        location,
        contact_id,
        tags: tags || [],
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ event }, { status: 201 })
  } catch (error: any) {
    console.error('Event creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
