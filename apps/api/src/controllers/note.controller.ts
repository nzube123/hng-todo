import type { RequestHandler } from 'express';
import { noteCreateSchema, noteQuerySchema, noteUpdateSchema } from '../schemas/note.schema.js';
import { idSchema } from '../schemas/todo.schema.js';
import * as notes from '../services/note.service.js';

export const listNotes: RequestHandler = async (request, response) => {
  const query = noteQuerySchema.parse(request.query);
  response.json({ success: true, data: await notes.listNotes(query.search) });
};

export const getNote: RequestHandler = async (request, response) => {
  const id = idSchema.parse(request.params.id);
  response.json({ success: true, data: await notes.getNote(id) });
};

export const createNote: RequestHandler = async (request, response) => {
  const input = noteCreateSchema.parse(request.body);
  response.status(201).json({ success: true, data: await notes.createNote(input) });
};

export const updateNote: RequestHandler = async (request, response) => {
  const id = idSchema.parse(request.params.id);
  const input = noteUpdateSchema.parse(request.body);
  response.json({ success: true, data: await notes.updateNote(id, input) });
};

export const deleteNote: RequestHandler = async (request, response) => {
  const id = idSchema.parse(request.params.id);
  await notes.deleteNote(id);
  response.json({ success: true, data: { id } });
};
