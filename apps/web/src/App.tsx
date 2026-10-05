import { useEffect, useState } from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { NotesPage } from './pages/NotesPage';
import { TodoEditor } from './components/todos/TodoEditor';
import { NoteEditor } from './components/notes/NoteEditor';
import { useWorkspace } from './hooks/useWorkspace';
import { useTheme } from './hooks/useTheme';
import type { Note, Todo } from './types';

type Page = 'dashboard' | 'tasks' | 'notes';
const navItems: { id: Page; icon: string; label: string }[] = [{ id: 'dashboard', icon: '⌂', label: 'Dashboard' }, { id: 'tasks', icon: '✓', label: 'Tasks' }, { id: 'notes', icon: '▤', label: 'Notes' }];

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [todoEditor, setTodoEditor] = useState<Todo | null | undefined>(undefined);
  const [noteEditor, setNoteEditor] = useState<Note | null | undefined>(undefined);
  const [refresh, setRefresh] = useState(0);
  const [notice, setNotice] = useState('');
  const { theme, toggleTheme } = useTheme();
  const workspace = useWorkspace();
  useEffect(() => {
    const refreshData = () => { setRefresh((value) => value + 1); void workspace.reload(); };
    window.addEventListener('todo-updated', refreshData);
    window.addEventListener('notes-updated', refreshData);
    return () => { window.removeEventListener('todo-updated', refreshData); window.removeEventListener('notes-updated', refreshData); };
  }, [workspace.reload]);
  useEffect(() => { if (!notice) return; const timeout = window.setTimeout(() => setNotice(''), 3200); return () => window.clearTimeout(timeout); }, [notice]);
  const saved = () => { setRefresh((value) => value + 1); void workspace.reload(); setNotice('Saved — all set.'); };
  const pageTitle = page === 'dashboard' ? 'A little more in focus' : page === 'tasks' ? 'Your tasks' : 'Your notes';
  return <div className="min-h-screen bg-canvas text-ink lg:flex">
    <aside className="z-20 flex w-full shrink-0 flex-col border-b border-stone-200/80 bg-white px-5 py-4 lg:fixed lg:inset-y-0 lg:w-64 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
      <a href="#dashboard" onClick={(event) => { event.preventDefault(); setPage('dashboard'); }} className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-forest font-display text-xl font-semibold text-white">d</span><span><span className="block font-display text-lg font-semibold tracking-tight">daymark</span><span className="block text-[11px] tracking-wide text-muted">A LITTLE MORE IN FOCUS</span></span></a>
      <p className="mb-3 mt-8 hidden px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-stone-400 lg:block">WORKSPACE</p>
      <nav aria-label="Main navigation" className="mt-5 flex gap-2 overflow-x-auto lg:mt-0 lg:flex-col">{navItems.map((item) => <button key={item.id} onClick={() => setPage(item.id)} aria-current={page === item.id ? 'page' : undefined} className={`nav-link ${page === item.id ? 'nav-link-active' : ''}`}><span className="grid h-7 w-7 place-items-center rounded-lg text-base">{item.icon}</span>{item.label}{item.id === 'tasks' && workspace.todos.filter((todo) => !todo.completed).length > 0 && <span className="ml-auto hidden rounded-full bg-white/70 px-2 py-0.5 text-xs text-muted lg:block">{workspace.todos.filter((todo) => !todo.completed).length}</span>}</button>)}</nav>
      <div className="mt-auto hidden rounded-2xl bg-[#f5f7f4] p-4 dark:bg-[#202d26] lg:block"><span className="text-lg">✳</span><p className="mt-2 text-sm font-medium">A gentle reminder</p><p className="mt-1 text-xs leading-relaxed text-muted">You don’t have to do it all today. Just the next thing.</p></div>
      <div className="mt-4 hidden items-center gap-3 border-t border-stone-100 pt-5 lg:flex"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#eee8df] font-display font-semibold text-[#806954] dark:bg-[#3a332d] dark:text-[#dac4aa]">Y</span><span><span className="block text-sm font-medium">Your space</span><span className="block text-xs text-muted">Just for you</span></span></div>
    </aside>
    <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:ml-64 lg:px-12 lg:py-10 xl:px-16"><div className="mx-auto max-w-5xl"><header className="mb-7 flex items-center justify-between border-b border-stone-200/70 pb-4"><p className="text-sm font-medium text-muted">{pageTitle}</p><div className="flex items-center gap-2"><div className="hidden items-center gap-2 rounded-full border border-stone-200/80 bg-white px-3 py-1.5 text-xs text-muted sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-500"/> Your day, at your pace</div><button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} className="grid h-10 w-10 place-items-center rounded-xl border border-stone-200 bg-white text-lg text-ink transition hover:bg-canvas">{theme === 'light' ? '☾' : '☼'}</button></div></header>
      {workspace.error && <div role="alert" className="state-error mb-5">{workspace.error}<button className="ml-3 font-medium underline" onClick={() => void workspace.reload()}>Try again</button></div>}
      {page === 'dashboard' && <DashboardPage todos={workspace.todos} notes={workspace.notes} loading={workspace.loading} onTasks={() => setPage('tasks')} onNotes={() => setPage('notes')} />}
      {page === 'tasks' && <TasksPage onAdd={() => setTodoEditor(null)} onEdit={setTodoEditor} onError={setNotice} refresh={refresh} />}
      {page === 'notes' && <NotesPage onAdd={() => setNoteEditor(null)} onEdit={setNoteEditor} onError={setNotice} refresh={refresh} />}
      </div></main>
    {todoEditor !== undefined && <TodoEditor todo={todoEditor} onClose={() => setTodoEditor(undefined)} onSaved={saved} onError={setNotice} />}
    {noteEditor !== undefined && <NoteEditor note={noteEditor} onClose={() => setNoteEditor(undefined)} onSaved={saved} onError={setNotice} />}
    {notice && <div role="status" className="fixed bottom-5 right-5 z-[60] rounded-xl bg-ink px-5 py-3 text-sm font-medium text-white shadow-xl">{notice}</div>}
  </div>;
}
