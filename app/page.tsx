import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            MindFlow
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Ton cerveau externe intelligent
          </p>
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
            Il se souvient, te prépare, et te relance pour toi.
            Plus rien ne sera oublié : ni un rendez-vous, ni une pièce jointe, ni un message à relancer.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Commencer gratuitement
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-20">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-3">Gestion intelligente des rendez-vous</h3>
            <p className="text-gray-600">
              Synchronisation avec ton agenda. L'IA détecte le contexte et te prépare automatiquement.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">✉️</div>
            <h3 className="text-xl font-semibold mb-3">Suivi et relance d'emails</h3>
            <p className="text-gray-600">
              L'IA scanne tes mails et génère des relances personnalisées adaptées à chaque client.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-3">IA compagnon</h3>
            <p className="text-gray-600">
              Pose tes questions, planifie tes tâches, et laisse l'IA t'assister au quotidien.
            </p>
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-8">Tarifs simples et transparents</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <p className="text-4xl font-bold mb-4">0€<span className="text-lg text-gray-500">/mois</span></p>
              <ul className="text-left space-y-2 text-gray-600">
                <li>✓ 1 agenda</li>
                <li>✓ 20 requêtes IA/mois</li>
                <li>✓ Synchronisation calendrier</li>
              </ul>
            </div>

            <div className="bg-blue-600 text-white p-8 rounded-xl shadow-lg transform scale-105">
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-4xl font-bold mb-4">9€<span className="text-lg opacity-80">/mois</span></p>
              <ul className="text-left space-y-2">
                <li>✓ IA illimitée</li>
                <li>✓ Relances automatiques</li>
                <li>✓ Agenda partagé</li>
                <li>✓ Intégration email</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-2">Team</h3>
              <p className="text-4xl font-bold mb-4">19€<span className="text-lg text-gray-500">/mois</span></p>
              <ul className="text-left space-y-2 text-gray-600">
                <li>✓ Collaboration</li>
                <li>✓ Intégrations avancées</li>
                <li>✓ Zapier, Notion, etc.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
