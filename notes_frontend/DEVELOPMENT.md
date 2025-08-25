# Development notes

- Dev server is configured to run on port 3000 and bind to 0.0.0.0 for containerized environments.
- Start locally:
  - Install deps: pnpm install (or npm install)
  - Start dev: pnpm dev (or npm run dev)
  - Visit: http://localhost:3000

- Linting:
  - CI runs ESLint on .vue/.ts/.js files.
  - Attribute ordering matters in Vue templates (v-model, v-if, v-for, :key before native attributes like class, type, placeholder).
  - You can auto-fix many issues: npm run lint:fix

- Notes:
  - Slidev CLI is used for serving the deck; the dev script pins the host and port.
  - Vite config has strictPort and HMR settings tailored for containers.
