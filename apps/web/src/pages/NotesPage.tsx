import { useEffect, useState } from 'react';
import { noteService } from '../services/note.service';
import type { Note } from '../types';
import { NoteCard } from '../components/notes/NoteCard';

type Props = { onAdd: () => void; onEdit: (note: Note) => void; onError: (message: string) => void; refresh: number };

export function NotesPage({ onAdd, onEdit, onError, refresh }: Props) {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let alive = true;
    const timer = window.setTimeout(() => {
      setLoading(true); setError('');
      void noteService.list(search).then((items) => { if (alive) setNotes(items); }).catch((caught: unknown) => { if (alive) setError(caught instanceof Error ? caught.message : 'Could not load notes.'); }).finally(() => { if (alive) setLoading(false); });
    }, 150);
    return () => { alive = false; window.clearTimeout(timer); };
  }, [search, refresh]);
  return <div className="animate-fade-in">
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">A HOME FOR YOUR THOUGHTS</p><h1 className="page-title">Your notes<span className="text-forest">.</span></h1><p className="mt-2 text-muted">Keep the good ideas close. Pin the ones you come back to.</p></div><button className="button-primary" onClick={onAdd}><span className="text-lg leading-none">＋</span> Write a note</button></div>
    <label className="search-field mb-6 block"><span aria-hidden="true">⌕</span><input aria-label="Search notes" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search titles and note content…" /></label>
    {error && <div role="alert" className="state-error">{error}</div>}
    {loading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><div className="skeleton h-56"/><div className="skeleton h-56"/><div className="skeleton h-56"/></div> : notes.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{notes.map((note) => <NoteCard key={note.id} note={note} onChanged={() => window.dispatchEvent(new Event('notes-updated'))} onEdit={onEdit} onError={onError}/>)}</div> : <div className="empty-card"><span className="empty-illustration">✎</span><h2>{search ? 'No notes found' : 'Your next good idea goes here'}</h2><p>{search ? 'Try a different title or phrase.' : 'Start a note and give that thought somewhere to land.'}</p>{!search && <button onClick={onAdd} className="button-secondary mt-4">Write your first note</button>}</div>}
  </div>;
}
