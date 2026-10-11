import { useState } from 'react'
import { COLLECTIONS } from '../../data/schema.js'
import { removeEntry, removePicture, saveEntry, uploadPicture } from '../../lib/admin.js'
import {
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

function AwardSheet({ award, onClose }) {
  const [form, setForm] = useState({
    title: { en: '', ml: '', ...award?.title },
    description: { en: '', ml: '', ...award?.description },
    year: award?.year ?? '',
    imageUrl: award?.imageUrl ?? '',
    imagePath: award?.imagePath ?? '',
  })
  const [file, setFile] = useState(null)
  const set = (field) => (value) => setForm((f) => ({ ...f, [field]: value }))

  const save = async () => {
    const title = { en: form.title.en.trim(), ml: form.title.ml.trim() }
    if (!title.en) throw officerError('Give the award a title in English.')
    if (!/^\d{4}$/.test(form.year)) throw officerError('Give the year as four digits, for example 2024.')

    let { imageUrl, imagePath } = form
    if (file) ({ url: imageUrl, path: imagePath } = await uploadPicture('awards', file))

    await saveEntry(
      COLLECTIONS.awards,
      award?.id ?? null,
      {
        title,
        description: { en: form.description.en.trim(), ml: form.description.ml.trim() },
        year: form.year,
        imageUrl,
        imagePath,
        sample: false,
      },
      !award,
    )
    if (award?.imagePath && award.imagePath !== imagePath) removePicture(award.imagePath)
  }

  return (
    <Sheet title={award ? 'Edit award' : 'New award'} onSave={save} onClose={onClose}>
      <PairField label="Title" value={form.title} onChange={set('title')} />
      <Field label="Year" className="max-w-40">
        {(id) => (
          <input id={id} type="text" inputMode="numeric" maxLength={4} value={form.year} onChange={(e) => set('year')(e.target.value)} className={inputClass} />
        )}
      </Field>
      <PairField label="What it was for" value={form.description} onChange={set('description')} multiline />
      <PictureField
        label="Photo"
        hint="Optional. Without one the award shows the club's crest."
        current={form.imageUrl || null}
        file={file}
        onPick={setFile}
        onClear={() => {
          setFile(null)
          setForm((f) => ({ ...f, imageUrl: '', imagePath: '' }))
        }}
      />
    </Sheet>
  )
}

/** The club's honours, shown on the awards page newest first. */
export default function Awards() {
  const { rows, unreadable } = useList(COLLECTIONS.awards)
  const [editing, setEditing] = useState(null) // an award, or 'new'
  const [problem, setProblem] = useState('')

  const remove = async (award) => {
    setProblem('')
    try {
      await removeEntry(COLLECTIONS.awards, award.id)
      removePicture(award.imagePath)
    } catch {
      setProblem(`${award.title.en} was not deleted. Check your connection and try again.`)
    }
  }

  const awards = rows ? [...rows].sort((a, b) => String(b.year).localeCompare(String(a.year))) : null

  return (
    <>
      <ScreenHead title="Awards" about="The club's honours. The site lists them newest first.">
        <button type="button" onClick={() => setEditing('new')} className={solidButton}>
          New award
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
            <p className="font-semibold">No awards have been added yet.</p>
            <p className="mt-1.5">Until the first one is, the awards page shows sample entries in their place.</p>
          </>
        }
      />

      {awards?.length > 0 && (
        <ul className="mt-8 flex flex-col gap-3">
          {awards.map((award) => (
            <li key={award.id} className={`${tile} flex flex-wrap items-center gap-x-5 gap-y-4 p-4 sm:p-5`}>
              {award.imageUrl && <img src={award.imageUrl} alt="" className="h-20 w-28 flex-none rounded-control object-cover" />}
              <p className="w-16 flex-none font-display text-2xl font-bold text-brand/50">{award.year}</p>
              <div className="min-w-0 flex-1 basis-64">
                <h2 className="text-xl font-bold text-brand">{award.title.en}</h2>
                {award.description?.en && <p className="mt-0.5 text-sm text-ink/70">{award.description.en}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setEditing(award)} className={quietButton}>
                  Edit
                </button>
                <DeleteButton onDelete={() => remove(award)} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <AwardSheet key={editing.id ?? 'new'} award={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />
      )}
    </>
  )
}
