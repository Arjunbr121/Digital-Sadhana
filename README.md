# Digital Sadhana

Digital Sadhana is a private, frontend-only spiritual practice companion for mantra Jaap, meditation, Sankalpa, and structured Sadhana journeys. It is designed as a polished, mobile-first experience that keeps the user's practice data on their own device.

## What the app does

- Create a local account and sign in on the same device
- Browse a curated mantra library and add personal mantras
- Count Jaap with an animated digital mala and optional bead feedback
- Pause, save, dismiss, and resume multiple chanting sessions
- Create guided 7, 21, or 40-day Sadhana journeys
- Maintain daily Sankalpa intentions and completion history
- Use a meditation timer with generated soundscapes or a personal MP3
- Track streaks, total Jaap, practice time, weekly activity, and history
- Switch between light and dark themes
- Use English, Hindi, or Kannada navigation
- Send product feedback to the developer through the device's email app
- Review About, Terms, and Privacy information from the Profile page

## Privacy and storage

Digital Sadhana has no backend, cloud database, or analytics integration. Accounts, password hashes, settings, uploaded audio, mantras, active journeys, paused sessions, and practice history are stored in browser `localStorage`.

Clearing browser data, resetting the journey, uninstalling the app, or changing devices can permanently remove this information. There is currently no cloud sync or recovery.

## Technology

- React 19
- TypeScript
- Vite
- React Router
- Framer Motion
- Lucide React
- Tailwind CSS tooling with a custom responsive design system

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

The optimized output is generated in `dist/`.

## Deploy to Vercel

1. Import `Arjunbr121/Digital-Sadhana` into Vercel.
2. Select the Vite framework preset.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory.
5. Deploy.

The included `vercel.json` redirects client-side routes to `index.html`, allowing direct visits to routes such as `/home`, `/profile`, and `/meditate`.

## Important limitations

- Login is local-device access control, not server-backed authentication.
- Passwords cannot be recovered because there is no backend.
- Browser storage has limited capacity, so uploaded MP3 files are size restricted.
- Notifications depend on browser and operating-system permission.
- The app is a personal practice tool and does not provide medical, therapeutic, or spiritual authority.

## Developer

Created by Arjun. Feedback and support: [arjunbr270@gmail.com](mailto:arjunbr270@gmail.com)
