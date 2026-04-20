# Luna

**Your cycle, quietly.**

A calm, minimal period and cycle tracker that runs entirely in your browser. No account. No server. No tracking. Your data never leaves your device.

## Features

- **Period logging** — log start and end dates, flow intensity (spotting, light, medium, heavy)
- **Symptom tracking** — mood, cramps, energy, sleep quality, headache, bloating, sex drive, discharge — all tap-through, no typing
- **Monthly calendar** — colour-coded view of past periods, predicted next period, and fertile window
- **Cycle predictions** — next period date based on a rolling average of your actual cycles, not an assumed 28 days
- **Fertile window estimate** — calculated from your real cycle length
- **Cycle stats** — average cycle length, average period length, variation, and a 6-cycle history you can show your doctor
- **Onboarding** — set your last period date, typical cycle length, and period length upfront so predictions work from day one
- **100% private** — everything stored in `localStorage` only, no backend, no analytics

## Privacy

Luna is private by design:

- No account required
- No email, no password
- No data sent anywhere — ever
- Predictions are estimates only, not medical advice or contraception guidance

## Tech

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- `localStorage` for persistence

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Building

```bash
npm run build
```

Output goes to `dist/` — deploy anywhere that serves static files (Vercel, Netlify, GitHub Pages, etc.).

## Design

Warm neutral palette with a single terracotta accent. Mobile-first, tested on iOS Safari and Chrome. Moon as a subtle motif — no cartoon graphics.

Color roles:
- **Terracotta** — period days
- **Lavender** — predicted period
- **Sage** — fertile window

---

*Luna is not a medical device. Predictions are estimates to help you plan, not contraception advice.*
