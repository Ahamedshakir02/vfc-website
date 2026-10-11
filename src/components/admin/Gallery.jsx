import { useRef, useState } from 'react'
import { COLLECTIONS, CONTENT_CATEGORIES } from '../../data/schema.js'
import { removeEntry, removePicture, saveEntry, uploadPicture } from '../../lib/admin.js'
import {
  CATEGORY_NAMES,
  DeleteButton,
  Field,
  ListState,
  PairField,
  ScreenHead,
  Sheet,
  inputClass,
  quietButton,
  solidButton,
  tile,
  useList,
} from './ui.jsx'

function PhotoSheet({ photo, onClose }) {
  const [caption, setCaption] = useState({ en: '', ml: '', ...photo.caption })
  const [category, setCategory] = useState(photo.category)

  const save = () =>
    saveEntry(COLLECTIONS.gallery, photo.id, {
      caption: { en: caption.en.trim(), ml: caption.ml.trim() },
      category,
    })

  return (
    <Sheet title="Edit photo" onSave={save} onClose={onClose}>
      <img src={photo.imageUrl} alt="" className="max-h-64 w-full rounded-control bg-sand object-contain" />
      <PairField label="Caption" value={caption} onChange={setCaption} />
      <Field label="Kind" hint="Shown on the photo when it has no caption.">
        {(id) => (
          <select id={id} value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            {CONTENT_CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {CATEGORY_NAMES[option]}
              </option>
            ))}
          </select>
        )}
      </Field>
    </Sheet>
  )
}

/** The gallery: add photos several at a time, then caption or remove them. */
export default function Gallery() {
  const { rows, unreadable } = useList(COLLECTIONS.gallery)
  const [editing, setEditing] = useState(null)
  const [progress, setProgress] = useState(null) // { done, total } while photos upload
  const [problem, setProblem] = useState('')
  const picker = useRef(null)

  const add = async (files) => {
    setProblem('')
    let failed = 0
    for (const [i, file] of files.entries()) {
      setProgress({ done: i, total: files.length })
      try {
        const { url, path } = await uploadPicture('gallery', file)
        await saveEntry(
          COLLECTIONS.gallery,
          null,
          { imageUrl: url, imagePath: path, caption: { en: '', ml: '' }, category: CONTENT_CATEGORIES[0], sample: false },
          true,
        )
      } catch {
        failed += 1
      }
    }
    setProgress(null)
    if (failed) {
      setProblem(
        `${failed} of ${files.length} photos could not be added. Check that they are images, and your connection, then try those again.`,
      )
    }
  }

  const remove = async (photo) => {
    setProblem('')
    try {
      await removeEntry(COLLECTIONS.gallery, photo.id)
      removePicture(photo.imagePath)
    } catch {
      setProblem('The photo was not deleted. Check your connection and try again.')
    }
  }

  // Newest first, as the site shows them.
  const photos = rows ? [...rows].reverse() : null

  return (
    <>
      <ScreenHead title="Gallery" about="Photos from the club's events. The newest is shown first.">
        <input
          ref={picker}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          aria-label="Choose photos to add"
          tabIndex={-1}
          onChange={(e) => {
            const files = [...e.target.files]
            e.target.value = ''
            if (files.length) add(files)
          }}
        />
        <button type="button" disabled={Boolean(progress)} onClick={() => picker.current.click()} className={solidButton}>
          {progress ? `Adding ${progress.done + 1} of ${progress.total}…` : 'Add photos'}
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
            <p className="font-semibold">No photos have been added yet.</p>
            <p className="mt-1.5">
              Until the first one is, the gallery shows drawings in their place. Large photos are made smaller as they
              are added, so they load quickly on a phone.
            </p>
          </>
        }
      />

      {photos?.length > 0 && (
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <li key={photo.id} className={`${tile} flex flex-col overflow-hidden`}>
              <img src={photo.imageUrl} alt={photo.caption?.en ?? ''} loading="lazy" className="aspect-[4/3] w-full bg-sand object-cover" />
              <div className="flex flex-1 flex-col gap-3 p-3.5">
                <p className="text-sm">
                  {photo.caption?.en || <span className="text-ink/55">No caption</span>}
                  <span className="block text-[0.8125rem] text-ink/65">{CATEGORY_NAMES[photo.category]}</span>
                </p>
                <div className="mt-auto flex flex-wrap gap-2">
                  <button type="button" onClick={() => setEditing(photo)} className={quietButton}>
                    Edit
                  </button>
                  <DeleteButton onDelete={() => remove(photo)} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && <PhotoSheet key={editing.id} photo={editing} onClose={() => setEditing(null)} />}
    </>
  )
}
