import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*, events(title), contacts(name)')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true })

    if (error) throw error

    return NextResponse.json({ tasks })
  } catch (error: any) {
    console.error('Tasks fetch error:', error)
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
    const { title, description, due_date, priority, event_id, contact_id } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title,
        description,
        due_date,
        priority: priority || 'medium',
        event_id,
        contact_id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ task }, { status: 201 })
  } catch (error: any) {
    console.error('Task creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, completed } = body

    if (!id || completed === undefined) {
      return NextResponse.json({ error: 'Task ID and completed status are required' }, { status: 400 })
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ task })
  } catch (error: any) {
    console.error('Task update error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
