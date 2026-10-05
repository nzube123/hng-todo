import { useCallback, useEffect, useState } from 'react';
import { todoService, type TodoQuery } from '../services/todo.service';
import { noteService } from '../services/note.service';
import type { Note, Todo } from '../types';

export function useWorkspace() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reload = useCallback(async (query: TodoQuery = {}, noteSearch = '') => {
    try {
      setError('');
      const [todoItems, noteItems] = await Promise.all([todoService.list(query), noteService.list(noteSearch)]);
      setTodos(todoItems);
      setNotes(noteItems);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { void reload(); }, [reload]);
  return { todos, notes, loading, error, setError, reload };
}
