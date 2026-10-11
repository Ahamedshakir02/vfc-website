import { createPortal } from 'react-dom'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import crestPurple from '../assets/vfc-crest-purple.png'

/**
 * The invoice itself: who registered, for what, and what was paid.
 *
 * It states only what the site knows. A payment made online is shown as paid;
 * one sent by UPI is shown as waiting for the club to verify it, because until
 * an officer has checked it nobody can say it arrived.
 */
function Sheet({ invoice }) {
  const { t, lang } = useLang()
  const s = strings.invoice

  const date = invoice.date.toLocaleDateString(lang === 'ml' ? 'ml-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const who = [
    { label: t(strings.form.name), value: invoice.name },
    { label: t(strings.form.phone), value: invoice.phone },
    { label: t(strings.form.email), value: invoice.email },
    { label: t(strings.form.team), value: invoice.teamName },
  ].filter((row) => row.value)

  return (
    <div className="rounded-tile border border-brand/20 bg-white p-6 text-ink sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand/15 pb-5">
        <div className="flex items-center gap-3">
          <img src={crestPurple} alt="" className="h-14 w-auto" />
          <div>
            <div className="font-display text-lg font-bold leading-tight text-brand">VFC Arts, Sports & Welfare Club</div>
            <div className="text-sm text-ink/65">{t(strings.footer.place)}</div>
          </div>
        </div>
        <div className="sm:text-right">
          <div className="font-display text-2xl font-bold text-brand">{t(s.title)}</div>
          <div className="text-sm text-ink/65">
            {t(s.number)} {invoice.number}
          </div>
          <div className="text-sm text-ink/65">{date}</div>
        </div>
      </div>

      <dl className="grid gap-x-8 gap-y-3 py-5 text-[0.9375rem] sm:grid-cols-2">
        {who.map((row) => (
          <div key={row.label}>
            <dt className="text-[0.8125rem] text-ink/65">{row.label}</dt>
            <dd className="break-words font-semibold">{row.value}</dd>
          </div>
        ))}
      </dl>

      <table className="w-full border-collapse text-[0.9375rem]">
        <thead>
          <tr className="border-y border-brand/15 text-left text-[0.8125rem] text-ink/65">
            <th scope="col" className="py-2.5 font-semibold">{t(s.item)}</th>
            <th scope="col" className="py-2.5 text-right font-semibold">{t(strings.form.amount)}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="align-top">
            <td className="py-3.5">
              <div className="font-semibold">{t(s.entryFee, { event: t(invoice.eventTitle) })}</div>
              {invoice.category && (
                <div className="text-sm text-ink/65">
                  {t(strings.form.category)}: {invoice.category}
                </div>
              )}
            </td>
            <td className="whitespace-nowrap py-3.5 text-right font-semibold">{invoice.amount}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="border-t border-brand/15">
            <th scope="row" className="py-3.5 text-left font-display text-lg font-bold text-brand">{t(s.total)}</th>
            <td className="whitespace-nowrap py-3.5 text-right font-display text-lg font-bold text-brand">{invoice.amount}</td>
          </tr>
        </tfoot>
      </table>

      <dl className="grid gap-x-8 gap-y-3 border-t border-brand/15 pt-5 text-[0.9375rem] sm:grid-cols-3">
        <div>
          <dt className="text-[0.8125rem] text-ink/65">{t(s.paidBy)}</dt>
          <dd className="font-semibold">{t(invoice.online ? s.online : s.upi)}</dd>
        </div>
        <div>
          <dt className="text-[0.8125rem] text-ink/65">{t(s.reference)}</dt>
          <dd className="break-all font-semibold">{invoice.paymentRef}</dd>
        </div>
        <div>
          <dt className="text-[0.8125rem] text-ink/65">{t(s.status)}</dt>
          <dd className={`font-semibold ${invoice.online ? 'text-[#17573a]' : 'text-[#6b4700]'}`}>
            {t(invoice.online ? s.paid : s.toVerify)}
          </dd>
        </div>
      </dl>

      {!invoice.online && <p className="mt-5 text-sm text-ink/70">{t(s.upiNote)}</p>}
    </div>
  )
}

/**
 * Shown once a registration has gone through, with a button that prints it or
 * saves it as a PDF (the browser's print dialog does both, on a phone too).
 *
 * A second copy sits outside the page, hidden until printing, when it is the
 * only thing on the paper: see the print rules in src/index.css.
 */
export default function Invoice({ invoice }) {
  const { t } = useLang()

  return (
    <>
      <Sheet invoice={invoice} />
      <button
        type="button"
        onClick={() => window.print()}
        className="mt-4 h-13 w-full rounded-control bg-brand px-6 font-semibold text-white transition-colors hover:bg-brand-deep sm:w-auto"
      >
        {t(strings.invoice.download)}
      </button>
      {createPortal(
        <div className="print-only p-2">
          <Sheet invoice={invoice} />
        </div>,
        document.body,
      )}
    </>
  )
}
