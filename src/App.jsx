import { Link } from 'react-router-dom'
import { ArrowRight, Handshake, Users, Megaphone } from 'lucide-react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(51,102,255,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.1),transparent_50%)]" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
            <div className="max-w-3xl animate-slide-up">
              <span className="inline-flex items-center rounded-full border border-primary-400/30 bg-primary-400/10 px-4 py-1.5 text-sm font-medium text-primary-200">
                Étude de marché · République Démocratique du Congo
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Comprendre le sponsoring pour créer de meilleures opportunités
              </h1>
              <p className="mt-6 text-lg text-primary-100 sm:text-xl">
                DRC Sponsoring Link recueille les attentes des entreprises, des sponsors, des clubs sportifs,
                des athlètes, des créateurs de contenu et du grand public pour bâtir une plateforme de mise en
                relation pertinente et fiable.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link to="/sondage" className="btn-primary">
                  Participer au sondage
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/resultats"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  Voir les résultats
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Info cards */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <InfoCard
              icon={<Megaphone className="w-6 h-6" />}
              title="Pour les entreprises"
              text="Faites entendre vos besoins en matière de visibilité et dites quelles preuves vous attendez d'un partenaire."
            />
            <InfoCard
              icon={<Handshake className="w-6 h-6" />}
              title="Pour les clubs & créateurs"
              text="Montrez ce que vous pouvez offrir, votre audience et votre capacité à respecter vos engagements."
            />
            <InfoCard
              icon={<Users className="w-6 h-6" />}
              title="Pour le grand public"
              text="Dites-nous comment vous percevez les marques qui soutiennent le sport, la culture et les créateurs."
            />
          </div>
        </section>

        {/* About */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-primary-950">À propos de cette étude</h2>
            <div className="mt-6 space-y-4 text-lg text-neutral-600">
              <p>
                La République Démocratique du Congo possède un tissu sportif, culturel et numérique riche,
                mais le sponsoring y reste peu structuré. Cette étude vise à mieux comprendre les attentes
                de chaque acteur pour concevoir une plateforme de mise en relation adaptée.
              </p>
              <p>
                Les réponses recueillies seront agrégées et analysées de manière anonyme. Elles nous aideront
                à identifier les freins, les opportunités et les bonnes pratiques du sponsoring en RDC.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="card p-6 transition-all hover:shadow-md">
      <div className="flex w-12 h-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-primary-950">{title}</h3>
      <p className="mt-2 text-sm text-neutral-600">{text}</p>
    </div>
  )
}
