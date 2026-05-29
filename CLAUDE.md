# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BrightPath is a childcare management platform MVP for a Minnesota-based family childcare center. It tracks GPS check-ins, enrolled children, staff certifications, billing/invoices, CACFP meal compliance, and DCYF licensing requirements — all as a frontend-only demo with hardcoded data.

## Commands

```bash
npm run dev       # start Vite dev server (localhost:5173)
npm run build     # production build to dist/
npm run preview   # preview the production build
```

There is no test runner, no linter, and no TypeScript configured.

## Architecture

**Stack**: React 18 + Vite, React Router v6 (client-side only), no backend, no state management library beyond `useState`.

**Entry flow**: `main.jsx` → `App.jsx` → auth gate → `BrowserRouter > Layout > Routes`

`App.jsx` owns two pieces of state that flow down through props:
- `user` — the auth state (`null` = show `SignIn`; `{ email }` = show the app). Auth is fake/demo: any email+password triggers `onSignIn`.
- `dark` — dark mode toggle. Currently only `Sidebar` and `SignIn` visually respond to this prop; page components are not yet dark-mode aware.

`App.jsx` also defines the `Sidebar` and `Layout` components inline (not in separate files). The sidebar `NAV_ITEMS` array with `badge` and `highlight` properties drives both navigation links and the notification badges visible in the UI.

**Pages**: All routes are flat under `src/pages/`. Each page component is self-contained — no shared component library exists. Data is declared as module-level constants at the top of each file.

## Key Conventions

**Styling**: Two approaches coexist. Older pages (`GpsCheckin`, `Reports`) use CSS class names from `index.css` (`.card`, `.btn`, `.badge`, `.table-wrapper`). Newer pages (`Dashboard`, `Children`, `Staff`, `Billing`, `Meals`, `Compliance`) use inline styles exclusively. When extending existing pages, match the approach already used in that file. New pages should use inline styles.

**Brand colors**: Primary `#4f46e5` (indigo), gradient `linear-gradient(135deg,#4f46e5,#7c3aed)`. Status colors: green `#059669`, amber `#d97706`, red `#dc2626`, blue `#0891b2`.

**Page layout pattern**: Every page follows the same structure — page header with title/subtitle → KPI cards row (4-column grid) → optional alert banners → filter/tab controls → main content table or card grid.

**No real persistence**: All data mutations (e.g., adding a child in `Children.jsx`, marking an invoice paid in `Billing.jsx`) only update local `useState` and are lost on page reload. There is no backend, no localStorage, and no API calls anywhere.

## GPS Check-in Feature

`GpsCheckin.jsx` is described as BrightPath's core feature. It calls `navigator.geolocation.getCurrentPosition()` and runs a Haversine distance calculation against hardcoded facility coordinates (`FACILITY_LAT = 45.1975`, `FACILITY_LNG = -93.3874`, Anoka MN, 150m geofence radius). If geolocation is denied, it falls back to demo coordinates near the facility so check-in always succeeds in the demo.

## Domain Context

- **Licensing**: Minnesota DCYF (Dept. of Children, Youth & Families), license `MN-CCL-2024-00312`, max capacity 12 children
- **Room ratios**: MN requirement is max 1:6 staff-to-child for ages 3–5
- **Staff certs tracked**: CPR/AED, First Aid, DCYF background check, fingerprints — certs expiring within 90 days trigger yellow warnings
- **Billing rates**: Full-Time $1,200/mo, Part-Time $700/mo, Drop-In $75/day
- **CACFP**: Child and Adult Care Food Program meal compliance checklist on the Meals page
