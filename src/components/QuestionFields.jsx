import { Check } from 'lucide-react'

export function RadioField({ question, value, onChange }) {
  const options = question.options || []
  const otherSelected = value && !options.some((o) => o.value === value)

  return (
    <div className="space-y-3">
      {options.map((opt) => {
        const selected = value === opt.value
        return (
          <label
            key={opt.value}
            className={`radio-option ${selected ? 'radio-option-selected' : ''}`}
          >
            <input
              type="radio"
              name={question.id}
              value={opt.value}
              checked={selected}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${selected ? 'border-primary-600 bg-primary-600' : 'border-neutral-300'}`}>
              {selected && <span className="h-2 w-2 rounded-full bg-white" />}
            </span>
            <span className="text-neutral-800">{opt.label}</span>
          </label>
        )
      })}

      {question.allowOther && (
        <label className={`radio-option ${otherSelected ? 'radio-option-selected' : ''}`}>
          <input
            type="radio"
            name={question.id}
            checked={otherSelected}
            onChange={() => onChange('__other__')}
            className="sr-only"
          />
          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${otherSelected ? 'border-primary-600 bg-primary-600' : 'border-neutral-300'}`}>
            {otherSelected && <span className="h-2 w-2 rounded-full bg-white" />}
          </span>
          <input
            type="text"
            placeholder="Autre raison..."
            value={otherSelected ? (value.startsWith('__other__:') ? value.slice(9) : '') : ''}
            onChange={(e) => onChange(`__other__:${e.target.value}`)}
            onClick={() => !otherSelected && onChange('__other__:')}
            className="flex-1 border-0 bg-transparent p-0 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-0"
          />
        </label>
      )}
    </div>
  )
}

export function CheckboxField({ question, value, onChange }) {
  const options = question.options || []
  const selectedValues = Array.isArray(value) ? value : []
  const hasOther = selectedValues.some((v) => v.startsWith('__other__:'))
  const otherText = hasOther
    ? (selectedValues.find((v) => v.startsWith('__other__:')) || '').slice(9)
    : ''

  const toggle = (val) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val))
    } else {
      onChange([...selectedValues, val])
    }
  }

  return (
    <div className="space-y-3">
      {options.map((opt) => {
        const selected = selectedValues.includes(opt.value)
        return (
          <label
            key={opt.value}
            className={`checkbox-option ${selected ? 'checkbox-option-selected' : ''}`}
          >
            <input
              type="checkbox"
              checked={selected}
              onChange={() => toggle(opt.value)}
              className="sr-only"
            />
            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${selected ? 'border-primary-600 bg-primary-600' : 'border-neutral-300'}`}>
              {selected && <Check className="h-3 w-3 text-white" />}
            </span>
            <span className="text-neutral-800">{opt.label}</span>
          </label>
        )
      })}

      {question.allowOther && (
        <label className={`checkbox-option ${hasOther ? 'checkbox-option-selected' : ''}`}>
          <input
            type="checkbox"
            checked={hasOther}
            onChange={() => {
              if (hasOther) {
                onChange(selectedValues.filter((v) => !v.startsWith('__other__:')))
              } else {
                onChange([...selectedValues, '__other__:'])
              }
            }}
            className="sr-only"
          />
          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${hasOther ? 'border-primary-600 bg-primary-600' : 'border-neutral-300'}`}>
            {hasOther && <Check className="h-3 w-3 text-white" />}
          </span>
          <input
            type="text"
            placeholder="Autre..."
            value={otherText}
            onChange={(e) => {
              const cleaned = selectedValues.filter((v) => !v.startsWith('__other__:'))
              onChange([...cleaned, `__other__:${e.target.value}`])
            }}
            onClick={() => !hasOther && onChange([...selectedValues, '__other__:'])}
            className="flex-1 border-0 bg-transparent p-0 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-0"
          />
        </label>
      )}
    </div>
  )
}

export function SelectField({ question, value, onChange }) {
  const options = question.options || []
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="input-field"
    >
      <option value="" disabled>
        Sélectionnez une option...
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

export function TextField({ question, value, onChange }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.placeholder || 'Votre réponse...'}
      maxLength={question.maxLength}
      className="input-field"
    />
  )
}

export function TextareaField({ question, value, onChange }) {
  const charCount = (value || '').length
  return (
    <div>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder || 'Votre réponse...'}
        maxLength={question.maxLength}
        rows={4}
        className="input-field resize-none"
      />
      {question.maxLength && (
        <p className="mt-1.5 text-right text-xs text-neutral-400">
          {charCount} / {question.maxLength} caractères
        </p>
      )}
    </div>
  )
}

export function QuestionField({ question, value, onChange }) {
  switch (question.type) {
    case 'radio':
      return <RadioField question={question} value={value} onChange={onChange} />
    case 'checkbox':
      return <CheckboxField question={question} value={value} onChange={onChange} />
    case 'select':
      return <SelectField question={question} value={value} onChange={onChange} />
    case 'text':
      return <TextField question={question} value={value} onChange={onChange} />
    case 'textarea':
      return <TextareaField question={question} value={value} onChange={onChange} />
    default:
      return null
  }
}
