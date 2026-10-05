import { PrismaClient } from '../generated/prisma/index.js';
import { config } from 'dotenv';
import { resolve } from 'node:path';

config({ path: resolve(process.cwd(), '../../.env') });
process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5432/todo_app?schema=public';

export const prisma = new PrismaClient();
