import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EVENTS } from '../../data/events.js'
import { ILLUSTRATIONS } from '../../data/illustrations.js'
import { COLLECTIONS, CONTENT_CATEGORIES, EVENT_STATUS } from '../../data/schema.js'
import { removeEntry, removePicture, saveEntry, uploadPicture } from '../../lib/admin.js'
import { eventImage, formatDate, formatFee } from '../../lib/format.js'
import {
  CATEGORY_NAMES,
  DeleteButton,
  Field,
  ListState,
  PairField,
  PictureField,
  ScreenHead,
  Sheet,
  inputClass,
  officerError,
  quietButton,
  solidButton,
  tile,
  useList,
} from './ui.jsx'

const STATUS = [
  { id: EVENT_STATUS.upcoming, name: 'Coming up', about: 'Listed on the site. Nobody can register yet.' },
  { id: EVENT_STATUS.open, name: 'Registration open', about: 'Shown first, with the registration form.' },
  { id: EVENT_STATUS.closed, name: 'Finished', about: 'Listed under past events.' },
]
const statusName = (id) => STATUS.find((status) => status.id === id)?.name ?? id

const OPEN_CATEGORY = { id: 'open', label: { en: 'Open', ml: 'ഓപ്പൺ' } }

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Entry categories are typed one to a line, "English | Malayalam". */
const categoriesToText = (categories = []) =>
  categories.map(({ label }) => (label.ml ? `${label.en} | ${label.ml}` : label.en)).join('\n')

function textToCategories(text, before = []) {
  const found = text
    .split('\n')
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter(([en]) => en)
    .map(([en, ml = '']) => ({
      // A category people have already registered under keeps its id when it is reworded only in Malayalam.
      id: before.find((category) => category.label.en === en)?.id ?? (slug(en) || 'category'),
      label: { en, ml },
    }))
  return found.length ? found : [OPEN_CATEGORY]
}

const toForm = (event) => ({
  title: { en: '', ml: '', ...event?.title },
  description: { en: '', ml: '', ...event?.description },
  category: event?.category ?? CONTENT_CATEGORIES[0],
  status: event?.status ?? EVENT_STATUS.upcoming,
  startsOn: event?.startsOn ?? '',
  closesOn: event?.closesOn ?? '',
  venue: event?.venue ?? '',
  fee: event?.fee ?? '',
  categoriesText: categoriesToText(event?.categories ?? [OPEN_CATEGORY]),
  image: event?.image ?? 'athlete',
  coverUrl: event?.coverUrl ?? '',
  coverPath: event?.coverPath ?? '',
})

function EventSheet({ event, takenIds, onClose }) {
  const [form, setForm] = useState(() => toForm(event))
  const [file, setFile] = useState(null)
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e?.target ? e.target.value : e }))

  const save = async () => {
    const title = { en: form.title.en.trim(), ml: form.title.ml.trim() }
    if (!title.en) throw officerError('Give the event a title in English.')
    const fee = form.fee === '' ? null : Number(form.fee)
    if (fee !== null && (!Number.isInteger(fee) || fee <= 0)) {
      throw officerError('The entry fee must be a whole number of rupees, or left empty.')
    }

    let { coverUrl, coverPath } = form
    if (file) ({ url: coverUrl, path: coverPath } = await uploadPicture('events', file))

    let id = event?.id
    if (!id) {
      // The id is the page's address (/events/<id>), so make it readable and unique.
      const base = slug(title.en) || 'event'
      id = base
      for (let n = 2; takenIds.includes(id); n += 1) id = `${base}-${n}`
    }

    await saveEntry(
      COLLECTIONS.events,
      id,
      {
        title,
        description: { en: form.description.en.trim(), ml: form.description.ml.trim() },
        category: form.category,
        status: form.status,
        startsOn: form.startsOn || null,
        closesOn: form.closesOn || null,
        venue: form.venue.trim() || null,
        fee,
        categories: textToCategories(form.categoriesText, event?.categories),
        image: form.image,
        coverUrl,
        coverPath,
        // Saved by an officer, so no longer placeholder content.
        sample: false,
        sampleFields: [],
      },
      !event,
    )
    // The picture it replaced, or the one that was removed, is no longer used by anything.
    if (event?.coverPath && event.coverPath !== coverPath) removePicture(event.coverPath)
  }

  return (
    <Sheet title={event ? 'Edit event' : 'New event'} onSave={save} onClose={onClose}>
      <PairField label="Title" value={form.title} onChange={set('title')} />
      <PairField label="About the event" value={form.description} onChange={set('description')} multiline />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kind of event">
          {(id) => (
            <select id={id} value={form.category} onChange={set('category')} className={inputClass}>
              {CONTENT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {CATEGORY_NAMES[category]}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label="Status" hint={STATUS.find((status) => status.id === form.status).about}>
          {(id) => (
            <select id={id} value={form.status} onChange={set('status')} className={inputClass}>
              {STATUS.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label="Starts on" hint="Leave empty to show “To be announced”.">
          {(id) => <input id={id} type="date" value={form.startsOn} onChange={set('startsOn')} className={inputClass} />}
        </Field>
        <Field label="Registration closes on">
          {(id) => <input id={id} type="date" value={form.closesOn} onChange={set('closesOn')} className={inputClass} />}
        </Field>
        <Field label="Venue">
          {(id) => <input id={id} type="text" value={form.venue} onChange={set('venue')} className={inputClass} />}
        </Field>
        <Field label="Entry fee, in rupees" hint="Registration stays switched off on the site until there is a fee.">
          {(id) => (
            <input id={id} type="number" inputMode="numeric" min="1" step="1" value={form.fee} onChange={set('fee')} className={inputClass} />
          )}
        </Field>
      </div>

      <Field
        label="Entry categories"
        hint="What someone registering chooses between. One to a line; add the Malayalam after a | if you have it. For example: Under 17 | 17 വയസ്സിൽ താഴെ"
      >
        {(id) => (
          <textarea id={id} rows={3} value={form.categoriesText} onChange={set('categoriesText')} className={inputClass} />
        )}
      </Field>

      <PictureField
        label="Picture"
        hint="A photo from your device. Without one, the drawing chosen below is used."
        current={form.coverUrl || null}
        file={file}
        onPick={setFile}
        onClear={() => {
          setFile(null)
          setForm((f) => ({ ...f, coverUrl: '', coverPath: '' }))
        }}
      />
      {!file && !form.coverUrl && (
        <Field label="Drawing">
          {(id) => (
            <div className="flex items-center gap-4">
              <img src={ILLUSTRATIONS[form.image]} alt="" className="h-24 w-32 flex-none rounded-control object-cover" />
              <select id={id} value={form.image} onChange={set('image')} className={inputClass}>
                {Object.keys(ILLUSTRATIONS).map((name) => (
                  <option key={name} value={name}>
                    {name[0].toUpperCase() + name.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </Field>
      )}
    </Sheet>
  )
}

/** Events: what is listed on the site, which one is taking registrations, and for how much. */
export default function Events() {
  const { rows, unreadable } = useList(COLLECTIONS.events)
  const [editing, setEditing] = useState(null) // an event, or 'new'
  const [problem, setProblem] = useState('')
  const [copying, setCopying] = useState(false)

  const copyBuiltIn = async () => {
    setCopying(true)
    setProblem('')
    try {
      for (const { id, ...event } of EVENTS) await saveEntry(COLLECTIONS.events, id, event, true)
    } catch {
      setProblem('The events could not be copied. Check your connection and try again.')
    }
    setCopying(false)
  }

  const remove = async (event) => {
    setProblem('')
    try {
      await removeEntry(COLLECTIONS.events, event.id)
      removePicture(event.coverPath)
    } catch {
      setProblem(`${event.title.en} was not deleted. Check your connection and try again.`)
    }
  }

  return (
    <>
      <ScreenHead title="Events" about="What the site lists, which event is taking registrations, and the entry fee.">
        <button type="button" onClick={() => setEditing('new')} className={solidButton}>
          New event
        </button>
      </ScreenHead>

      {problem && (
        <p role="alert" className="mt-4 font-semibold text-[#a3261c]">
          {problem}
        </p>
      )}

      <ListState
        rows={rows}
        unreadable={unreadable}
        empty={
          <>
            <p className="font-semibold">No events have been saved here yet.</p>
            <p className="mt-1.5">
              Until one is, the site shows the {EVENTS.length} events it was built with, some of them samples. Copy
              them here to edit them, or start fresh with a new event. Once anything is saved here, only what is on
              this screen is shown.
            </p>
            <button type="button" disabled={copying} onClick={copyBuiltIn} className={`${solidButton} mt-4`}>
              {copying ? 'Copying…' : 'Copy the built-in events here'}
            </button>
          </>
        }
      />

      {rows?.length > 0 && (
        <ul className="mt-8 flex flex-col gap-3">
          {rows.map((event) => (
            <li key={event.id} className={`${tile} flex flex-wrap items-center gap-x-5 gap-y-4 p-4 sm:p-5`}>
              <img src={eventImage(event)} alt="" className="h-20 w-28 flex-none rounded-control object-cover" />
              <div className="min-w-0 flex-1 basis-64">
                <h2 className="text-xl font-bold text-brand">{event.title.en}</h2>
                <p className="mt-0.5 text-sm text-ink/70">
                  {statusName(event.status)} · {formatDate(event.startsOn) ?? 'Date to be announced'} ·{' '}
                  {formatFee(event.fee) ?? 'No fee set'}
                  {event.sample && ' · Sample'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/events/${event.id}`} className={quietButton}>
                  View
                </Link>
                <button type="button" onClick={() => setEditing(event)} className={quietButton}>
                  Edit
                </button>
                <DeleteButton onDelete={() => remove(event)} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {rows?.length > 0 && (
        <p className="mt-5 text-sm text-ink/65">
          Deleting an event leaves its registrations stored, but they are no longer listed. To keep them in view, mark
          the event finished instead.
        </p>
      )}

      {editing && (
        <EventSheet
          key={editing.id ?? 'new'}
          event={editing === 'new' ? null : editing}
          takenIds={(rows ?? []).map((event) => event.id)}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  )
}
