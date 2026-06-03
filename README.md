# Paper

A Notion-like knowledge management and documentation platform built on [Frappe](https://frappeframework.com). Paper runs as a Frappe app with a Next.js frontend, giving you a rich document editor inside your existing Frappe/ERPNext workspace.

> **Status:** Active development — core UI is being built out. Not production-ready yet.

---

## What this is

Paper brings a Notion-style experience to Frappe:

- **Sidebar** — page tree with favorites, private pages, inline create (VSCode-style), drag-and-drop, ⌘K command palette
- **Document editor** — block-based editor (coming soon)
- **Topbar** — inline rename, access control (Private / Team / Public), favorites, share
- **Theming** — light / dark mode synced with Frappe's color scheme, Montserrat font
- **Frappe integration** — auth, permissions, and API calls go through your Frappe instance

---

## Requirements

- [Frappe Bench](https://github.com/frappe/bench) — v5+
- Python 3.10+
- Node.js 18+ (with npm)
- Frappe Framework v15+

---

## Setup

### 1. Get the app

```bash
cd /path/to/your/bench
bench get-app https://github.com/devlpr-nitish/paper --branch develop
bench install-app paper
```

### 2. Start the development servers

The app needs both Frappe and the Next.js dev server running:

```bash
bench start
```

This starts:
| Process | Port | What it does |
|---|---|---|
| `web` | 8005 | Frappe (serves the app, handles auth & API) |
| `nextjs` | 3000 | Next.js dev server (compiled frontend) |

### 3. Open it

```
http://localhost:8005/paper
```

> The frontend is served through Frappe's proxy. Assets are loaded directly from port 3000 in development — this is intentional so HMR works.

---

## Development

### Frontend

The Next.js app lives at `apps/paper/frontend/`.

```bash
cd apps/paper/frontend
npm install
npm run dev -- --port 3000
```

Key directories:

```
frontend/
├── app/                   # Next.js App Router pages & layout
├── components/
│   ├── sidebar/           # Sidebar, page tree, command palette
│   ├── topbar/            # Topbar with title, access, share
│   └── main-body/         # Main content area
├── types/                 # Shared TypeScript types
└── utils/                 # Static data, helpers
```

### Code quality

Install [pre-commit](https://pre-commit.com/#installation) before contributing:

```bash
cd apps/paper
pre-commit install
```

Formatters configured: `ruff`, `eslint`, `prettier`, `pyupgrade`.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Frappe v15 |
| Frontend | Next.js (App Router), Tailwind CSS v4 |
| UI primitives | Radix UI, cmdk |
| Icons | Lucide React |
| Theming | next-themes |
| Font | Montserrat |
| Language | TypeScript, Python |

---

## License

MIT

---

Built by **Nitish Kumar**  
X — [https://x.com/devlprnitish](https://x.com/devlprnitish)