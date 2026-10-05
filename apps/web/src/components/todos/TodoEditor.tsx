import { useState, type FormEvent } from 'react';
import { todoService } from '../../services/todo.service';
import type { Priority, Todo } from '../../types';
import { Modal } from '../ui/Modal';

type Props = { todo: Todo | null; onClose: () => void; onSaved: () => void; onError: (message: string) => void };

export function TodoEditor({ todo, onClose, onSaved, onError }: Props) {
  const [title, setTitle] = useState(todo?.title ?? '');
  const [description, setDescription] = useState(todo?.description ?? '');
  const [priority, setPriority] = useState<Priority>(todo?.priority ?? 'MEDIUM');
  const [dueDate, setDueDate] = useState(todo?.dueDate?.slice(0, 10) ?? '');
  const [saving, setSaving] = useState(false);
  const [validation, setValidation] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) { setValidation('A task title is required.'); return; }
    setSaving(true);
    try {
      const input = { title: title.trim(), description: description.trim() || null, priority, dueDate: dueDate || null };
      if (todo) await todoService.update(todo.id, input);
      else await todoService.create(input);
      onSaved();
      onClose();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Could not save task.');
    } finally { setSaving(false); }
  }

  return <Modal title={todo ? 'Edit task' : 'A new task'} onClose={onClose}>
    <form onSubmit={submit} className="space-y-5">
      <label className="field-label">Task title<input autoFocus className="field" value={title} onChange={(event) => { setTitle(event.target.value); setValidation(''); }} placeholder="What needs your attention?" maxLength={180} /></label>
      <label className="field-label">Description <span className="font-normal text-muted">(optional)</span><textarea className="field min-h-24 resize-y" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add a little context…" maxLength={2000} /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field-label">Priority<select className="field" value={priority} onChange={(event) => setPriority(event.target.value as Priority)}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></label>
        <label className="field-label">Due date<input type="date" className="field" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label>
      </div>
      {validation && <p role="alert" className="text-sm text-red-600">{validation}</p>}
      <div className="flex justify-end gap-3 pt-1"><button type="button" className="button-secondary" onClick={onClose}>Cancel</button><button disabled={saving} className="button-primary">{saving ? 'Saving…' : todo ? 'Save changes' : 'Add task'}</button></div>
    </form>
  </Modal>;
}
