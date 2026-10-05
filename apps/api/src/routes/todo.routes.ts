import { Router } from 'express';
import * as controller from '../controllers/todo.controller.js';
import { validateBody } from '../middleware/validate.js';
import { todoCreateSchema, todoUpdateSchema } from '../schemas/todo.schema.js';

export const todoRouter = Router();
todoRouter.get('/', controller.listTodos);
todoRouter.get('/:id', controller.getTodo);
todoRouter.post('/', validateBody(todoCreateSchema), controller.createTodo);
todoRouter.patch('/:id', validateBody(todoUpdateSchema), controller.updateTodo);
todoRouter.delete('/:id', controller.deleteTodo);
