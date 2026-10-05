import { z } from 'zod';

const dueDateSchema = z.string().refine((value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return false;
  return !/^\d{4}-\d{2}-\d{2}$/.test(value) || parsed.toISOString().slice(0, 10) === value;
}, 'Enter a valid due date').nullable();

export const todoCreateSchema = z.object({
  title: z.string().trim().min(1, 'A task title is required').max(180),
  description: z.string().trim().max(2000).optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: dueDateSchema.optional(),
}).strict();

export const todoUpdateSchema = z.object({
  title: z.string().trim().min(1, 'A task title is required').max(180).optional(),
  description: z.string().trim().max(2000).optional().nullable(),
  completed: z.boolean().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: dueDateSchema.optional(),
}).strict().refine((value) => Object.keys(value).length > 0, 'At least one field is required');

export const todoQuerySchema = z.object({
  search: z.string().trim().max(180).optional(),
  filter: z.enum(['all', 'active', 'completed', 'high']).default('all'),
  sort: z.enum(['newest', 'oldest', 'priority', 'dueDate']).default('newest'),
});

export const idSchema = z.string().uuid('Invalid resource ID');
