# Simple currency conversion widget implemented in Deno + React (with TS)

Foreign currency converter implemented using modified [`shadcn/ui` card component](https://ui.shadcn.com/docs/components/card) as an exercise.

[✨ See WebApp demo](https://currency-conv-widget.deno.dev/)

- Frontend (Deno + Vite + React + TypeScript, tailwindCSS, shadcn/ui)
  - 👉 see [client 📁](client/README.md)

- Backend API (Deno, [Hono](https://hono.dev/) for building API)
  - 👉 see [server 📁](server/README.md)

This is an attempt to use [Deno](https://deno.com/) runtime both for building Backend & Frontend apps.

Deployment to "Deno Deploy" service is automated via GitHub Action - see: `.github/workflows/deploy.yml`
