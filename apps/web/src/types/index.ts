export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Todo = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};
export type Note = {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
};
export type TodoInput = {
  title: string;
  description?: string | null;
  priority?: Priority;
  dueDate?: string | null;
};
export type NoteInput = { title: string; content: string };
