import { useState, type FormEvent } from 'react';
import { noteService } from '../../services/note.service';
import type { Note } from '../../types';
import { Modal } from '../ui/Modal';

type Props = { note: Note | null; onClose: () => void; onSaved: () => void; onError: (message: string) => void };

export function NoteEditor({ note, onClose, onSaved, onError }: Props) {
  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');
  const [saving, setSaving] = useState(false);
  const [validation, setValidation] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !content.trim()) { setValidation('Add both a title and some note content.'); return; }
    setSaving(true);
    try {
      if (note) await noteService.update(note.id, { title: title.trim(), content: content.trim() });
      else await noteService.create({ title: title.trim(), content: content.trim() });
      onSaved(); onClose();
    } catch (error) { onError(error instanceof Error ? error.message : 'Could not save note.'); }
    finally { setSaving(false); }
  }
  return <Modal title={note ? 'Edit note' : 'A new note'} onClose={onClose}>
    <form onSubmit={submit} className="space-y-5">
      <label className="field-label">Note title<input autoFocus className="field" value={title} onChange={(event) => { setTitle(event.target.value); setValidation(''); }} placeholder="Give this thought a name" maxLength={180} /></label>
      <label className="field-label">Your note<textarea className="field min-h-52 resize-y" value={content} onChange={(event) => { setContent(event.target.value); setValidation(''); }} placeholder="Get it out of your head and onto the page…" maxLength={10000} /></label>
      {validation && <p role="alert" className="text-sm text-red-600">{validation}</p>}
      <div className="flex justify-end gap-3"><button type="button" className="button-secondary" onClick={onClose}>Cancel</button><button disabled={saving} className="button-primary">{saving ? 'Saving…' : note ? 'Save note' : 'Keep note'}</button></div>
    </form>
  </Modal>;
}
