import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateChatCompletion } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check AI usage limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('ai_requests_count, ai_requests_limit, subscription_tier')
      .eq('id', user.id)
      .single()

    if (profile.subscription_tier === 'free' && profile.ai_requests_count >= profile.ai_requests_limit) {
      return NextResponse.json(
        { error: 'Limite de requêtes IA atteinte. Passe à Pro pour continuer.' },
        { status: 429 }
      )
    }

    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const systemPrompt = `Tu es un assistant intelligent pour MindFlow, une application d'organisation pour solopreneurs.
Tu aides l'utilisateur à gérer son agenda, ses contacts, ses emails et ses tâches.
Sois concis, utile et proactif. Réponds toujours en français.`

    const response = await generateChatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ])

    // Increment AI request count
    if (profile.subscription_tier === 'free') {
      await supabase
        .from('profiles')
        .update({ ai_requests_count: profile.ai_requests_count + 1 })
        .eq('id', user.id)
    }

    return NextResponse.json({ response })
  } catch (error: any) {
    console.error('AI Chat error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
