# StudyBuddy — Academic Platform

A bilingual (Arabic/English) academic management web application built with **Vite + React**. Converted from a static HTML/CSS/JS prototype to a modern React SPA with 100% visual fidelity.

## Features

- **Bilingual UI** — Full Arabic and English support with automatic RTL/LTR layout switching
- **Dark / Light Theme** — System-wide theme toggle
- **10 Pages** — Auth (Login + 3-step Signup), Dashboard, Courses, Majors, Major Detail, Course Detail (4 tabs), Profile, Meetings, AI Assistant, Calendar
- **Course Materials System** — Interactive quiz, PDF viewer with pagination/zoom, slide viewer, assignment submission
- **Live Meeting Countdown** — Real-time countdown to the next meeting
- **Calendar** — Month / Week / Agenda views with event creation modal
- **AI Assistant** — Chat interface with conversation history and contextual suggestions
- **Notifications Panel** — Dropdown with unread badges and per-type icons
- **Toast Notifications** — Success / info / warning / error toasts

## Tech Stack

- React 18 (functional components + hooks)
- Vite (build tool)
- Vanilla CSS (custom design token system, no CSS frameworks)
- SVG sprite icon system

## Getting Started

```bash
npm install
npm run dev
```

Then open the URL shown (typically `http://localhost:5173`).

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Project Structure

```
src/
├── components/     # Shared UI (Sidebar, Topbar, Toast, Modals, etc.)
├── context/        # AppContext (state, i18n, theme, toasts)
├── data/           # Static data (i18n dict, courses, events, materials)
├── pages/          # Page-level components
│   └── materials/  # Material viewers (Quiz, PDF, Slides, Assignment)
├── *.css           # Original design tokens + component styles
└── missing-classes.css  # Additional styles for React-specific classes
```
