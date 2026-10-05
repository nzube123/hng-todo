import { request } from './api';
import type { Todo, TodoInput } from '../types';

export type TodoQuery = { search?: string; filter?: 'all' | 'active' | 'completed' | 'high'; sort?: 'newest' | 'oldest' | 'priority' | 'dueDate' };
const queryString = (query: TodoQuery) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) if (value) params.set(key, value);
  return params.size ? `?${params}` : '';
};

export const todoService = {
  list: (query: TodoQuery = {}) => request<Todo[]>(`/api/todos${queryString(query)}`),
  get: (id: string) => request<Todo>(`/api/todos/${id}`),
  create: (input: TodoInput) => request<Todo>('/api/todos', { method: 'POST', body: JSON.stringify(input) }),
  update: (id: string, input: Partial<Todo>) => request<Todo>(`/api/todos/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  remove: (id: string) => request<{ id: string }>(`/api/todos/${id}`, { method: 'DELETE' }),
};
