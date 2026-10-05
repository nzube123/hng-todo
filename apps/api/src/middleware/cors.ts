import cors from 'cors';

const allowedOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';

export const corsMiddleware = cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
});
