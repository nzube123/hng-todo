import { todoService } from '../../services/todo.service';
import type { Todo } from '../../types';

type Props = { todo: Todo; onChanged: () => void; onEdit: (todo: Todo) => void; onError: (message: string) => void };
const priorityNames = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' };

export function TodoCard({ todo, onChanged, onEdit, onError }: Props) {
  async function toggle() {
    try { await todoService.update(todo.id, { completed: !todo.completed }); onChanged(); }
    catch (error) { onError(error instanceof Error ? error.message : 'Could not update task.'); }
  }
  async function remove() {
    if (!window.confirm(`Delete “${todo.title}”? This cannot be undone.`)) return;
    try { await todoService.remove(todo.id); onChanged(); }
    catch (error) { onError(error instanceof Error ? error.message : 'Could not delete task.'); }
  }
  const due = todo.dueDate ? new Date(todo.dueDate) : null;
  const overdue = due && due < new Date(new Date().toDateString()) && !todo.completed;
  return <article className={`group flex gap-4 rounded-2xl border border-stone-200/80 bg-white p-5 transition hover:border-forest/25 hover:shadow-card ${todo.completed ? 'opacity-70' : ''}`}>
    <button type="button" onClick={() => void toggle()} aria-label={todo.completed ? `Mark ${todo.title} active` : `Complete ${todo.title}`} className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${todo.completed ? 'border-forest bg-forest text-white' : 'border-stone-300 text-transparent hover:border-forest'}`}>✓</button>
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-start justify-between gap-3"><h3 className={`font-medium leading-snug text-ink ${todo.completed ? 'text-muted line-through' : ''}`}>{todo.title}</h3><span className={`priority priority-${todo.priority.toLowerCase()}`}>{priorityNames[todo.priority]}</span></div>
      {todo.description && <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-muted">{todo.description}</p>}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className={`text-xs ${overdue ? 'font-semibold text-rose-600' : 'text-muted'}`}>{due ? `${overdue ? 'Overdue · ' : 'Due '}${due.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: due.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' })}` : 'No due date'}</span>
        <div className="flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100"><button className="text-action" onClick={() => onEdit(todo)}>Edit</button><button className="text-action text-rose-600 hover:bg-rose-50" onClick={() => void remove()}>Delete</button></div>
      </div>
    </div>
  </article>;
}
