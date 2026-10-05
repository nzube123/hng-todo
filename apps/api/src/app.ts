import express from 'express';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler } from './middleware/error-handler.js';
import { noteRouter } from './routes/note.routes.js';
import { todoRouter } from './routes/todo.routes.js';

export const app = express();
app.use(corsMiddleware);
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_request, response) => response.json({ success: true, data: { status: 'ok' } }));
app.use('/api/todos', todoRouter);
app.use('/api/notes', noteRouter);
app.use((_request, response) => response.status(404).json({ success: false, error: { message: 'Endpoint not found' } }));
app.use(errorHandler);
