import { z } from 'zod';

export const noteCreateSchema = z.object({
  title: z.string().trim().min(1, 'A note title is required').max(180),
  content: z.string().trim().min(1, 'Note content is required').max(10000),
}).strict();

export const noteUpdateSchema = z.object({
  title: z.string().trim().min(1, 'A note title is required').max(180).optional(),
  content: z.string().trim().min(1, 'Note content is required').max(10000).optional(),
  pinned: z.boolean().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, 'At least one field is required');

export const noteQuerySchema = z.object({
  search: z.string().trim().max(180).optional(),
});
