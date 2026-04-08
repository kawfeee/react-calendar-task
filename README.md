# TUF Assignment

An interactive wall-calendar style React app built with Vite. The UI includes a month photo header, animated month transitions, a selectable date range, and a notes panel.

## Why these implementation choices

- React function components and hooks: Keeps stateful UI logic (month flip, date range selection, animation phases, swipe handling) predictable and easy to maintain.
- Vite: Fast local development with instant refresh and a simple production build pipeline.
- CSS-first styling: Custom layout and animations are implemented in plain CSS to keep the project lightweight and avoid dependency overhead.
- Generated calendar grid: The month view is computed to always render a 6x7 grid (42 cells), including previous/next month spillover dates for a consistent calendar layout.
- Asset auto-loading with `import.meta.glob`: Month images are discovered from `src/assets` without hardcoding import paths.
- Inclusive interactions: Supports pointer and touch swipe gestures for month navigation, plus click-to-select date ranges.

## Features

- Month header with dynamic background image.
- Smooth month transition animation (previous/next).
- Date range selection (start and end date).
- Animated range highlighting direction (forward/backward).
- Notes area for free-form text.
- Mobile-friendly swipe navigation.

## Project structure

- `src/App.jsx`: Main UI and state logic.
- `src/App.css`: Layout, visual style, and animation definitions.
- `src/main.jsx`: React app bootstrap.

## Run locally

### 1) Prerequisites

- Node.js 18+ (recommended)
- npm 9+

### 2) Install dependencies

```bash
npm install
```

### 3) Start development server

```bash
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`). Open it in your browser.

### 4) Build for production

```bash
npm run build
```

### 5) Preview production build locally

```bash
npm run preview
```

## Available scripts

- `npm run dev`: Start dev server.
- `npm run build`: Create production build in `dist/`.
- `npm run preview`: Serve the built app locally.
- `npm run lint`: Run ESLint checks.
