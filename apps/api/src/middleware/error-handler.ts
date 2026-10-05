import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '../../node_modules/.prisma/client/index.js';
import { AppError } from '../lib/app-error.js';

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({ success: false, error: { message: error.issues[0]?.message ?? 'Invalid request' } });
    return;
  }
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ success: false, error: { message: error.message } });
    return;
  }
  if (error instanceof SyntaxError && 'status' in error && error.status === 400) {
    response.status(400).json({ success: false, error: { message: 'Request body must contain valid JSON' } });
    return;
  }
  if (typeof error === 'object' && error !== null && 'type' in error && error.type === 'entity.too.large') {
    response.status(413).json({ success: false, error: { message: 'Request body is too large' } });
    return;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    response.status(404).json({ success: false, error: { message: 'The requested item was not found' } });
    return;
  }
  console.error('Unhandled API error', error instanceof Error ? error.message : 'Unknown error');
  response.status(500).json({ success: false, error: { message: 'Something went wrong. Please try again.' } });
};
