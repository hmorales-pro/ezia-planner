import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeEventContext } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventDescription } = await request.json()

    if (!eventDescription) {
      return NextResponse.json({ error: 'Event description is required' }, { status: 400 })
    }

    const analysis = await analyzeEventContext(eventDescription)

    return NextResponse.json({ analysis })
  } catch (error: any) {
    console.error('Event analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
