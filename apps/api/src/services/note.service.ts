import { Prisma } from '../generated/prisma/index.js';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/app-error.js';
import type { noteCreateSchema, noteUpdateSchema } from '../schemas/note.schema.js';
import type { z } from 'zod';

type CreateNote = z.infer<typeof noteCreateSchema>;
type UpdateNote = z.infer<typeof noteUpdateSchema>;

export function listNotes(search?: string) {
  return prisma.note.findMany({
    where: search ? {
      OR: [
        { title: { contains: search } },
        { content: { contains: search } },
      ],
    } : undefined,
    orderBy: [{ pinned: 'desc' }, { updatedAt: 'desc' }],
  });
}

export async function getNote(id: string) {
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw new AppError('Note not found', 404);
  return note;
}

export function createNote(input: CreateNote) {
  return prisma.note.create({ data: input });
}

export async function updateNote(id: string, input: UpdateNote) {
  try {
    return await prisma.note.update({ where: { id }, data: input });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AppError('Note not found', 404);
    }
    throw error;
  }
}

export async function deleteNote(id: string) {
  try {
    await prisma.note.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AppError('Note not found', 404);
    }
    throw error;
  }
}
