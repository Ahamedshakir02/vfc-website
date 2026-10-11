import { useEffect, useId, useRef, useState } from 'react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { useContent } from '../lib/content.jsx'
import { formatFee, isSampleField } from '../lib/format.js'
import {
  canStoreRegistrations,
  submitRegistration,
  tidyDetails,
  upiPayLink,
  validateRegistration,
} from '../lib/registrations.js'
import { PAYMENT_METHOD } from '../data/schema.js'
import Sample from './Sample.jsx'
import Invoice from './Invoice.jsx'

const EMPTY = { name: '', phone: '', email: '', category: '', teamName: '', paymentRef: '', screenshot: null }

const inputClass =
  'h-13 w-full rounded-control border border-ink/40 bg-white px-4 text-base text-ink outline-offset-2 disabled:bg-sand disabled:text-ink/50'
const alertClass = 'font-semibold text-[#a3261c]'

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
 * Stands in for the gateway's payment page when the site runs on the local
 * emulators, where the payment functions hand out demo orders. It can never
 * appear on the live site: a deployed function refuses to settle one.
 */
function DemoCheckout({ fee, onAnswer }) {
  const { t } = useLang()
  const dialog = useRef(null)

  useEffect(() => {
    if (!dialog.current.open) dialog.current.showModal()
  }, [])

  return (
    <dialog
      ref={dialog}
      // Escape counts as backing out.
      onClose={() => onAnswer(dialog.current.returnValue === 'pay')}
      aria-labelledby="demo-pay-heading"
      className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-tile bg-white p-7 text-ink backdrop:bg-brand-deep/70"
    >
      <h2 id="demo-pay-heading" className="text-2xl font-bold text-brand">
        {t(strings.form.demoHeading)}
      </h2>
      <p className="mt-3 text-ink/80">{t(strings.form.demoBody)}</p>
      <div className="mt-6 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => dialog.current.close('pay')}
          className="h-13 rounded-control bg-gold font-semibold text-brand-deep transition-colors hover:bg-brand-deep hover:text-white"
        >
          {t(strings.form.demoPay, { fee })}
        </button>
        <button
          type="button"
          onClick={() => dialog.current.close('cancel')}
          className="h-11 rounded-control border border-brand/35 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
        >
          {t(strings.form.demoCancel)}
        </button>
      </div>
    </dialog>
  )
}

/**
 * Registration for one event: details, then the entry fee.
 *
 * The fee is paid one of two ways, whichever the club has set up at /admin:
 *  - online, through the payment gateway, which registers the visitor the
 *    moment the payment goes through (src/lib/payments.js);
 *  - by UPI in the visitor's own app, with the reference and a screenshot
 *    given here for an officer to check by hand.
 * With both set up the visitor chooses.
 *
 * The form is only live when it can really store a registration and the fee
 * and a way to pay it are known. Until then it stays visible but disabled,
 * and says so.
 */
export default function RegistrationForm({ event }) {
  const { t, lang } = useLang()
  const { site } = useContent()
  const [values, setValues] = useState({ ...EMPTY, category: event.categories?.[0]?.id ?? '' })
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle') // idle | sending | sent | failed
  const [problem, setProblem] = useState(null) // what to say when `failed`
  const [invoice, setInvoice] = useState(null) // what was registered and paid, once it has gone through
  const [copied, setCopied] = useState(false)
  const [rejected, setRejected] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [demoOrder, setDemoOrder] = useState(null) // { answer } while the stand-in payment page is up
  const formRef = useRef(null)

  // After a rejected submit, take the visitor to the first problem rather than
  // leaving them to hunt. Runs after render, once the fields are marked invalid.
  useEffect(() => {
    if (rejected) formRef.current?.querySelector('[aria-invalid="true"]')?.focus()
  }, [rejected])

  const fee = formatFee(event.fee)
  const upiId = site.upiId
  // The payment function charges what the stored event says, so an event that
  // only exists in the built-in list cannot be paid for online.
  const methods = [
    site.payOnline && event.stored && PAYMENT_METHOD.online,
    upiId && PAYMENT_METHOD.upi,
  ].filter(Boolean)
  const method = methods.includes(chosen) ? chosen : methods[0]
  const online = method === PAYMENT_METHOD.online

  const ready = canStoreRegistrations && Boolean(fee) && methods.length > 0
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
      await navigator.clipboard.writeText(upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked: the ID is on screen to copy by hand.
    }
  }

  // The invoice number is the registration's own id, so the club can look it up.
  const finish = (registrationId, paymentRef, paidOnline) => {
    const details = tidyDetails(values)
    setInvoice({
      ...details,
      number: `VFC-${registrationId.slice(0, 8).toUpperCase()}`,
      date: new Date(),
      eventTitle: event.title,
      category: t(event.categories?.find((category) => category.id === details.category)?.label),
      amount: fee,
      paymentRef,
      online: paidOnline,
    })
    setState('sent')
  }

  const fail = (message) => {
    setProblem(message)
    setState('failed')
  }

  const payOnline = async () => {
    // Loaded here, so only someone who pays online downloads the payments code.
    let payments
    try {
      payments = await import('../lib/payments.js')
    } catch {
      fail(t(strings.form.payFailed))
      return
    }

    const askDemo = () => new Promise((answer) => setDemoOrder({ answer }))
    try {
      const paid = await payments.payAndRegister(event, tidyDetails(values), askDemo)
      if (!paid) {
        fail(t(strings.form.payCancelled))
        return
      }
      finish(paid.registrationId, paid.paymentId, true)
    } catch (error) {
      fail(
        error.stage === 'confirm'
          ? t(strings.form.payUnconfirmed, { ref: error.ref || '-' })
          : t(strings.form.payFailed),
      )
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (disabled) return

    const found = validateRegistration(values, method)
    setErrors(found)
    if (Object.keys(found).length) {
      setState('idle')
      setRejected((n) => n + 1)
      return
    }

    setState('sending')
    if (online) {
      await payOnline()
      return
    }
    try {
      finish(await submitRegistration(event.id, values), values.paymentRef.trim(), false)
    } catch {
      fail(t(strings.form.failed))
    }
  }

  const error = (field) => errors[field] && t(strings.form.errors[errors[field]])

  if (state === 'sent') {
    return (
      <div role="status" className="rounded-tile border border-brand/15 bg-white p-7 sm:p-9">
        <h2 className="text-3xl font-bold text-brand">{t(strings.form.heading)}</h2>
        <p className="mb-6 mt-4 text-lg leading-relaxed">
          {t(invoice.online ? strings.form.successOnline : strings.form.success)}
        </p>
        <Invoice invoice={invoice} />
      </div>
    )
  }

  const feeLine = (
    <div>
      <div className="text-[0.8125rem] text-white/80">{online ? t(strings.form.amount) : t(strings.form.send)}</div>
      <div className="font-display text-2xl font-bold leading-tight">
        <Sample when={!fee || isSampleField(event, 'fee')}>{fee ?? t(strings.events.toBeAnnounced)}</Sample>
      </div>
    </div>
  )

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
              {(event.categories ?? []).map((category) => (
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

      {methods.length > 1 && (
        <fieldset className="flex min-w-0 flex-col gap-2">
          <legend className="float-left mb-2 w-full text-[0.9375rem] font-semibold">{t(strings.form.payChoice)}</legend>
          {[
            { id: PAYMENT_METHOD.online, label: t(strings.form.payOnline), hint: t(strings.form.payOnlineHint) },
            { id: PAYMENT_METHOD.upi, label: t(strings.form.payUpi), hint: t(strings.form.payUpiHint) },
          ].map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-start gap-3 rounded-control border p-4 transition-colors ${
                method === option.id ? 'border-brand bg-brand/5' : 'border-ink/25 hover:bg-sand'
              }`}
            >
              <input
                type="radio"
                name="pay-method"
                value={option.id}
                checked={method === option.id}
                onChange={() => setChosen(option.id)}
                disabled={sending}
                className="mt-1 h-4 w-4 flex-none accent-brand"
              />
              <span>
                <span className="block font-semibold">{option.label}</span>
                <span className="block text-sm text-ink/65">{option.hint}</span>
              </span>
            </label>
          ))}
        </fieldset>
      )}

      {online ? (
        <div className="flex flex-col gap-4 rounded-tile bg-sand p-5 sm:p-6">
          <h3 className="font-display text-xl font-bold text-brand">{t(strings.form.onlineHeading)}</h3>
          <div className="rounded-control bg-brand p-5 text-white">{feeLine}</div>
          <p className="text-sm text-ink/75">{t(strings.form.onlineBody)}</p>
        </div>
      ) : (
        <fieldset className="flex min-w-0 flex-col gap-5 rounded-tile bg-sand p-5 sm:p-6">
          <legend className="float-left w-full font-display text-xl font-bold text-brand">
            {t(strings.form.payHeading)}
          </legend>

          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-control bg-brand p-5 text-white">
            {feeLine}
            <div className="min-w-0">
              <div className="text-[0.8125rem] text-white/80">{t(strings.form.toUpi)}</div>
              <div className="break-all font-display text-2xl font-bold leading-tight">
                {upiId || <span className="text-base font-semibold">{t(strings.form.upiPending)}</span>}
              </div>
            </div>
            {/* Phones only: a laptop has no UPI app to open. Copying the ID still works everywhere. */}
            {upiId && fee && (
              <a
                href={upiPayLink(upiId, event.title.en, event.fee)}
                className="flex h-12 basis-full items-center justify-center rounded-control bg-gold font-semibold text-brand-deep md:hidden"
              >
                {t(strings.form.openUpi)}
              </a>
            )}
            {upiId && (
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
      )}

      {Object.keys(errors).length > 0 && (
        <p role="alert" className={alertClass}>
          {t(strings.form.fixErrors)}
        </p>
      )}
      {state === 'failed' && (
        <p role="alert" className={`${alertClass} break-words`}>
          {problem}
        </p>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="h-14 rounded-control bg-gold text-base font-semibold text-brand-deep transition-colors hover:bg-brand-deep hover:text-white disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/55"
      >
        {sending
          ? t(online ? strings.form.paying : strings.form.sending)
          : online && fee
            ? t(strings.form.payAndRegister, { fee })
            : t(strings.actions.submitRegistration)}
      </button>
      <p className="text-sm text-ink/65">{t(online ? strings.form.noteOnline : strings.form.note)}</p>

      {demoOrder && (
        <DemoCheckout
          fee={fee}
          onAnswer={(pay) => {
            setDemoOrder(null)
            demoOrder.answer(pay)
          }}
        />
      )}
    </form>
  )
}
