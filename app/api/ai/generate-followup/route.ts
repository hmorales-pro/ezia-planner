import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateEmailFollowup } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { emailId, tone } = await request.json()

    if (!emailId) {
      return NextResponse.json({ error: 'Email ID is required' }, { status: 400 })
    }

    // Fetch email details
    const { data: email } = await supabase
      .from('emails')
      .select('*')
      .eq('id', emailId)
      .eq('user_id', user.id)
      .single()

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 })
    }

    const followupEmail = await generateEmailFollowup(
      {
        subject: email.subject,
        from: email.from,
        body: email.body,
      },
      tone || 'professional'
    )

    return NextResponse.json({ followupEmail })
  } catch (error: any) {
    console.error('Followup generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
