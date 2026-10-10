import { useEffect, useRef, useState } from 'react'
import { EVENTS, getOpenEvent } from '../../data/events.js'
import { PAYMENT_STATUS } from '../../data/schema.js'
import { getScreenshotUrl, setPaymentStatus, watchRegistrations } from '../../lib/admin.js'

const FILTERS = [
  { id: 'all', label: 'All', empty: 'No registrations for this event yet.' },
  {
    id: PAYMENT_STATUS.pending,
    label: 'To check',
    empty: 'Nothing in this list. Every payment here has been dealt with.',
  },
  { id: PAYMENT_STATUS.verified, label: 'Verified', empty: 'No payment has been verified yet.' },
]

const tile = 'rounded-tile border border-brand/15 bg-white'
const quietButton =
  'h-11 rounded-control border border-brand/35 px-4 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:border-ink/20 disabled:text-ink/45 disabled:hover:bg-transparent'
const solidButton =
  'h-11 whitespace-nowrap rounded-control bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-deep'

const isVerified = (row) => row.paymentStatus === PAYMENT_STATUS.verified
const received = (row) => row.createdAt?.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) ?? ''

/** The stored category is an id; show the name the registrant picked. */
const categoryName = (event, id) => event.categories.find((category) => category.id === id)?.label.en ?? id

/** Saves the event's whole list as a spreadsheet file, whatever filter is showing. */
function exportList(event, rows) {
  const cell = (value) => {
    let text = String(value ?? '')
    // These were typed into a public form. A cell that opens like a formula
    // would be run by the spreadsheet, so make it plain text.
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
    return `"${text.replace(/"/g, '""')}"`
  }

  const lines = [
    ['Name', 'Team', 'Phone', 'Email', 'Category', 'UPI reference', 'Payment', 'Received'],
    ...rows.map((row) => [
      row.name,
      row.teamName,
      row.phone,
      row.email,
      categoryName(event, row.category),
      row.paymentRef,
      isVerified(row) ? 'Verified' : 'To check',
      received(row),
    ]),
  ].map((line) => line.map(cell).join(','))

  // The leading mark tells Excel the file is UTF-8, so Malayalam names survive.
  const file = new Blob([`﻿${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(file)
  link.download = `${event.id}-registrations.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

function PaymentTag({ row }) {
  return isVerified(row) ? (
    <span className="inline-block rounded-control bg-[#dcefe4] px-3 py-1.5 text-[0.8125rem] font-semibold text-[#17573a]">
      Verified
    </span>
  ) : (
    <span className="inline-block whitespace-nowrap rounded-control bg-[#f6e7c4] px-3 py-1.5 text-[0.8125rem] font-semibold text-[#6b4700]">
      To check
    </span>
  )
}

/** The payment screenshot, with what it has to be checked against beside it. */
function Proof({ row, onVerify, onClose }) {
  const dialog = useRef(null)
  const [url, setUrl] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!dialog.current.open) dialog.current.showModal()
  }, [])

  useEffect(() => {
    let current = true
    getScreenshotUrl(row.paymentScreenshotPath)
      .then((found) => current && setUrl(found))
      .catch(() => current && setFailed(true))
    return () => {
      current = false
    }
  }, [row.paymentScreenshotPath])

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      aria-labelledby="proof-heading"
      className="m-auto w-[min(34rem,calc(100vw-2rem))] rounded-tile bg-white p-6 text-ink backdrop:bg-brand-deep/70 sm:p-8"
    >
      <h2 id="proof-heading" className="text-2xl font-bold text-brand">
        {row.name}
      </h2>
      <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div>
          <dt className="text-ink/65">UPI reference</dt>
          <dd className="break-all font-semibold">{row.paymentRef}</dd>
        </div>
        <div>
          <dt className="text-ink/65">Received</dt>
          <dd className="font-semibold">{received(row)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex min-h-40 items-center justify-center overflow-hidden rounded-control bg-sand">
        {url && <img src={url} alt={`Payment screenshot from ${row.name}`} className="max-h-[60vh] w-full object-contain" />}
        {!url && !failed && <p className="p-6 text-ink/65">Loading the screenshot…</p>}
        {failed && (
          <p role="alert" className="p-6 font-semibold text-[#a3261c]">
            The screenshot could not be opened. Check your connection and try again.
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <button type="button" onClick={() => dialog.current.close()} className={quietButton}>
          Close
        </button>
        {!isVerified(row) && (
          <button type="button" onClick={onVerify} className={solidButton}>
            Mark verified
          </button>
        )}
      </div>
    </dialog>
  )
}

/**
 * One event's registrations, for checking payments by hand: each UPI reference
 * is compared with the club's bank statement, then marked verified.
 */
export default function Registrations() {
  const [eventId, setEventId] = useState(() => (getOpenEvent() ?? EVENTS[0]).id)
  const [filter, setFilter] = useState('all')
  const [rows, setRows] = useState(null) // null until the first answer arrives
  const [unreadable, setUnreadable] = useState(false)
  const [problem, setProblem] = useState('')
  const [proofId, setProofId] = useState(null)

  useEffect(() => {
    setRows(null)
    setUnreadable(false)
    setProblem('')
    return watchRegistrations(eventId, setRows, () => setUnreadable(true))
  }, [eventId])

  const event = EVENTS.find((entry) => entry.id === eventId)
  const all = rows ?? []
  const verifiedCount = all.filter(isVerified).length
  const shown = all.filter((row) => filter === 'all' || (row.paymentStatus ?? PAYMENT_STATUS.pending) === filter)
  const proof = all.find((row) => row.id === proofId)

  // One payment sent in for two registrations is the thing most worth catching.
  const timesUsed = {}
  for (const row of all) {
    const key = row.paymentRef.toLowerCase()
    timesUsed[key] = (timesUsed[key] ?? 0) + 1
  }

  // The row flips at once; if the server refuses, it flips back and this says why.
  const mark = (row, status) => {
    setProblem('')
    setPaymentStatus(row.id, status).catch(() =>
      setProblem(`The change to ${row.name} was not saved. Check your connection and try again.`),
    )
  }

  const stats = [
    { label: 'Registered', value: all.length, colour: 'text-brand' },
    { label: 'Payment to check', value: all.length - verifiedCount, colour: 'text-[#8a5a00]' },
    { label: 'Verified', value: verifiedCount, colour: 'text-[#1f6b45]' },
  ]

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-ink/65">{event.title.en}</p>
          <h1 className="mt-0.5 text-5xl font-extrabold leading-[1.05] text-brand">Registrations</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <label htmlFor="admin-event" className="sr-only">
            Event
          </label>
          <select
            id="admin-event"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="h-11 max-w-full rounded-control border border-ink/40 bg-white px-3 text-sm font-medium text-ink outline-offset-2"
          >
            {EVENTS.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.title.en}
              </option>
            ))}
          </select>
          <button type="button" disabled={all.length === 0} onClick={() => exportList(event, all)} className={quietButton}>
            Export list
          </button>
        </div>
      </div>

      <dl className="mt-8 grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className={`${tile} flex flex-col-reverse justify-end px-6 py-5`}>
            <dt className="mt-1 text-sm text-ink/65">{stat.label}</dt>
            <dd className={`font-display text-[2.75rem] font-bold leading-none ${stat.colour}`}>
              {rows ? stat.value : '–'}
            </dd>
          </div>
        ))}
      </dl>

      <div role="group" aria-label="Filter by payment status" className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={filter === option.id}
            onClick={() => setFilter(option.id)}
            className={`h-11 rounded-control border px-4 text-sm font-semibold transition-colors duration-200 ${
              filter === option.id ? 'border-brand bg-brand text-white' : 'border-brand/30 text-brand hover:bg-brand/10'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {problem && (
        <p role="alert" className="mt-4 font-semibold text-[#a3261c]">
          {problem}
        </p>
      )}

      {unreadable ? (
        <p role="alert" className="mt-4 rounded-tile bg-brand/10 p-6 font-semibold text-brand-deep">
          The registrations could not be loaded. Check your connection, then reload the page.
        </p>
      ) : !rows ? (
        <p role="status" className="mt-4 rounded-tile bg-brand/10 p-6 text-brand-deep">
          Loading registrations…
        </p>
      ) : shown.length === 0 ? (
        <p className="mt-4 rounded-tile bg-brand/10 p-6 text-brand-deep">
          {FILTERS.find((option) => option.id === filter).empty}
        </p>
      ) : (
        // `relative` keeps the visually hidden column heading inside the scroller,
        // so it cannot widen the page on a phone.
        <div className={`${tile} relative mt-4 overflow-x-auto`}>
          <table className="w-full min-w-[56rem] border-collapse text-[0.9375rem]">
            <thead>
              <tr className="text-left text-[0.8125rem] text-ink/65">
                <th scope="col" className="px-5 py-4 font-semibold">Name and team</th>
                <th scope="col" className="px-5 py-4 font-semibold">Phone</th>
                <th scope="col" className="px-5 py-4 font-semibold">Category</th>
                <th scope="col" className="px-5 py-4 font-semibold">UPI reference</th>
                <th scope="col" className="px-5 py-4 font-semibold">Payment</th>
                <th scope="col" className="px-5 py-4 font-semibold">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => (
                <tr key={row.id} className="border-t border-brand/10 align-top">
                  <td className="px-5 py-4">
                    <div className="font-semibold">{row.name}</div>
                    <div className="text-[0.8125rem] text-ink/65">{row.teamName || 'No team given'}</div>
                  </td>
                  <td className="px-5 py-4">
                    <a href={`tel:+91${row.phone}`} className="whitespace-nowrap text-brand underline-offset-4 hover:underline">
                      {row.phone}
                    </a>
                  </td>
                  <td className="px-5 py-4">{categoryName(event, row.category)}</td>
                  <td className="px-5 py-4">
                    <div className="break-all">{row.paymentRef}</div>
                    {timesUsed[row.paymentRef.toLowerCase()] > 1 && (
                      <div className="text-[0.8125rem] font-semibold text-[#a3261c]">
                        Used on {timesUsed[row.paymentRef.toLowerCase()]} registrations
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setProofId(row.id)}
                      className="whitespace-nowrap text-[0.8125rem] font-semibold text-brand underline-offset-4 hover:underline"
                    >
                      View screenshot
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <PaymentTag row={row} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    {isVerified(row) ? (
                      <button type="button" onClick={() => mark(row, PAYMENT_STATUS.pending)} className={quietButton}>
                        Undo
                      </button>
                    ) : (
                      <button type="button" onClick={() => mark(row, PAYMENT_STATUS.verified)} className={solidButton}>
                        Mark verified
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-5 text-sm text-ink/65">
        Check each UPI reference against the club's bank statement before marking it verified.
      </p>

      {proof && (
        <Proof
          // A fresh dialog per registration, so one never shows another's picture.
          key={proof.id}
          row={proof}
          onVerify={() => mark(proof, PAYMENT_STATUS.verified)}
          onClose={() => setProofId(null)}
        />
      )}
    </>
  )
}
