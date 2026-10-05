import type { Note, Todo } from '../types';

type Props = { todos: Todo[]; notes: Note[]; loading: boolean; onTasks: () => void; onNotes: () => void };

export function DashboardPage({ todos, notes, loading, onTasks, onNotes }: Props) {
  const completed = todos.filter((todo) => todo.completed).length;
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();
  const recentTodos = [...todos].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  const recentNotes = notes.slice(0, 3);
  const stats = [{ label: 'Total tasks', value: todos.length, icon: '☷', tone: 'bg-[#e7f0e8] text-forest' }, { label: 'Completed', value: completed, icon: '✓', tone: 'bg-[#edf0fa] text-[#5664a4]' }, { label: 'Still to do', value: todos.length - completed, icon: '◷', tone: 'bg-[#fcf0dc] text-[#a57224]' }, { label: 'Your notes', value: notes.length, icon: '▤', tone: 'bg-[#f5eaf0] text-[#955474]' }];
  return <div className="animate-fade-in">
    <div className="mb-9 rounded-[2rem] bg-[#e8f0e8] px-6 py-8 sm:px-10 sm:py-10"><p className="eyebrow text-forest">{today}</p><h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl">A little more in focus<span className="text-forest">.</span></h1><p className="mt-3 max-w-lg leading-relaxed text-[#5e7166]">A calmer day starts with a clear mind. Here’s what’s on your plate.</p><button onClick={onTasks} className="button-primary mt-6">See my tasks <span aria-hidden="true">→</span></button><span aria-hidden="true" className="pointer-events-none absolute" /></div>
    <section aria-label="Your overview" className="mb-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <article key={stat.label} className="rounded-2xl border border-stone-200/70 bg-white p-5"><div className="flex items-center justify-between"><span className="text-sm text-muted">{stat.label}</span><span className={`grid h-9 w-9 place-items-center rounded-xl text-lg ${stat.tone}`}>{stat.icon}</span></div><p className="mt-3 font-display text-3xl font-semibold text-ink">{loading ? '—' : stat.value}</p></article>)}</section>
    <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
      <section><div className="mb-4 flex items-center justify-between"><div><p className="eyebrow">A GOOD PLACE TO START</p><h2 className="section-title">Recent tasks</h2></div><button className="text-sm font-medium text-forest hover:underline" onClick={onTasks}>All tasks <span aria-hidden="true">→</span></button></div>
        {loading ? <div className="space-y-3"><div className="skeleton h-20"/><div className="skeleton h-20"/></div> : recentTodos.length ? <div className="space-y-2">{recentTodos.map((todo) => <div key={todo.id} className="flex items-center gap-3 rounded-xl border border-stone-200/70 bg-white p-4"><span className={`grid h-5 w-5 place-items-center rounded-full border text-xs ${todo.completed ? 'border-forest bg-forest text-white' : 'border-stone-300 text-transparent'}`}>✓</span><span className={`min-w-0 flex-1 truncate text-sm font-medium ${todo.completed ? 'text-muted line-through' : 'text-ink'}`}>{todo.title}</span><span className={`priority priority-${todo.priority.toLowerCase()}`}>{todo.priority.toLowerCase()}</span></div>)}</div> : <div className="rounded-2xl border border-dashed border-stone-300 p-7 text-center text-sm text-muted">No tasks yet. Your day is a blank page.</div>}
      </section>
      <section><div className="mb-4 flex items-center justify-between"><div><p className="eyebrow">SAVED FOR LATER</p><h2 className="section-title">Recent notes</h2></div><button className="text-sm font-medium text-forest hover:underline" onClick={onNotes}>All notes <span aria-hidden="true">→</span></button></div>
        {loading ? <div className="space-y-3"><div className="skeleton h-20"/><div className="skeleton h-20"/></div> : recentNotes.length ? <div className="space-y-2">{recentNotes.map((note) => <article key={note.id} className="rounded-xl border border-stone-200/70 bg-white p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-medium text-ink">{note.title}</h3>{note.pinned && <span className="text-xs text-forest" aria-label="Pinned">⌖ pinned</span>}</div><p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{note.content}</p></article>)}</div> : <div className="rounded-2xl border border-dashed border-stone-300 p-7 text-center text-sm text-muted">Save a thought here when you’re ready.</div>}
      </section>
    </div>
  </div>;
}
