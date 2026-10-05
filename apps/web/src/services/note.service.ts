import { request } from './api';
import type { Note, NoteInput } from '../types';

export const noteService = {
  list: (search = '') => request<Note[]>(`/api/notes${search ? `?${new URLSearchParams({ search })}` : ''}`),
  get: (id: string) => request<Note>(`/api/notes/${id}`),
  create: (input: NoteInput) => request<Note>('/api/notes', { method: 'POST', body: JSON.stringify(input) }),
  update: (id: string, input: Partial<Note>) => request<Note>(`/api/notes/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  remove: (id: string) => request<{ id: string }>(`/api/notes/${id}`, { method: 'DELETE' }),
};
