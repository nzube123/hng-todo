import { Router } from 'express';
import * as controller from '../controllers/note.controller.js';
import { validateBody } from '../middleware/validate.js';
import { noteCreateSchema, noteUpdateSchema } from '../schemas/note.schema.js';

export const noteRouter = Router();
noteRouter.get('/', controller.listNotes);
noteRouter.get('/:id', controller.getNote);
noteRouter.post('/', validateBody(noteCreateSchema), controller.createNote);
noteRouter.patch('/:id', validateBody(noteUpdateSchema), controller.updateNote);
noteRouter.delete('/:id', controller.deleteNote);
