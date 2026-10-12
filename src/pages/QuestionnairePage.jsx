import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, AlertCircle,
  Loader2, Home, RefreshCw, ChevronRight
} from 'lucide-react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import { QuestionField } from '../components/QuestionFields.jsx'
import { getQuestionnaire, profileLabels } from '../lib/questionnaires.js'
import { supabase } from '../lib/supabase.js'

export default function QuestionnairePage() {
  const { profile } = useParams()
  const navigate = useNavigate()

  const questionnaire = useMemo(() => getQuestionnaire(profile), [profile])

  // Flatten all questions, then filter based on conditions
  const [answers, setAnswers] = useState({})
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const allQuestions = useMemo(() => {
    if (!questionnaire) return []
    return questionnaire.sections.flatMap((s) =>
      s.questions.map((q) => ({ ...q, sectionTitle: s.title }))
    )
  }, [questionnaire])

  // Filter questions based on conditions — a question is visible only if its condition is met
  const visibleQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      if (!q.condition) return true
      const depAnswer = answers[q.condition.questionId]
      return depAnswer === q.condition.value
    })
  }, [allQuestions, answers])

  // Restore answers from sessionStorage on mount
  useEffect(() => {
    if (!questionnaire) return
    const saved = sessionStorage.getItem(`survey-${profile}`)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setAnswers(parsed.answers || {})
        if (parsed.step) setCurrentStep(parsed.step)
      } catch {}
    }
  }, [profile, questionnaire])

  // Persist answers to sessionStorage
  useEffect(() => {
    if (!questionnaire) return
    sessionStorage.setItem(`survey-${profile}`, JSON.stringify({ answers, step: currentStep }))
  }, [answers, currentStep, profile, questionnaire])

  if (!questionnaire) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="card max-w-md p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-error" />
            <h1 className="mt-4 text-xl font-semibold text-neutral-900">Profil introuvable</h1>
            <p className="mt-2 text-neutral-600">Le profil de sondage demandé n'existe pas.</p>
            <Link to="/sondage" className="btn-primary mt-6">
              Retour au sondage
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const totalSteps = visibleQuestions.length

  const setAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    if (errors[questionId]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[questionId]
        return next
      })
    }
  }

  const validateStep = (stepIdx) => {
    const question = visibleQuestions[stepIdx]
    if (!question) return true
    if (!question.required) return true

    const answer = answers[question.id]
    if (question.type === 'checkbox') {
      if (!answer || !Array.isArray(answer) || answer.length === 0) {
        setErrors((prev) => ({ ...prev, [question.id]: 'Veuillez sélectionner au moins une option.' }))
        return false
      }
    } else if (!answer || (typeof answer === 'string' && answer.trim() === '')) {
      setErrors((prev) => ({ ...prev, [question.id]: 'Ce champ est obligatoire.' }))
      return false
    }
    return true
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) return
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
      setErrors({})
    } else {
      // Validate all remaining questions
      const allValid = visibleQuestions.every((_, idx) => validateStep(idx))
      if (allValid) {
        setShowConfirmation(true)
        setErrors({})
      }
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError(null)

    // Clean up "other" placeholder values
    const cleanAnswers = { ...answers }
    for (const [key, val] of Object.entries(cleanAnswers)) {
      if (typeof val === 'string' && val === '__other__') {
        cleanAnswers[key] = ''
      }
      if (Array.isArray(val)) {
        cleanAnswers[key] = val.filter((v) => v !== '__other__:')
      }
    }

    try {
      const { error } = await supabase.from('survey_responses').insert({
        profile: questionnaire.profile,
        responses: cleanAnswers,
        questionnaire_version: '1.0',
      })

      if (error) throw error

      setSubmitted(true)
      sessionStorage.removeItem(`survey-${profile}`)
    } catch (err) {
      setSubmitError(
        "Une erreur est survenue lors de l'enregistrement de vos réponses. Veuillez réessayer."
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ---- Submitted state ----
  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="card max-w-lg p-8 text-center animate-slide-up">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-100">
              <CheckCircle2 className="h-8 w-8 text-accent-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-primary-950">Merci pour votre participation !</h1>
            <p className="mt-3 text-neutral-600">
              Vos réponses ont été enregistrées avec succès. Elles contribueront à mieux comprendre le
              paysage du sponsoring en République Démocratique du Congo.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/sondage" className="btn-secondary">
                <RefreshCw className="w-4 h-4" />
                Répondre à un autre questionnaire
              </Link>
              <Link to="/" className="btn-primary">
                <Home className="w-4 h-4" />
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ---- Confirmation page ----
  if (showConfirmation) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
            <button
              onClick={() => setShowConfirmation(false)}
              className="btn-ghost mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au questionnaire
            </button>

            <div className="card overflow-hidden">
              <div className="border-b border-neutral-200 bg-primary-50 px-6 py-5">
                <h1 className="text-xl font-bold text-primary-950">Vérifiez vos réponses</h1>
                <p className="mt-1 text-sm text-neutral-600">
                  Avant l'envoi définitif, vérifiez que vos réponses sont correctes.
                </p>
              </div>

              <div className="divide-y divide-neutral-100">
                {visibleQuestions.map((q, idx) => {
                  const answer = answers[q.id]
                  let displayValue = '—'

                  if (Array.isArray(answer)) {
                    const labels = answer
                      .filter((v) => v && v !== '__other__:')
                      .map((v) => {
                        if (v.startsWith('__other__:')) return `Autre: ${v.slice(9)}`
                        const opt = q.options?.find((o) => o.value === v)
                        return opt?.label || v
                      })
                    displayValue = labels.length > 0 ? labels.join(', ') : '—'
                  } else if (answer) {
                    if (answer.startsWith('__other__:')) {
                      displayValue = `Autre: ${answer.slice(9)}`
                    } else {
                      const opt = q.options?.find((o) => o.value === answer)
                      displayValue = opt?.label || answer
                    }
                  }

                  return (
                    <div key={q.id} className="flex gap-4 px-6 py-4">
                      <div className="flex w-8 shrink-0 text-sm font-semibold text-neutral-400">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-900">{q.label}</p>
                        <p className="mt-1 text-sm text-neutral-600">{displayValue}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-5">
                {submitError && (
                  <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {submitError}
                  </div>
                )}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="btn-secondary"
                    disabled={submitting}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Modifier mes réponses
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Confirmer et envoyer
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ---- Questionnaire form ----
  const currentQuestion = visibleQuestions[currentStep]
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0
  const remainingSteps = totalSteps - currentStep - 1

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-1.5 text-sm text-neutral-500">
            <Link to="/sondage" className="hover:text-primary-600">
              Sondage
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-neutral-700">
              {profileLabels[profile] || questionnaire.title}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-primary-900">
                Étape {currentStep + 1} sur {totalSteps}
              </span>
              <span className="text-neutral-500">
                {remainingSteps > 0
                  ? `${remainingSteps} étape${remainingSteps > 1 ? 's' : ''} restante${remainingSteps > 1 ? 's' : ''}`
                  : 'Dernière étape'}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-700 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Section title */}
          {currentQuestion && (
            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-primary-500">
              {currentQuestion.sectionTitle}
            </p>
          )}

          {/* Question card */}
          {currentQuestion && (
            <div
              key={currentQuestion.id}
              className="card p-6 sm:p-8 animate-slide-in"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-sm font-bold text-primary-700">
                  {currentStep + 1}
                </span>
                <h2 className="flex-1 text-lg font-semibold text-neutral-900 sm:text-xl">
                  {currentQuestion.label}
                  {!currentQuestion.required && (
                    <span className="ml-2 text-sm font-normal text-neutral-400">(facultatif)</span>
                  )}
                </h2>
              </div>

              <div className="mt-6 pl-0 sm:pl-11">
                <QuestionField
                  question={currentQuestion}
                  value={answers[currentQuestion.id]}
                  onChange={(val) => setAnswer(currentQuestion.id, val)}
                />

                {errors[currentQuestion.id] && (
                  <p className="mt-3 flex items-center gap-1.5 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {errors[currentQuestion.id]}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="btn-secondary"
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4" />
              Précédent
            </button>

            <span className="hidden text-sm text-neutral-400 sm:block">
              Vos réponses sont sauvegardées automatiquement
            </span>

            <button onClick={handleNext} className="btn-primary">
              {currentStep === totalSteps - 1 ? (
                <>
                  Vérifier mes réponses
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
