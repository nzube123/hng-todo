import { PrismaClient } from '../../node_modules/.prisma/client/index.js';

process.env.DATABASE_URL ??= 'file:./dev.db';

export const prisma = new PrismaClient();
