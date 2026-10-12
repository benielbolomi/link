import { useState, useEffect, useMemo } from 'react'
import {
  Loader2, AlertCircle, Users, Building2, Trophy,
  TrendingUp, BarChart3, ChevronDown
} from 'lucide-react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import { supabase } from '../lib/supabase.js'
import { questionnaires, profileLabels } from '../lib/questionnaires.js'

export default function ResultsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedProfile, setExpandedProfile] = useState(null)

  useEffect(() => {
    async function fetchResults() {
      try {
        const { data: rows, error } = await supabase
          .from('survey_responses')
          .select('profile, responses, submitted_at')
          .order('submitted_at', { ascending: false })

        if (error) throw error
        setData(rows || [])
      } catch (err) {
        setError("Impossible de charger les résultats pour le moment.")
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [])

  const stats = useMemo(() => {
    if (!data) return { total: 0, byProfile: {} }
    const byProfile = {}
    for (const row of data) {
      byProfile[row.profile] = (byProfile[row.profile] || 0) + 1
    }
    return { total: data.length, byProfile }
  }, [data])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="card max-w-md p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h1 className="mt-4 text-xl font-semibold text-neutral-900">Erreur</h1>
            <p className="mt-2 text-neutral-600">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <h1 className="text-3xl font-bold text-primary-950">Résultats du sondage</h1>
          <p className="mt-2 text-neutral-600">
            Vue d'ensemble des réponses collectées. Les données sont agrégées et anonymes.
          </p>

          {/* Summary cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={<BarChart3 className="w-6 h-6" />}
              label="Total des réponses"
              value={stats.total}
              color="primary"
            />
            <SummaryCard
              icon={<Building2 className="w-6 h-6" />}
              label="Entreprises"
              value={stats.byProfile.entreprise || 0}
              color="primary"
            />
            <SummaryCard
              icon={<Trophy className="w-6 h-6" />}
              label="Clubs & créateurs"
              value={stats.byProfile.beneficiaire || 0}
              color="accent"
            />
            <SummaryCard
              icon={<Users className="w-6 h-6" />}
              label="Grand public"
              value={stats.byProfile.public || 0}
              color="primary"
            />
          </div>

          {/* Per-profile breakdown */}
          <div className="mt-10 space-y-6">
            {Object.entries(questionnaires).map(([key, q]) => {
              const profileData = data?.filter((r) => r.profile === key) || []
              const isOpen = expandedProfile === key
              return (
                <div key={key} className="card overflow-hidden">
                  <button
                    onClick={() => setExpandedProfile(isOpen ? null : key)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-neutral-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex w-10 h-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                        {key === 'entreprise' ? <Building2 className="w-5 h-5" /> :
                         key === 'beneficiaire' ? <Trophy className="w-5 h-5" /> :
                         <Users className="w-5 h-5" />}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-neutral-900">{profileLabels[key]}</h2>
                        <p className="text-sm text-neutral-500">{profileData.length} réponse{profileData.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="border-t border-neutral-200 p-6">
                      {profileData.length === 0 ? (
                        <p className="text-center py-8 text-neutral-400">Aucune réponse pour ce profil pour l'instant.</p>
                      ) : (
                        <ProfileBreakdown questionnaire={q} responses={profileData} />
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function SummaryCard({ icon, label, value, color }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-50 text-accent-600',
  }
  return (
    <div className="card p-5">
      <div className={`flex w-12 h-12 items-center justify-center rounded-xl ${colors[color]}`}>
        {icon}
      </div>
      <p className="mt-4 text-3xl font-bold text-neutral-900">{value}</p>
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  )
}

function ProfileBreakdown({ questionnaire, responses }) {
  const allQuestions = questionnaire.sections.flatMap((s) => s.questions)

  return (
    <div className="space-y-6">
      {allQuestions.map((q) => {
        const allAnswers = responses
          .map((r) => r.responses?.[q.id])
          .filter((a) => a !== undefined && a !== null && a !== '')

        if (allAnswers.length === 0) return null

        return (
          <div key={q.id}>
            <h3 className="text-sm font-semibold text-neutral-900">{q.label}</h3>
            <div className="mt-3">
              {q.type === 'radio' || q.type === 'select' ? (
                <RadioBreakdown question={q} answers={allAnswers} />
              ) : q.type === 'checkbox' ? (
                <CheckboxBreakdown question={q} answers={allAnswers} />
              ) : (
                <TextBreakdown answers={allAnswers} />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function RadioBreakdown({ question, answers }) {
  const counts = {}
  let otherCount = 0
  for (const a of answers) {
    if (typeof a === 'string' && a.startsWith('__other__:')) {
      otherCount++
    } else {
      counts[a] = (counts[a] || 0) + 1
    }
  }
  const total = answers.length
  const options = question.options || []

  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const count = counts[opt.value] || 0
        const pct = total > 0 ? (count / total) * 100 : 0
        return (
          <div key={opt.value} className="flex items-center gap-3">
            <span className="w-48 shrink-0 text-sm text-neutral-700">{opt.label}</span>
            <div className="flex-1">
              <div className="h-6 overflow-hidden rounded-md bg-neutral-100">
                <div
                  className="h-full rounded-md bg-primary-500 transition-all"
                  style={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
                />
              </div>
            </div>
            <span className="w-12 shrink-0 text-right text-sm font-medium text-neutral-900">
              {count}
            </span>
          </div>
        )
      })}
      {otherCount > 0 && (
        <div className="flex items-center gap-3">
          <span className="w-48 shrink-0 text-sm text-neutral-700">Autre</span>
          <div className="flex-1">
            <div className="h-6 overflow-hidden rounded-md bg-neutral-100">
              <div className="h-full rounded-md bg-accent-500" style={{ width: `${(otherCount / total) * 100}%` }} />
            </div>
          </div>
          <span className="w-12 shrink-0 text-right text-sm font-medium text-neutral-900">{otherCount}</span>
        </div>
      )}
    </div>
  )
}

function CheckboxBreakdown({ question, answers }) {
  const counts = {}
  let otherCount = 0
  for (const a of answers) {
    if (Array.isArray(a)) {
      for (const v of a) {
        if (typeof v === 'string' && v.startsWith('__other__:')) {
          otherCount++
        } else {
          counts[v] = (counts[v] || 0) + 1
        }
      }
    }
  }
  const options = question.options || []
  const maxCount = Math.max(...Object.values(counts), 1)

  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const count = counts[opt.value] || 0
        const pct = (count / maxCount) * 100
        return (
          <div key={opt.value} className="flex items-center gap-3">
            <span className="w-48 shrink-0 text-sm text-neutral-700">{opt.label}</span>
            <div className="flex-1">
              <div className="h-6 overflow-hidden rounded-md bg-neutral-100">
                <div
                  className="h-full rounded-md bg-accent-500 transition-all"
                  style={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
                />
              </div>
            </div>
            <span className="w-12 shrink-0 text-right text-sm font-medium text-neutral-900">
              {count}
            </span>
          </div>
        )
      })}
      {otherCount > 0 && (
        <div className="flex items-center gap-3">
          <span className="w-48 shrink-0 text-sm text-neutral-700">Autre</span>
          <div className="flex-1">
            <div className="h-6 overflow-hidden rounded-md bg-neutral-100">
              <div className="h-full rounded-md bg-primary-500" style={{ width: `${(otherCount / maxCount) * 100}%` }} />
            </div>
          </div>
          <span className="w-12 shrink-0 text-right text-sm font-medium text-neutral-900">{otherCount}</span>
        </div>
      )}
    </div>
  )
}

function TextBreakdown({ answers }) {
  return (
    <div className="space-y-2">
      {answers.map((a, i) => {
        const text = typeof a === 'string' && a.startsWith('__other__:') ? a.slice(9) : a
        if (!text || (typeof text === 'string' && text.trim() === '')) return null
        return (
          <div key={i} className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
            {text}
          </div>
        )
      })}
    </div>
  )
}
