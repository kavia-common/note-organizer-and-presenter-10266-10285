#!/usr/bin/env node
/**
 * Lint runner to support environments that execute `node lint`.
 * Proxies to ESLint with our desired options.
 */
import { spawn } from 'node:child_process';

const args = [
  'eslint',
  '--ext', '.js,.ts,.vue',
  '--ignore-path', '.gitignore',
  '--max-warnings=50',
  '.',
];

const child = spawn('npx', args, { stdio: 'inherit', shell: true });

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
