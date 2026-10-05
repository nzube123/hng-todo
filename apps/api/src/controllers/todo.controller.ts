import type { RequestHandler } from 'express';
import { idSchema, todoCreateSchema, todoQuerySchema, todoUpdateSchema } from '../schemas/todo.schema.js';
import * as todos from '../services/todo.service.js';

export const listTodos: RequestHandler = async (request, response) => {
  const query = todoQuerySchema.parse(request.query);
  response.json({ success: true, data: await todos.listTodos(query) });
};

export const getTodo: RequestHandler = async (request, response) => {
  const id = idSchema.parse(request.params.id);
  response.json({ success: true, data: await todos.getTodo(id) });
};

export const createTodo: RequestHandler = async (request, response) => {
  const input = todoCreateSchema.parse(request.body);
  response.status(201).json({ success: true, data: await todos.createTodo(input) });
};

export const updateTodo: RequestHandler = async (request, response) => {
  const id = idSchema.parse(request.params.id);
  const input = todoUpdateSchema.parse(request.body);
  response.json({ success: true, data: await todos.updateTodo(id, input) });
};

export const deleteTodo: RequestHandler = async (request, response) => {
  const id = idSchema.parse(request.params.id);
  await todos.deleteTodo(id);
  response.json({ success: true, data: { id } });
};
