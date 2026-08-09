# Book Tracker PWA (Vue 3 + Vite)

A modern, responsive Progressive Web App built with Vue 3 (Composition API & `<script setup>`), Pinia state management, Vue Router, Tailwind CSS v4, and `vite-plugin-pwa`.

## Features

- 📚 **Book List Home Page (`/`)**: View books in Grid or Table layout, filter by status (All, To Read, Reading, Finished), and search by title or author.
- ➕ **Add Book (`/add`)**: Validated form with title, author, reading status dropdown, interactive 5-star rating, and notes text area.
- ✏️ **Edit Book (`/edit/:id`)**: Pre-populated form to update existing book details with live state sync.
- 💾 **LocalStorage Persistence**: Books and application state automatically persist across browser reloads.
- 📊 **CSV Export**: Export your book catalog into a CSV file.
- 📱 **PWA & Offline Ready**: Service worker caching and web app manifest configured via `vite-plugin-pwa`.

## Setup & Running

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Production build & PWA bundle generation
npm run build
```
