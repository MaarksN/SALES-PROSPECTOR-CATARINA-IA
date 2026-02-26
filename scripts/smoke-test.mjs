import { access } from 'node:fs/promises';

const requiredPaths = [
  'package.json',
  'turbo.json',
  'apps/api/package.json',
  'apps/web/package.json',
  'apps/worker/package.json',
  'libs/shared/package.json',
  '.env.example'
];

for (const path of requiredPaths) {
  await access(path);
}

console.log('Smoke test OK: estrutura principal presente.');
