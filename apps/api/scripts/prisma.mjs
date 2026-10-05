import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

process.env.DATABASE_URL ??= 'file:./dev.db';
const prismaCli = resolve('node_modules/prisma/build/index.js');
const result = spawnSync(process.execPath, [prismaCli, ...process.argv.slice(2)], {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
