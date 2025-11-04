import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateChatCompletion(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  model: 'gpt-4o-mini' | 'gpt-4-turbo' = 'gpt-4o-mini'
) {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    })

    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to generate AI response')
  }
}

export async function analyzeEventContext(
  eventDescription: string,
  userContext?: string
) {
  const systemPrompt = `Tu es un assistant intelligent qui aide à organiser des rendez-vous.
Analyse la description de l'événement et extrais les informations clés.
Réponds au format JSON avec: {
  "contact": "nom du contact",
  "type": "type de rendez-vous (visio, facturation, coaching, etc.)",
  "tags": ["liste", "de", "tags"],
  "suggestions": ["liste de suggestions pour préparer le rendez-vous"]
}`

  return generateChatCompletion(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: eventDescription },
    ],
    'gpt-4o-mini'
  )
}

export async function generateEmailFollowup(
  emailContext: {
    subject: string
    from: string
    body: string
    previousEmails?: string[]
  },
  tone: 'professional' | 'friendly' | 'casual' = 'professional'
) {
  const toneDescriptions = {
    professional: 'professionnel et courtois',
    friendly: 'amical et chaleureux',
    casual: 'décontracté et détendu',
  }

  const systemPrompt = `Tu es un assistant qui génère des emails de relance.
Le ton doit être ${toneDescriptions[tone]}.
Génère un email court et efficace en français.`

  const userPrompt = `Sujet: ${emailContext.subject}
De: ${emailContext.from}
Message original: ${emailContext.body}

${emailContext.previousEmails ? `Emails précédents:\n${emailContext.previousEmails.join('\n---\n')}` : ''}

Génère une relance appropriée.`

  return generateChatCompletion(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    'gpt-4-turbo'
  )
}

export async function summarizeMeetingPreparation(meetingData: {
  title: string
  contact: string
  recentEmails: string[]
  documents: string[]
  previousNotes?: string
}) {
  const systemPrompt = `Tu es un assistant qui prépare des résumés de rendez-vous.
Crée un résumé concis et actionnable pour préparer le meeting.
Inclus les points clés à aborder et les documents à préparer.`

  const userPrompt = `Rendez-vous: ${meetingData.title}
Contact: ${meetingData.contact}

Emails récents:
${meetingData.recentEmails.join('\n---\n')}

Documents échangés:
${meetingData.documents.join(', ')}

${meetingData.previousNotes ? `Notes précédentes: ${meetingData.previousNotes}` : ''}

Prépare un résumé pour ce meeting.`

  return generateChatCompletion(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    'gpt-4-turbo'
  )
}
