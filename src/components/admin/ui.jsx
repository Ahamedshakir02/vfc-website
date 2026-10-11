/** The pieces the admin screens share: the look of a tile and a button, form fields, the edit sheet. */
import { useEffect, useId, useRef, useState } from 'react'
import { watchList } from '../../lib/admin.js'

export const tile = 'rounded-tile border border-brand/15 bg-white'
export const quietButton =
  'inline-flex h-11 items-center justify-center whitespace-nowrap rounded-control border border-brand/35 px-4 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:border-ink/20 disabled:text-ink/45 disabled:hover:bg-transparent'
export const solidButton =
  'inline-flex h-11 items-center justify-center whitespace-nowrap rounded-control bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/55'
export const inputClass =
  'min-h-11 w-full rounded-control border border-ink/40 bg-white px-3 py-2 text-[0.9375rem] text-ink outline-offset-2'
export const alertClass = 'font-semibold text-[#a3261c]'
export const noticeClass = 'rounded-tile bg-brand/10 p-6 text-brand-deep'

export const CATEGORY_NAMES = { sports: 'Sports', arts: 'Arts', welfare: 'Welfare' }

/** The title of a screen, what it is for, and its main button. */
export function ScreenHead({ title, about, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-extrabold leading-[1.05] text-brand">{title}</h1>
        {about && <p className="mt-2 text-ink/70">{about}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  )
}

/** A label over its control, with an optional line of help. `children` receives the id to use. */
export function Field({ label, hint, className = '', children }) {
  const id = useId()

  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children(id)}
      {hint && <p className="text-[0.8125rem] text-ink/65">{hint}</p>}
    </div>
  )
}

/**
 * One piece of text in both languages. Malayalam may be left empty, and the
 * site then shows the English to everyone.
 */
export function PairField({ label, value, onChange, multiline = false }) {
  const Control = multiline ? 'textarea' : 'input'
  const extra = multiline ? { rows: 3 } : { type: 'text' }

  return (
    <fieldset className="grid min-w-0 gap-3 sm:grid-cols-2">
      <legend className="sr-only">{label}</legend>
      <Field label={`${label} (English)`}>
        {(id) => (
          <Control id={id} {...extra} value={value.en ?? ''} onChange={(e) => onChange({ ...value, en: e.target.value })} className={inputClass} />
        )}
      </Field>
      <Field label={`${label} (Malayalam)`}>
        {(id) => (
          <Control id={id} {...extra} lang="ml" value={value.ml ?? ''} onChange={(e) => onChange({ ...value, ml: e.target.value })} className={inputClass} />
        )}
      </Field>
    </fieldset>
  )
}

/**
 * Chooses a picture from the device and shows what is chosen. `current` is
 * what the site shows now; `file` is a new choice not yet saved.
 */
export function PictureField({ label, hint, current, file, onPick, onClear }) {
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return undefined
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const shown = preview ?? current

  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <div className="flex flex-wrap items-center gap-4">
          {shown && <img src={shown} alt="" className="h-24 w-32 flex-none rounded-control object-cover" />}
          <div className="flex min-w-0 flex-1 basis-56 flex-col items-start gap-2">
            <input
              id={id}
              type="file"
              accept="image/*"
              // Cleared after each choice, so picking the same file again still registers.
              onChange={(e) => {
                if (e.target.files?.[0]) onPick(e.target.files[0])
                e.target.value = ''
              }}
              className="w-full rounded-control border border-dashed border-ink/40 bg-white p-2.5 text-sm text-ink/80 outline-offset-2"
            />
            {onClear && shown && (
              <button type="button" onClick={onClear} className="text-sm font-semibold text-brand underline-offset-4 hover:underline">
                Remove this picture
              </button>
            )}
          </div>
        </div>
      )}
    </Field>
  )
}

/**
 * The form an entry is edited in, over the list it came from. `onSave` may
 * reject with an Error whose message is shown to the officer; anything else
 * that goes wrong is reported as a failed save.
 */
export function Sheet({ title, onSave, onClose, saveLabel = 'Save', children }) {
  const dialog = useRef(null)
  const [saving, setSaving] = useState(false)
  const [problem, setProblem] = useState('')

  useEffect(() => {
    if (!dialog.current.open) dialog.current.showModal()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    setProblem('')
    try {
      await onSave()
      dialog.current.close()
    } catch (error) {
      setProblem(error.isForOfficer ? error.message : 'This was not saved. Check your connection and try again.')
      setSaving(false)
    }
  }

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      aria-labelledby="sheet-heading"
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(44rem,calc(100vw-2rem))] overflow-y-auto rounded-tile bg-white p-6 text-ink backdrop:bg-brand-deep/70 sm:p-8"
    >
      <form noValidate onSubmit={submit} className="flex flex-col gap-5">
        <h2 id="sheet-heading" className="text-3xl font-bold text-brand">
          {title}
        </h2>
        {children}
        {problem && (
          <p role="alert" className={alertClass}>
            {problem}
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-2 border-t border-brand/10 pt-5">
          <button type="button" onClick={() => dialog.current.close()} className={quietButton}>
            Cancel
          </button>
          <button type="submit" disabled={saving} className={solidButton}>
            {saving ? 'Saving…' : saveLabel}
          </button>
        </div>
      </form>
    </dialog>
  )
}

/** A mistake the officer can put right, worded for them. */
export function officerError(message) {
  const error = new Error(message)
  error.isForOfficer = true
  return error
}

/** Deleting cannot be undone, so the button asks once more before it does it. */
export function DeleteButton({ onDelete, label = 'Delete' }) {
  const [armed, setArmed] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!armed) return undefined
    const disarm = setTimeout(() => setArmed(false), 4000)
    return () => clearTimeout(disarm)
  }, [armed])

  const press = async () => {
    if (!armed) {
      setArmed(true)
      return
    }
    setBusy(true)
    try {
      await onDelete()
    } finally {
      setBusy(false)
      setArmed(false)
    }
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={press}
      className={
        armed
          ? 'inline-flex h-11 items-center justify-center whitespace-nowrap rounded-control bg-[#a3261c] px-4 text-sm font-semibold text-white'
          : 'inline-flex h-11 items-center justify-center whitespace-nowrap rounded-control border border-[#a3261c]/40 px-4 text-sm font-semibold text-[#a3261c] transition-colors hover:bg-[#a3261c] hover:text-white'
      }
    >
      <span aria-live="polite">{busy ? 'Deleting…' : armed ? 'Press again to delete' : label}</span>
    </button>
  )
}

/** `{ rows, unreadable }` for one collection, live. `rows` is null until the first answer. */
export function useList(name) {
  const [rows, setRows] = useState(null)
  const [unreadable, setUnreadable] = useState(false)

  useEffect(() => watchList(name, setRows, () => setUnreadable(true)), [name])

  return { rows, unreadable }
}

/** What a list screen shows while it has no rows to show. Returns null once it does. */
export function ListState({ rows, unreadable, empty }) {
  if (unreadable) {
    return (
      <p role="alert" className={`${noticeClass} mt-8 font-semibold`}>
        This could not be loaded. Check your connection, then reload the page.
      </p>
    )
  }
  if (!rows) {
    return (
      <p role="status" className={`${noticeClass} mt-8`}>
        Loading…
      </p>
    )
  }
  if (rows.length === 0) return <div className={`${noticeClass} mt-8`}>{empty}</div>
  return null
}
