import { useEffect, useState } from 'react';
import { todoService, type TodoQuery } from '../services/todo.service';
import type { Todo } from '../types';
import { TodoCard } from '../components/todos/TodoCard';

type Props = { onAdd: () => void; onEdit: (todo: Todo) => void; onError: (message: string) => void; refresh: number };
const filters = [{ id: 'all', label: 'All tasks' }, { id: 'active', label: 'Active' }, { id: 'completed', label: 'Completed' }, { id: 'high', label: 'High priority' }] as const;

export function TasksPage({ onAdd, onEdit, onError, refresh }: Props) {
  const [query, setQuery] = useState<TodoQuery>({ filter: 'all', sort: 'newest' });
  const [search, setSearch] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  useEffect(() => {
    let alive = true;
    const timer = window.setTimeout(() => {
      setLoading(true); setLoadError('');
      void todoService.list({ ...query, search }).then((items) => { if (alive) setTodos(items); }).catch((error: unknown) => { if (alive) setLoadError(error instanceof Error ? error.message : 'Could not load tasks.'); }).finally(() => { if (alive) setLoading(false); });
    }, 150);
    return () => { alive = false; window.clearTimeout(timer); };
  }, [query, search, refresh]);
  return <div className="animate-fade-in">
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">MAKE SPACE FOR WHAT MATTERS</p><h1 className="page-title">Your tasks<span className="text-forest">.</span></h1><p className="mt-2 text-muted">A clear list makes room for clear thinking.</p></div><button className="button-primary" onClick={onAdd}><span className="text-lg leading-none">＋</span> Add a task</button></div>
    <div className="mb-6 flex flex-col gap-4"><div className="flex flex-wrap gap-2" role="group" aria-label="Filter tasks">{filters.map((filter) => <button key={filter.id} onClick={() => setQuery((current) => ({ ...current, filter: filter.id }))} aria-pressed={query.filter === filter.id} className={`filter-pill ${query.filter === filter.id ? 'filter-pill-active' : ''}`}>{filter.label}</button>)}</div>
      <div className="flex flex-col gap-3 sm:flex-row"><label className="search-field flex-1"><span aria-hidden="true">⌕</span><input aria-label="Search tasks" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your tasks…" /></label><label className="sr-only" htmlFor="todo-sort">Sort tasks</label><select id="todo-sort" value={query.sort} onChange={(event) => setQuery((current) => ({ ...current, sort: event.target.value as TodoQuery['sort'] }))} className="field sm:w-48"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="priority">Priority</option><option value="dueDate">Due date</option></select></div>
    </div>
    {loadError && <div role="alert" className="state-error">{loadError}</div>}
    {loading ? <div className="space-y-3" aria-label="Loading tasks"><div className="skeleton h-28"/><div className="skeleton h-28"/><div className="skeleton h-28"/></div> : todos.length ? <div className="space-y-3">{todos.map((todo) => <TodoCard key={todo.id} todo={todo} onChanged={() => window.dispatchEvent(new Event('todo-updated'))} onEdit={onEdit} onError={onError} />)}</div> : <div className="empty-card"><span className="empty-illustration">✓</span><h2>{search ? 'Nothing matches that search' : query.filter === 'completed' ? 'No completed tasks yet' : 'You’re all caught up'}</h2><p>{search ? 'Try another keyword and we’ll look again.' : 'Add a task whenever something needs your attention.'}</p>{!search && query.filter === 'all' && <button onClick={onAdd} className="button-secondary mt-4">Add your first task</button>}</div>}
  </div>;
}
