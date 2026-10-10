import { useEffect, useId, useRef, useState } from 'react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import {
  CLUB_UPI_ID,
  canRegisterOnline,
  submitRegistration,
  upiPayLink,
  validateRegistration,
} from '../lib/registrations.js'
import Sample from './Sample.jsx'

const EMPTY = { name: '', phone: '', email: '', category: '', teamName: '', paymentRef: '', screenshot: null }

const inputClass =
  'h-13 w-full rounded-control border border-ink/40 bg-white px-4 text-base text-ink outline-offset-2 disabled:bg-sand disabled:text-ink/50'

/** A label, its control, any help text and its error, wired together for screen readers. */
function Field({ label, optional, help, error, children }) {
  const id = useId()
  const describedBy = [help && `${id}-help`, error && `${id}-error`].filter(Boolean).join(' ') || undefined

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-[0.9375rem] font-semibold">
        {label} {optional && <span className="font-normal text-ink/65">{optional}</span>}
      </label>
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {help && (
        <p id={`${id}-help`} className="text-sm text-ink/65">
          {help}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-semibold text-[#a3261c]">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Registration for one event: details, manual UPI payment, proof of payment.
 *
 * Nothing is charged here. The visitor pays in their own UPI app and gives
 * the reference and a screenshot; the club verifies each one by hand.
 *
 * The form is only live when it can really store a registration and the fee
 * and UPI ID are known. Until then it stays visible but disabled, and says so.
 */
export default function RegistrationForm({ event }) {
  const { t, lang } = useLang()
  const [values, setValues] = useState({ ...EMPTY, category: event.categories[0]?.id ?? '' })
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle') // idle | sending | sent | failed
  const [copied, setCopied] = useState(false)
  const [rejected, setRejected] = useState(0)
  const formRef = useRef(null)

  // After a rejected submit, take the visitor to the first problem rather than
  // leaving them to hunt. Runs after render, once the fields are marked invalid.
  useEffect(() => {
    if (rejected) formRef.current?.querySelector('[aria-invalid="true"]')?.focus()
  }, [rejected])

  const ready = canRegisterOnline && Boolean(event.fee)
  const sending = state === 'sending'
  const disabled = !ready || sending

  const set = (field) => (e) => {
    const value = field === 'screenshot' ? (e.target.files?.[0] ?? null) : e.target.value
    setValues((v) => ({ ...v, [field]: value }))
    // A field's error clears as soon as it is touched again.
    if (errors[field]) setErrors(({ [field]: _gone, ...rest }) => rest)
  }

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(CLUB_UPI_ID)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked: the ID is on screen to copy by hand.
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (disabled) return

    const found = validateRegistration(values)
    setErrors(found)
    if (Object.keys(found).length) {
      setState('idle')
      setRejected((n) => n + 1)
      return
    }

    setState('sending')
    try {
      await submitRegistration(event.id, values)
      setState('sent')
    } catch {
      setState('failed')
    }
  }

  const error = (field) => errors[field] && t(strings.form.errors[errors[field]])

  if (state === 'sent') {
    return (
      <div role="status" className="rounded-tile border border-brand/15 bg-white p-7 sm:p-9">
        <h2 className="text-3xl font-bold text-brand">{t(strings.form.heading)}</h2>
        <p className="mt-4 text-lg leading-relaxed">{t(strings.form.success)}</p>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      className="flex flex-col gap-6 rounded-tile border border-brand/15 bg-white p-6 sm:p-9"
    >
      <div>
        <h2 className="text-3xl font-bold text-brand">{t(strings.form.heading)}</h2>
        <p className="mt-1.5 text-ink/65">{t(strings.form.intro)}</p>
      </div>

      {!ready && (
        <p role="status" className="rounded-control bg-brand/10 p-4 font-semibold text-brand-deep">
          {t(strings.form.notReady)}
        </p>
      )}

      <Field label={t(strings.form.name)} error={error('name')}>
        {(props) => (
          <input {...props} type="text" autoComplete="name" value={values.name} onChange={set('name')} disabled={disabled} className={inputClass} />
        )}
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={t(strings.form.phone)} error={error('phone')}>
          {(props) => (
            <input {...props} type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={set('phone')} disabled={disabled} className={inputClass} />
          )}
        </Field>
        <Field label={t(strings.form.email)} optional={t(strings.form.optional)} error={error('email')}>
          {(props) => (
            <input {...props} type="email" autoComplete="email" value={values.email} onChange={set('email')} disabled={disabled} className={inputClass} />
          )}
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={t(strings.form.category)} error={error('category')}>
          {(props) => (
            <select {...props} value={values.category} onChange={set('category')} disabled={disabled} className={inputClass}>
              {event.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {t(category.label)}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label={t(strings.form.team)} optional={t(strings.form.optional)}>
          {(props) => (
            <input {...props} type="text" value={values.teamName} onChange={set('teamName')} disabled={disabled} className={inputClass} />
          )}
        </Field>
      </div>

      <fieldset className="flex min-w-0 flex-col gap-5 rounded-tile bg-sand p-5 sm:p-6">
        <legend className="float-left w-full font-display text-xl font-bold text-brand">
          {t(strings.form.payHeading)}
        </legend>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-control bg-brand p-5 text-white">
          <div>
            <div className="text-[0.8125rem] text-white/80">{t(strings.form.send)}</div>
            <div className="font-display text-2xl font-bold leading-tight">
              {event.fee ?? <Sample>{t(strings.events.toBeAnnounced)}</Sample>}
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[0.8125rem] text-white/80">{t(strings.form.toUpi)}</div>
            <div className="break-all font-display text-2xl font-bold leading-tight">
              {CLUB_UPI_ID || <span className="text-base font-semibold">{t(strings.form.upiPending)}</span>}
            </div>
          </div>
          {/* Phones only: a laptop has no UPI app to open. Copying the ID still works everywhere. */}
          {CLUB_UPI_ID && (
            <a
              href={upiPayLink(event.title.en)}
              className="flex h-12 basis-full items-center justify-center rounded-control bg-gold font-semibold text-brand-deep md:hidden"
            >
              {t(strings.form.openUpi)}
            </a>
          )}
          {CLUB_UPI_ID && (
            <button
              type="button"
              onClick={copyUpi}
              className="h-11 rounded-control border border-white/50 px-4 text-sm font-semibold transition-colors hover:bg-white hover:text-brand"
            >
              <span aria-live="polite">{copied ? t(strings.form.copied) : t(strings.form.copy)}</span>
            </button>
          )}
        </div>

        <Field label={t(strings.form.paymentRef)} help={t(strings.form.paymentRefHelp)} error={error('paymentRef')}>
          {(props) => (
            <input {...props} type="text" autoComplete="off" value={values.paymentRef} onChange={set('paymentRef')} disabled={disabled} className={inputClass} />
          )}
        </Field>

        <Field label={t(strings.form.screenshot)} help={t(strings.form.screenshotHelp)} error={error('screenshot')}>
          {(props) => (
            <input
              {...props}
              // The browser's own "Choose file" text follows the page language.
              lang={lang}
              type="file"
              accept="image/*"
              onChange={set('screenshot')}
              disabled={disabled}
              className="w-full rounded-control border border-dashed border-ink/40 bg-white p-3.5 text-[0.9375rem] text-ink/80 outline-offset-2 disabled:bg-sand disabled:text-ink/50"
            />
          )}
        </Field>
      </fieldset>

      {Object.keys(errors).length > 0 && (
        <p role="alert" className="font-semibold text-[#a3261c]">
          {t(strings.form.fixErrors)}
        </p>
      )}
      {state === 'failed' && (
        <p role="alert" className="font-semibold text-[#a3261c]">
          {t(strings.form.failed)}
        </p>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="h-14 rounded-control bg-gold text-base font-semibold text-brand-deep transition-colors hover:bg-brand-deep hover:text-white disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/55"
      >
        {sending ? t(strings.form.sending) : t(strings.actions.submitRegistration)}
      </button>
      <p className="text-sm text-ink/65">{t(strings.form.note)}</p>
    </form>
  )
}
