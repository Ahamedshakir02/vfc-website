import { useEffect, useState } from 'react'
import { loadSite, saveSite } from '../../lib/admin.js'
import { BUILT_IN_SITE } from '../../lib/content.jsx'
import { emulated } from '../../lib/firebase.js'
import { Field, ScreenHead, alertClass, inputClass, noticeClass, solidButton, tile } from './ui.jsx'

const CONTACT_FIELDS = [
  { key: 'address', label: 'Address', wide: true },
  { key: 'phone', label: 'Phone', type: 'tel' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'mapsUrl', label: 'Google Maps link', type: 'url', wide: true, hint: 'In Google Maps: Share, then Copy link.' },
  { key: 'instagram', label: 'Instagram link', type: 'url' },
  { key: 'facebook', label: 'Facebook link', type: 'url' },
  { key: 'whatsapp', label: 'WhatsApp link', type: 'url', hint: 'For example https://wa.me/91 followed by the number.' },
]
const STAT_NAMES = { members: 'Members', events: 'Events run', awards: 'Awards won' }

const isLink = (value) => !value || /^https?:\/\/\S+$/.test(value)

function Check({ checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4 flex-none accent-brand" />
      <span>{children}</span>
    </label>
  )
}

function Part({ title, about, children }) {
  return (
    <section className={`${tile} flex flex-col gap-5 p-5 sm:p-7`}>
      <div>
        <h2 className="text-2xl font-bold text-brand">{title}</h2>
        {about && <p className="mt-1 text-sm text-ink/70">{about}</p>}
      </div>
      {children}
    </section>
  )
}

/**
 * The club's own details: how to reach it, the figures on the home page, and
 * how entry fees are paid. Everything here starts as placeholder content, and
 * each part is marked as such on the site until an officer says it is real.
 */
export default function Club() {
  const [site, setSite] = useState(null) // null until loaded
  const [unreadable, setUnreadable] = useState(false)
  const [state, setState] = useState('idle') // idle | saving | saved
  const [problem, setProblem] = useState('')

  useEffect(() => {
    let current = true
    loadSite()
      .then((saved) => {
        if (!current) return
        setSite({ ...BUILT_IN_SITE, ...saved, contact: { ...BUILT_IN_SITE.contact, ...saved?.contact } })
      })
      .catch(() => current && setUnreadable(true))
    return () => {
      current = false
    }
  }, [])

  if (unreadable || !site) {
    return (
      <>
        <ScreenHead title="Club details" />
        <p role={unreadable ? 'alert' : 'status'} className={`${noticeClass} mt-8`}>
          {unreadable ? 'This could not be loaded. Check your connection, then reload the page.' : 'Loading…'}
        </p>
      </>
    )
  }

  const change = (patch) => {
    setSite((s) => ({ ...s, ...patch }))
    setState('idle')
  }
  const setContact = (key) => (e) => change({ contact: { ...site.contact, [key]: e.target.value } })
  const setStat = (key, patch) =>
    change({ stats: site.stats.map((stat) => (stat.key === key ? { ...stat, ...patch } : stat)) })

  const save = async (e) => {
    e.preventDefault()
    setProblem('')

    const contact = Object.fromEntries(Object.entries(site.contact).map(([key, value]) => [key, String(value ?? '').trim()]))
    const badLink = CONTACT_FIELDS.find((field) => field.type === 'url' && !isLink(contact[field.key]))
    if (badLink) {
      setProblem(`${badLink.label}: paste the whole link, starting with https://`)
      return
    }
    const upiId = site.upiId.trim()
    if (upiId && !/^[\w.-]{2,}@[A-Za-z]{2,}$/.test(upiId)) {
      setProblem('That UPI ID does not look right. It has the form name@bank.')
      return
    }
    if (site.stats.some((stat) => !Number.isInteger(stat.value) || stat.value < 0)) {
      setProblem('Each figure must be a whole number.')
      return
    }

    setState('saving')
    try {
      await saveSite({
        contact,
        contactSample: site.contactSample,
        stats: site.stats,
        statsSample: site.statsSample,
        upiId,
        payOnline: site.payOnline,
        sampleNotice: site.sampleNotice,
        registration: (site.registration ?? '').trim(),
      })
      setState('saved')
    } catch {
      setProblem('This was not saved. Check your connection and try again.')
      setState('idle')
    }
  }

  return (
    <form noValidate onSubmit={save}>
      <ScreenHead title="Club details" about="How to reach the club, the figures on the home page, and how entry fees are paid." />

      <div className="mt-8 flex max-w-3xl flex-col gap-4">
        <Part title="Contact" about="Shown on the contact page, in the footer and on every event page.">
          <div className="grid gap-4 sm:grid-cols-2">
            {CONTACT_FIELDS.map((field) => (
              <Field key={field.key} label={field.label} hint={field.hint} className={field.wide ? 'sm:col-span-2' : ''}>
                {(id) => (
                  <input id={id} type={field.type ?? 'text'} value={site.contact[field.key] ?? ''} onChange={setContact(field.key)} className={inputClass} />
                )}
              </Field>
            ))}
          </div>
          <Check checked={!site.contactSample} onChange={(real) => change({ contactSample: !real })}>
            These are the club's real contact details.
          </Check>
        </Part>

        <Part title="Registration" about="Shown on the About page. Leave empty to leave it out.">
          <Field label="Society registration number" hint="As on the certificate, for example PKD/123/2010.">
            {(id) => (
              <input id={id} type="text" autoComplete="off" value={site.registration ?? ''} onChange={(e) => change({ registration: e.target.value })} className={`${inputClass} max-w-sm`} />
            )}
          </Field>
        </Part>

        <Part title="Figures" about="The three numbers on the home page.">
          <div className="grid gap-4 sm:grid-cols-3">
            {site.stats.map((stat) => (
              <div key={stat.key} className="flex flex-col gap-2">
                <Field label={STAT_NAMES[stat.key] ?? stat.key}>
                  {(id) => (
                    <input
                      id={id}
                      type="number"
                      inputMode="numeric"
                      min="0"
                      step="1"
                      value={Number.isNaN(stat.value) ? '' : stat.value}
                      onChange={(e) => setStat(stat.key, { value: e.target.valueAsNumber })}
                      className={inputClass}
                    />
                  )}
                </Field>
                <Check checked={stat.suffix === '+'} onChange={(more) => setStat(stat.key, { suffix: more ? '+' : '' })}>
                  <span className="text-sm">Show as “{Number.isNaN(stat.value) ? 0 : stat.value}+”</span>
                </Check>
              </div>
            ))}
          </div>
          <Check checked={!site.statsSample} onChange={(real) => change({ statsSample: !real })}>
            These are the club's real figures.
          </Check>
        </Part>

        <Part title="Payments" about="How someone registering for an event pays the entry fee. The fee itself is set on each event.">
          <Field
            label="Club UPI ID"
            hint="People send the fee here from their own UPI app and upload a screenshot, which an officer then checks under Registrations. Leave empty to switch this way of paying off."
          >
            {(id) => (
              <input id={id} type="text" autoComplete="off" value={site.upiId} onChange={(e) => change({ upiId: e.target.value })} className={`${inputClass} max-w-sm`} />
            )}
          </Field>
          <Check checked={site.payOnline} onChange={(payOnline) => change({ payOnline })}>
            <span className="font-semibold">Take payments online</span>
            <span className="block text-sm text-ink/70">
              People pay on the event page by UPI, card or net banking through Cashfree, and are registered at once
              with nothing for an officer to check. This only works once the club's Cashfree keys have been added to
              the site's server; until then, leave it off.
            </span>
          </Check>
          {emulated && (
            <p className="rounded-control bg-sand p-4 text-sm text-ink/80">
              Demo mode: with no Cashfree keys on this machine, a stand-in payment page is shown and no money moves.
            </p>
          )}
        </Part>

        <Part title="Sample content notice">
          <Check checked={site.sampleNotice} onChange={(sampleNotice) => change({ sampleNotice })}>
            <span className="font-semibold">Show the “sample content” line in the footer</span>
            <span className="block text-sm text-ink/70">
              Leave this on for as long as any photo, figure, award or contact detail on the site is a placeholder.
            </span>
          </Check>
        </Part>

        {problem && (
          <p role="alert" className={alertClass}>
            {problem}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={state === 'saving'} className={`${solidButton} h-13 px-7 text-base`}>
            {state === 'saving' ? 'Saving…' : 'Save club details'}
          </button>
          <p role="status" className="font-semibold text-[#1f6b45]">
            {state === 'saved' && 'Saved. The site now shows these.'}
          </p>
        </div>
      </div>
    </form>
  )
}
