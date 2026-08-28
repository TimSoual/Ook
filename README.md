# BookTracker

BookTracker is a responsive, offline-ready Progressive Web App for managing a personal reading library. Track what you want to read, what you are currently reading, and what you have finished—along with ratings, notes, and reading dates.

The app is built as a client-only application: book data is stored in the browser and there is currently no backend or account synchronization. This is on purpose, it's just a simple app intended for my personal usage.

## Features

- **Library dashboard (`/`)**
  - Browse books in table or grid view
  - Filter by All, To Read, Reading, or Finished
  - Search by title or author
  - See status counts and book ratings
- **Book management**
  - Add books at `/add`
  - View book details at `/book/:id`
  - Edit or delete books at `/edit/:id`
  - Validate required title and author fields
  - Record a status, five-star rating, notes, and reading dates
- **Reading statistics (`/stats`)**
  - Total, to-read, currently-reading, and finished counts
  - Books finished this month and this year
  - Average time to finish
  - Import and export the library as CSV
- **Local-first persistence**
  - Books are saved to `localStorage` and survive page reloads
  - A small set of sample books is loaded on first use
- **PWA and offline support**
  - Installable web app manifest
  - Service-worker asset caching generated with `vite-plugin-pwa` and Workbox
  - Online/offline status shown in the application header

## Tech stack

- Vue 3 with the Composition API and `<script setup>`
- TypeScript
- Vite
- Vue Router
- Pinia
- Tailwind CSS v4
- Lucide icons
- `vite-plugin-pwa` / Workbox

## Project structure

```text
src/
├── App.vue                 # Shared layout, navigation, and online status
├── main.ts                 # Application entry point
├── router/index.ts         # Routes
├── stores/bookStore.ts     # Book state, persistence, statistics, and CSV export
├── types/book.ts           # Book and form types
├── components/             # Shared form, rating, and status components
└── views/                  # Library, detail, add, edit, and statistics pages
```

The `dist/` directory contains a generated production build and PWA assets. It should generally be regenerated with the build command rather than edited manually.

## Development

Requirements:

- Node.js and npm

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Create a production build, including TypeScript checking and PWA asset generation:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Available npm scripts:

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Run `vue-tsc` and build the production/PWA bundle |
| `npm run preview` | Serve the production build locally |

## Deploying with Netlify

This repository includes Netlify configuration in `.netlify/netlify.toml`. The configured deployment uses:

- **Build command:** `npm run build`
- **Publish directory:** `dist`

A typical Netlify deployment can be connected to the repository through the Netlify dashboard, or deployed with the Netlify CLI after authenticating:

```bash
netlify deploy
```

For a production deployment:

```bash
netlify deploy --prod
```

When configuring the site manually in Netlify, use `npm run build` as the build command and `dist` as the publish directory. No server-side functions or API configuration are currently required.

## Data and limitations

- Data is stored only in the current browser's LocalStorage.
- Clearing site data removes the saved library.
- There is no login, cloud backup, multi-device synchronization, or external book metadata lookup.
- CSV import/export is the available way to move or back up the catalog.
- There are currently no automated test scripts in `package.json`.

