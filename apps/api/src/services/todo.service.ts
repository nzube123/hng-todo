import { Prisma } from '../../node_modules/.prisma/client/index.js';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/app-error.js';
import type { todoCreateSchema, todoQuerySchema, todoUpdateSchema } from '../schemas/todo.schema.js';
import type { z } from 'zod';

type CreateTodo = z.infer<typeof todoCreateSchema>;
type UpdateTodo = z.infer<typeof todoUpdateSchema>;
type TodoQuery = z.infer<typeof todoQuerySchema>;

export async function listTodos(query: TodoQuery) {
  const where: Prisma.TodoWhereInput = {};
  if (query.filter === 'active') where.completed = false;
  if (query.filter === 'completed') where.completed = true;
  if (query.filter === 'high') where.priority = 'HIGH';
  if (query.search) {
    where.OR = [
      { title: { contains: query.search } },
      { description: { contains: query.search } },
    ];
  }
  const todos = await prisma.todo.findMany({ where });
  const priorityRank = { HIGH: 0, MEDIUM: 1, LOW: 2 } as const;
  return todos.sort((left, right) => {
    if (query.sort === 'oldest') return left.createdAt.getTime() - right.createdAt.getTime();
    if (query.sort === 'priority') return priorityRank[left.priority] - priorityRank[right.priority] || right.createdAt.getTime() - left.createdAt.getTime();
    if (query.sort === 'dueDate') {
      if (!left.dueDate) return right.dueDate ? 1 : 0;
      if (!right.dueDate) return -1;
      return left.dueDate.getTime() - right.dueDate.getTime();
    }
    return right.createdAt.getTime() - left.createdAt.getTime();
  });
}

export async function getTodo(id: string) {
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) throw new AppError('Todo not found', 404);
  return todo;
}

export async function createTodo(input: CreateTodo) {
  return prisma.todo.create({
    data: {
      title: input.title,
      description: input.description ?? null,
      priority: input.priority ?? 'MEDIUM',
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
    },
  });
}

export async function updateTodo(id: string, input: UpdateTodo) {
  const data: Prisma.TodoUpdateInput = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.completed !== undefined) data.completed = input.completed;
  if (input.priority !== undefined) data.priority = input.priority;
  if (input.dueDate !== undefined) data.dueDate = input.dueDate ? new Date(input.dueDate) : null;
  try {
    return await prisma.todo.update({ where: { id }, data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AppError('Todo not found', 404);
    }
    throw error;
  }
}

export async function deleteTodo(id: string) {
  try {
    await prisma.todo.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AppError('Todo not found', 404);
    }
    throw error;
  }
}
