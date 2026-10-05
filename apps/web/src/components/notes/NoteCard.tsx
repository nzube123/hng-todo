import { noteService } from '../../services/note.service';
import type { Note } from '../../types';

type Props = { note: Note; onChanged: () => void; onEdit: (note: Note) => void; onError: (message: string) => void };

export function NoteCard({ note, onChanged, onEdit, onError }: Props) {
  async function togglePin() {
    try { await noteService.update(note.id, { pinned: !note.pinned }); onChanged(); }
    catch (error) { onError(error instanceof Error ? error.message : 'Could not update note.'); }
  }
  async function remove() {
    if (!window.confirm(`Delete “${note.title}”? This cannot be undone.`)) return;
    try { await noteService.remove(note.id); onChanged(); }
    catch (error) { onError(error instanceof Error ? error.message : 'Could not delete note.'); }
  }
  return <article className="group flex min-h-56 flex-col rounded-2xl border border-stone-200/80 bg-white p-5 transition hover:-translate-y-0.5 hover:border-forest/20 hover:shadow-card">
    <div className="flex items-start justify-between gap-3"><h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug text-ink">{note.title}</h3><button type="button" aria-label={note.pinned ? `Unpin ${note.title}` : `Pin ${note.title}`} title={note.pinned ? 'Unpin note' : 'Pin note'} onClick={() => void togglePin()} className={`shrink-0 rounded-lg p-1.5 transition ${note.pinned ? 'text-forest hover:bg-mint' : 'text-stone-400 hover:bg-canvas hover:text-forest'}`}>⌖</button></div>
    <p className="mt-3 line-clamp-5 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-muted">{note.content}</p>
    <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-3"><span className="text-xs text-muted">Updated {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span><div className="flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100"><button className="text-action" onClick={() => onEdit(note)}>Edit</button><button className="text-action text-rose-600 hover:bg-rose-50" onClick={() => void remove()}>Delete</button></div></div>
  </article>;
}
