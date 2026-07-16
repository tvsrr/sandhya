# 🌄 SANDHYA

### *Seventy-five dawns. One crossing.*

Your notice period, reimagined as a 75-day twilight crossing — one long sunrise from
indigo pre-dawn to full gold morning. A personal transformation compass built around the
concept in [`what_fable_thinks.md`](./what_fable_thinks.md), your priorities in
[`Priorities.md`](./Priorities.md), and the UX psychology in [`ux_rules.md`](./ux_rules.md).

> The threshold is the temple.

---

## What's inside

| Mechanic | What it is |
|---|---|
| **The Long Dawn** | The whole app is one sunrise stretched across 75 days. The sky visibly shifts from indigo → violet → rose → amber → gold as your *days lit* grow. Never starts at 0 (goal-gradient). |
| **The Sun Arc** | Your daily loop, in three segments — **DEHA** (body/morning ritual), **KARMA** (craft), **CHITTA** (mind). Close all three and the day's sun rises. |
| **The Forge** | A 25-minute C++ "heat" with an anvil *tink* every 5 min and a hammer strike at the end. The **“This is boring and I'm doing it anyway”** button mints **Grit Sparks** — the only thing that improves your nightly reward odds. Endured boredom → luck. |
| **The Sparring Ring** | LeetCode with an honest **Craft Rating** (Chess.com-style), not badges. |
| **Arghya** | The nightly offering. Tap the bowl to pour the day and receive a **variable reward** — your own past journal lines, verses, real stat-gems, Ghee Lamps, or rare Relic cards. Nothing is currency; every reward is meaning. |
| **The Moon** | Your 4 health pillars as ONE weekly waxing moon. One tap: held / slipped. The app never asks what you ate. |
| **Lamps, not chains** | No streaks. "Days lit" only grows. Ghee Lamps cover a missed day. Dim days are blue embers, not dead. |
| **The Three Twilights** | Milestone moments at Day 25, 50, 75 — plus a Threshold Letter you write on Day 1 that returns to you around Day 40. |

All data is stored **locally in your browser** (localStorage). Nothing is uploaded anywhere.
Use **Settings → Export backup** regularly — that's your only safety net against a cleared browser.

---

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

---

## Deploy to Vercel (≈ 2 minutes)

This is a standard Next.js app — Vercel detects everything automatically. No environment
variables, no database. Two ways:

### Option A — Vercel CLI (fastest)

```bash
npm i -g vercel      # once
vercel login         # opens the browser to log in
vercel               # from this folder — accept the defaults
vercel --prod        # promote to your production URL
```

> Tip: in this Claude Code session you can run the login step yourself by typing
> `! vercel login` in the prompt, so the output lands right in the conversation.

### Option B — GitHub + Vercel dashboard

```bash
# push this repo to GitHub first
git add -A && git commit -m "SANDHYA v1"
git branch -M main
git remote add origin git@github.com:<you>/sandhya.git
git push -u origin main
```

Then at [vercel.com/new](https://vercel.com/new): **Import** the repo → **Deploy**.
Framework preset **Next.js** is auto-selected. Done.

### Add it to your phone
Open the deployed URL in mobile Safari/Chrome → **Share → Add to Home Screen**.
It's configured as a standalone web app (proper title, theme color, safe-area padding).

---

## Tech
Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · localStorage · zero backend.
Synthesized sound via Web Audio (no asset files) and haptics via the Vibration API where supported.

*The grind is the transformation. 🔥*
