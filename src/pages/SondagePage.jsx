import { Link } from 'react-router-dom'
import { Building2, Trophy, Users, Clock, ShieldCheck, ArrowRight } from 'lucide-react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import { questionnaires } from '../lib/questionnaires.js'

export default function SondagePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(51,102,255,0.15),transparent_60%)]" />
          <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
            <span className="inline-flex items-center rounded-full border border-primary-400/30 bg-primary-400/10 px-4 py-1.5 text-sm font-medium text-primary-200">
              Sondage · DRC Sponsoring Link
            </span>
            <h1 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Comprendre le sponsoring pour créer de meilleures opportunités
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100">
              Ce sondage vise à mieux comprendre les attentes des entreprises, des sponsors, des clubs
              sportifs, des athlètes, des créateurs de contenu et du grand public en matière de sponsoring
              en République Démocratique du Congo.
            </p>
          </div>
        </section>

        {/* Info banners */}
        <section className="mx-auto max-w-4xl px-4 pt-12 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <InfoPill icon={<Clock className="w-5 h-5" />} title="3 à 6 minutes" text="Selon votre profil" />
            <InfoPill icon={<ShieldCheck className="w-5 h-5" />} title="100% anonyme" text="Aucune donnée personnelle requise" />
            <InfoPill icon={<Users className="w-5 h-5" />} title="Vos réponses comptent" text="Elles aideront toute la communauté" />
          </div>
        </section>

        {/* Usage notice */}
        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <div className="card p-6 bg-primary-50/50 border-primary-100">
            <h2 className="text-base font-semibold text-primary-900">Comment vos réponses seront utilisées</h2>
            <p className="mt-2 text-sm text-neutral-700">
              Les réponses sont collectées de manière anonyme et agrégées pour analyser les besoins et les
              pratiques de sponsoring en RDC. Les résultats serviront à concevoir une plateforme de mise en
              relation entre sponsors et bénéficiaires. Aucune donnée personnelle n'est collectée dans ce
              sondage. Les éventuelles coordonnées demandées ultérieurement seront facultatives et
              accompagnées d'une information claire sur leur utilisation.
            </p>
          </div>
        </section>

        {/* Profile selection */}
        <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
          <h2 className="text-2xl font-bold text-primary-950">Choisissez votre profil</h2>
          <p className="mt-2 text-neutral-600">
            Sélectionnez la catégorie qui vous correspond le mieux pour accéder au questionnaire adapté.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <ProfileCard
              to="/sondage/entreprise"
              icon={<Building2 className="w-7 h-7" />}
              title="Entreprise ou sponsor potentiel"
              description="Vous représentez une entreprise souhaitant investir dans le sponsoring ou évaluer ses opportunités."
              minutes={questionnaires.entreprise.estimatedMinutes}
              accent="primary"
            />
            <ProfileCard
              to="/sondage/beneficiaire"
              icon={<Trophy className="w-7 h-7" />}
              title="Club, athlète ou créateur"
              description="Vous êtes un club sportif, un athlète ou un créateur de contenu cherchant des partenaires."
              minutes={questionnaires.beneficiaire.estimatedMinutes}
              accent="accent"
            />
            <ProfileCard
              to="/sondage/public"
              icon={<Users className="w-7 h-7" />}
              title="Grand public"
              description="Vous suivez le sport, les événements ou les créateurs et souhaitez partager votre perception."
              minutes={questionnaires.public.estimatedMinutes}
              accent="primary"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function InfoPill({ icon, title, text }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex w-10 h-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-neutral-900">{title}</p>
        <p className="text-xs text-neutral-500">{text}</p>
      </div>
    </div>
  )
}

function ProfileCard({ to, icon, title, description, minutes, accent }) {
  const accentClasses = {
    primary: 'bg-primary-50 text-primary-600 group-hover:bg-primary-100',
    accent: 'bg-accent-50 text-accent-600 group-hover:bg-accent-100',
  }
  const btnClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700',
    accent: 'bg-accent-600 hover:bg-accent-700',
  }

  return (
    <Link
      to={to}
      className="card group flex flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className={`flex w-14 h-14 items-center justify-center rounded-2xl transition-colors ${accentClasses[accent]}`}>
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-primary-950">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-neutral-600">{description}</p>
      <div className="mt-5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-neutral-500">
          <Clock className="w-3.5 h-3.5" />
          {minutes} min
        </span>
        <span className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all ${btnClasses[accent]}`}>
          Commencer le sondage
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}
