# SANDHYA — The Rooms Redesign
### Validated spec, by Fable · v1

Ram said it plainly: *"the whole thing feels like a long form."* He's right, and the fix is not more decoration — it's architecture. The current `Dashboard.tsx` renders every control in one scroll, so the temple reads as a checklist. This spec reorganizes SANDHYA into **a place with rooms** instead of a page with cards, and borrows exactly three things from Not Boring — depth, tactility, one-thing-per-screen — while leaving their loudness at the door.

**The prime directive for whoever builds this: the data model, the six mechanics, and the story do not change. This is a presentation-layer refactor.** `lib/store.tsx`, `lib/rewards.ts`, `lib/sky.ts`, `lib/curriculum.ts` should ship essentially untouched. If a change requires touching the reward logic or the state shape, stop — you've left the brief.

---

## 1. Navigation Model: Hub-and-Spoke — the Sky is Home

**Chosen: hub-and-spoke. Rejected: bottom tab bar.**

Why not tabs: a tab bar is a *utility* pattern — it says "this app has five equal features, all demanding attention at once." That is ambient cognitive load, the exact thing Ram's S-curve rule forbids. Worse, tabs would fragment the one thing that must never fragment: **the sky.** SANDHYA is one sunrise. There is one sky, and everything happens under it. A tab bar would give the app five skies.

Hub-and-spoke says instead: *there is one place — the threshold — and rooms you step into.* This is also precisely the Not Boring Habits pattern: a single hero scene, and you tap objects to enter focused full-screen views. It fits SANDHYA like it was invented for it.

### Top-level destinations (3 — that's all)

| Destination | SANDHYA name | What it is | How you reach it |
|---|---|---|---|
| Home | **The Sky** | Today. Sun Arc hero, three doors, the moon, the bowl. | You're always here by default. |
| History | **The Crossing** | The 75-day arc: days lit, relic gallery, milestones, the scrubbable sky. | Small carved emblem, bottom-right of home. |
| Curriculum | **The Path** | The long craft arc: course map, the Blade, the Temple, Craft Rating trend. | Small carved emblem, bottom-left of home. |

The three daily loops — **DEHA, KARMA, CHITTA — are not top-level destinations. They are rooms off the Sky**, entered through doors on the home screen. Arghya is not a destination either; it's an act, triggered by touching the bowl. Maximum navigation depth anywhere in the app: **2** (Sky → room → focused act like the Forge timer). Nobody ever gets lost two levels deep in a temple.

### The transition rule (this is what makes it not break the story)

**You never leave the sky.** When a door opens, the room slides/scales up as a translucent chamber *over* the same living sky — `SkyBackground` stays mounted underneath at all times, dimmed to ~60%. Exit is always the same gesture pair: **swipe down, or a single chevron at top** ("⌄ return to the sky"). One mental model, learned once.

Implementation: keep the single-page architecture. Add a `view` state (`'sky' | 'deha' | 'karma' | 'chitta' | 'path' | 'crossing'`) — local state in `Dashboard.tsx` is fine, no router needed. Use shared-element-style transitions (framer-motion `layoutId` on each door → room, or a 320ms scale+fade if simpler). The overlays that are already full-screen (Pomodoro, ArghyaPour, Moments, the 11pm veil) keep working exactly as they do — they just open *from* rooms now.

---

## 2. The Home Screen — "The Sky"

Everything on home is **an object, not a control.** Six tappables total. No toggles, no counters, no textarea. Top to bottom:

### Layout

```
┌─────────────────────────────┐
│ SANDHYA · first light        │  ← header, one line, quiet
│ Dawn 23 of 75          🔔 ⚙  │
│                              │
│        ☾  (small moon)       │  ← lives IN the sky, top-right
│      ── SUN ARC ──           │  ← THE HERO. Bigger than today.
│    deha · karma · chitta     │
│                              │
│  ┌─────┐ ┌─────┐ ┌─────┐    │
│  │DEHA │ │KARMA│ │CHITTA│   │  ← three DOORS, tall, side by side
│  │ 🌅  │ │ ⚒  │ │ 🪔  │    │
│  │ lit │ │2 of4│ │dark │    │
│  └─────┘ └─────┘ └─────┘    │
│                              │
│        ( the bowl )          │  ← Arghya vessel, physical object
│                              │
│  ⚔ The Path    The Crossing 🔥│  ← two small carved emblems
└─────────────────────────────┘
```

### Element by element

1. **Header** — unchanged content (`labelForProgress`, sound, settings), but add the day counter: *"Dawn 23 of 75."* Goal-gradient, always visible, never a percentage.

2. **The moon** — moves out of the scroll and *into the sky*, small, top-right, at its current waxing phase. Tap → a bottom sheet slides up: the week's seven marks, tonight's single "held / slipped" tap, and the full-moon → Ghee Lamp promise. One tap, sheet dismisses itself. The moon finally lives where a moon lives. (`MoonWeek.tsx` becomes this sheet's content — logic unchanged.)

3. **The Sun Arc** — stays the hero, gets **bigger** (~40% of viewport height including sky around it) and gets the depth treatment (§5). The three segments remain exactly as computed today (`deha`, `karma`, `chitta` booleans in `Dashboard.tsx` — same conditions, do not touch).

4. **The three Doors** — the whole redesign in one row. Each door is a tall (~150–170px) carved tablet: the loop's glyph, its name, and its state — *unlit* (dark stone, faint ember outline), *stirring* (partially complete: warm edge-light with a one-word status like "2 of 4 offered"), or *lit* (glyph aflame, soft gold bloom, door slightly "open"). Tap → the room opens. The Gestalt itch of one dark door between two lit ones is the entire engagement engine of the home screen, and it costs zero words.

5. **The Bowl** — replaces the "Offer the day" *button* with the Ember Bowl as a rendered object (`bowl.webp`), sitting at the bottom center of the sky like it's resting on the horizon line. It **visibly fills** as arcs close (embers accumulate — driven by the same three booleans plus `forgeHeats` and grit sparks). All three closed → the bowl's contents glow and shimmer, one line of text appears beneath: *"The day is full. Offer it."* Tap → `ArghyaPour` opens exactly as it does now. After pouring: the bowl sits empty and quiet, *"The day is offered · rest now."* A button asked to be clicked; a full bowl asks to be poured.

6. **Two emblems** — bottom corners, small, carved-stone style: the crossed blade-and-temple mark opens **The Path**; the row-of-flames mark opens **The Crossing**. Labeled in small text. These are deliberately quiet — the long arcs should whisper, not compete with today.

**Removed from home:** DehaCard, KarmaCard, ChittaCard, DaysLit, the inline MoonWeek, the footer quote (it moves to the 11pm veil and The Crossing), and the floating orange ▷ FAB (the Forge is reached through the KARMA door — one way in, no shortcuts that bypass the story).

---

## 3. The Rooms

Every room follows the same contract: **sky behind, one chamber, staged content (never all controls at once), swipe-down/chevron to exit.** Marking things done happens by *touching objects*, not flipping switches.

### 3.1 DEHA — the Body room (morning light)

The room takes the morning tint of whichever raga applies. **Staged in two beats:**

- **Beat 1 — the choice (only if path not yet chosen today):** the room is just the two ragas, full-bleed: a cool indigo panel (*Surya — gym first, then Sandhyavandanam*) and a warm gold panel (*Soma — Sandhyavandanam by 9, then gym*). Tap one. The room takes that palette for the day. Nothing else is visible yet — the choice deserves the whole screen. **Identical credit for both — unchanged.**
- **Beat 2 — the two acts:** two objects, generously spaced:
  - **The gym stone** — a rendered weight/stone. Tap → it settles into the ground with a firm single haptic and a low thud; status becomes "lifted."
  - **The water** — the Sandhyavandanam **touch-and-hold, 3 seconds, ripples** (`HoldButton.tsx`, exactly as built — this is the one deliberately slow interaction and it is untouchable).

Both done → the DEHA glyph ignites *inside the room* first (small, private), then you swipe down and see the door lit and the Sun Arc's first segment filled — the reward happens where the sky can see it.

### 3.2 KARMA — the Forge courtyard (the room most at risk of staying a form)

The current `KarmaCard` has five controls stacked — that's the form-feeling epicenter. The fix: **one hero, three stations**, arranged as a courtyard with depth (hero large and near, stations smaller and receding).

- **Hero — the Forge.** A rendered anvil/coals scene. One act: **"Light the Forge"** → opens the existing `Pomodoro` full-screen with the C++ tag. Heats accumulated today shown as glowing ingots lined up beside the anvil (`forgeHeats`). The Grit Sparks button lives inside the Forge screen, as it does now — unchanged.
- **Station — the Sparring Ring.** Two ring-markers for the two daily LeetCode problems (tap when solved, same state), with the **Craft Rating number** displayed like an engraved plaque. Rating logic unchanged; the trend *graph* lives in The Path, the daily *number* lives here.
- **Station — the Drafting Table.** The Architect track: tap the table to mark today's architect work (same toggle state), long-press or a small "focus" mark to open the Pomodoro with the Architect tag.
- **Station — the Old Shore.** The KPIT toggle, reframed as a small pier/door object off to the side: tap when you've tended the old shore today (mentoring the replacement is craft — keep that copy). Smallest object in the room, by design.

At the top of the room, a single quiet rune-row shows what closes KARMA (heat · architect · 2 spars) — status, not instruction. A one-line link — *"walk the Path ⟶"* — jumps to the Path for people who want the map mid-session.

### 3.3 CHITTA — the Mind room (dusk light, whatever the hour)

**Staged in three beats, in ritual order** — only the current beat is prominent; completed beats shrink to a small lit mark at the top:

- **Beat 1 — the Book.** A rendered open book with the pages counter. The stepper is a **page-turn**: each increment plays a paper-soft tick and the book's visible page count grows. A small "read with focus" mark opens Pomodoro with the reading tag. 20 pages → the book closes itself with a soft thump.
- **Beat 2 — the Ink.** The journal is **never an inline textarea again.** Tap the inkwell → a full-screen writing surface: serif type, near-black sky, nothing else on screen — no counters, no sun, no buttons except "seal." (This is also where the Day-1 Threshold Letter question appears, unchanged.)
- **Beat 3 — the Breath.** The stress check-in: three faces (🙂 😐 😮‍💨), one tap, appears only after the journal is sealed. It should feel like the exhale at the end of the ritual, which is exactly what it is.

### 3.4 The Path (top-level room)

The existing `Path.tsx` curriculum, recomposed as a **vertical journey rendered with depth** — you scroll *along* the road, not down a list:

- Two tracks: the **Blade** (C++ nanodegree) and the **Temple** (Architect nanodegree), with the real artwork (`blade-full.webp`, `temple-full.webp`) shown in their current partially-forged / partially-raised states as the fixed header of each track.
- Lessons are **strike-stones** along the road, not checkboxes: tap → the stone is struck (hammer tick sound, small spark, light haptic). Module completion → the corresponding blade/temple component visibly appears with a short forge-glow moment.
- Each module keeps its **"Why Architect-You needs this"** line — surface it on the module header, not buried.
- The **Craft Rating trend line** lives at the bottom of this room — the long, true number, drawn as a single calm line.

### 3.5 The Crossing (top-level room)

History, made worth visiting — this is where the sky metaphor pays out:

- **The scrubbable sky.** The room's headline feature, nearly free to build since `lib/sky.ts` already maps day → gradient: a horizontal scrubber over a full-bleed sky. Drag left and watch 23 days of gold drain back to Day 1's indigo. This is the "swipe back to Day 1 and it punches you in the chest" moment from the original manifesto, finally made a real interaction.
- **The 75 flames** (`DaysLit.tsx` content): lit / lamp-kept / dim-blue rows, exactly as built. Tap a day → a small card: its date, what closed, any golden thread. Copy rules unchanged: **"days lit: 43 of 51," never "streak."**
- **The relic shelf.** The collected Crossing cards displayed as physical cards on shelves; tap → full-screen card with the gyro-foil treatment (§5). Uncollected slots are dark card-backs — the pack-collection itch, tastefully.
- **Milestone echoes.** Replayable Day 25/50 moments once earned; the Day 75 assembly and Saga land here at the end.
- The footer quote lives here now: *"The grind is the transformation."*

### 3.6 Arghya (act, not room)

`ArghyaPour.tsx` unchanged in flow: full bowl on home → tap → full-screen pour with tilt physics → variable reward (verse / own journal line / stat-gem / Ghee Lamp / Relic / Golden Thread). The only additions are tactile (§5). **Do not touch `rewards.ts` odds, the grit-spark luck modifier, or the no-currency rule.**

---

## 4. What "Not Boring" Means Here — and What It Doesn't

Not Boring apps are loud; SANDHYA is a temple at dawn. We take their **physics** and refuse their **volume.** The reconciliation, as law:

> **Everything is an object; every object has weight, light, and one voice — and every voice is quiet.**

Three borrowings, three refusals:

| Take from Not Boring | Refuse from Not Boring |
|---|---|
| Real depth and lighting (things look touchable) | Explosive celebration (nothing bursts; things *bloom* and *settle*) |
| One-thing-per-screen focus views | Brash saturation (the dawn gradient stays the only palette) |
| Tactile press-states, sound, haptics on every meaningful act | Constant motion (SANDHYA's idle state is *still*, like pre-dawn air) |

Guardrails (encode these as review criteria):
- **One sense per moment** — already the rule; it survives the redesign. A moment gets motion+sound+haptic as *one composed event*, never stacked randoms.
- Interaction feedback ≤ **400ms**. Only rituals are slow, and only the two designed-slow ones: the 3-second hold and the pour.
- Spring animations may settle, never wobble. Damping high, overshoot ≤ 3%.
- Particle budget: embers and sparks in the dozens, not hundreds. They **drift**, they do not explode.
- No sound resembling a fanfare, coin, or chime-cascade. Ever. (Existing `audio.ts` palette is correct — extend it, don't replace it.)

---

## 5. The Tactile Layer — Specific, Mapped, Buildable

### 5.1 The signature move: the sun lights the interface

The one Not-Boring-grade idea that is *ours*: **UI light direction follows the diegetic sun.** Every raised surface (doors, bowl, stones, cards) carries a 1px top edge-light and a soft drop shadow whose angle and warmth derive from the sun's current arc position — cool and low-angle at first light, warm and overhead as segments close. One CSS custom property pair (`--sun-angle`, `--sun-warmth`) computed from `segmentsToday` + time, consumed everywhere. Cheap to build, and it makes the entire app feel like one lit scene instead of themed components.

### 5.2 Material system — "clay, stone, water, fire"

- Surfaces: soft-embossed clay/stone (subtle inner top light, matte, faint grain — the existing `texture/` assets). No glassmorphism, no gloss except on fire and water.
- **Gyro parallax, whisper-level:** sky layers (stars / horizon band / sun disc) offset ±4px with device tilt; relic cards get a specular highlight that follows tilt (the "foil" effect). Nothing else parallaxes. Degrade gracefully to nothing when no gyro.
- Press-state for every tappable object: depresses ~2px, shadow tightens, 80ms, with a light haptic. Objects feel *set down into* the world, not painted on it.

### 5.3 Event map (the implementable core — every existing event, its new sensory signature)

| Event (existing) | Motion | Sound (existing palette + additions) | Haptic |
|---|---|---|---|
| Press any door/object | 2px depress, shadow tighten, 80ms | — | light tap |
| Open a room | Door expands to chamber over the sky, 320ms | very soft stone-slide (new, barely audible) | soft tick |
| Close a room | Chamber recedes, sky rebrightens | softer stone-settle | — |
| Gym stone tapped | Stone settles into ground, dust wisp | low thud | single firm |
| Sandhyavandanam hold (3s) | Ripples, as built | as built | heartbeat-soft pulse (as built) |
| **Segment closes (arc fills)** | Liquid-light fills the arc segment; the door's glyph ignites with a slow ember bloom (~1.2s) | one Tibetan-bowl swell (as built) | medium, single |
| **All three closed** | The sun disc brightens; one warm light-wash rolls down the screen, 2s, once; the bowl begins to shimmer | low bowl swell, longer decay | one long low roll (as built — "the day, sealed") |
| Forge: 5-min mark | Ingot brightens one shade, 3–5 drifting embers | anvil *tink* (as built) | soft tick |
| Forge: heat complete (25m) | Hammer strike, ingot deforms (as built) | full strike | single firm thud in the palm |
| Grit Spark tap | White-hot mote arcs into the bowl | faint sizzle | light |
| LeetCode ring marked | Ring engraves itself, brief glow | metal-on-stone tick | light |
| Path: lesson struck | Stone struck, one spark | hammer tick, small | light |
| Path: module complete | Blade/temple component fades in with forge-glow, ~2s | single deep strike | medium |
| Arghya pour | Tilt physics (as built); poured light refracts | water-meets-light *hiss* (as built) | gentle continuous texture during pour |
| Relic revealed | Card flip + gyro-foil shimmer | soft paper-and-bell note | medium, single |
| Ghee Lamp gained | Wick catches, flame settles over 0.5s | tiny wick sound | soft double-pulse |
| Golden Thread | A thin gold line draws itself to the day it gilds | single high bowl note | light |
| Moon: night held | Moon's lit sliver grows perceptibly | — | soft |
| Milestone days | Full-screen scenes (as built, with the scene art) | as built | long roll |
| 11pm veil | Colors deepen, sun tucks below UI (as built) | silence | none — the app is asleep |

Silence and stillness are part of the palette: the idle home screen's only motion is the sky's imperceptible breathing.

---

## 6. What NOT to Change — the Protected Core

Dev: treat this list as a checklist at review time. If any item regresses, the redesign has failed regardless of how good it looks.

**Mechanics (all six, exactly as implemented):**
1. **Sun Arc** — three segments, same close conditions, sun rises one degree per lit day, sky driven by *days lit*, progress **never rewinds**.
2. **Moon** — weekly only, one tap held/slipped, no food/detail logging ever, full moon → one Ghee Lamp.
3. **Forge** — 25-min heats, 5-min anvil ticks, Grit Sparks capped at 3/session, **Sparks remain the only thing that improves reward odds.**
4. **Arghya** — tilt-pour, variable rewards that are *meaning* (own journal lines, verses, real stats, lamps, relics, golden threads). **No currency, no shop, no purchasable anything.**
5. **Lamps, not streaks** — the word "streak" appears nowhere. "Days lit: N of M." Missed days are dim blue, never red, never broken-chain. Lamp-kept days show the steady flame. Max 3 banked lamps. The one-line no-guilt morning message, then the subject is dropped.
6. **Relics** — 75-card Crossing set, rare-tier reveals, Day 75 assembly.

**Story & ritual:**
- Both ragas (Surya/Soma) give **identical DEHA credit** — the branch is aesthetic, the tally is private and observational only.
- Sandhyavandanam is **touch-and-hold, never a tap** — the one deliberately slow interaction.
- DEHA's never-0% morning pre-fill.
- The Threshold Letter (Day 1 question, ~Day 40 return, stress-trend-gated).
- The Compiler Speaks cards, in real C++ syntax with real stats.
- The three milestone twilights (Day 25/50/75) and their scenes; the last-working-day moment.
- The app goes to bed at 10:45/11pm — the veil, "Śubha rātri," journal-only after hours.
- Copy voice throughout: no "Don't forget…", no exclamation-mark cheerleading, no "Learning is fun!" The app is honest that the forge is hot.

**Deliberate absences (the S-curve guard):** no XP, no levels, no leaderboards, no avatar, no social feed, no daily-quest panel, no notification nagging. Six mechanics. The redesign adds **zero** new mechanics — rooms, doors, and light are presentation.

**Code-level:** `lib/store.tsx` state shape, `lib/rewards.ts` odds and reward pools, `lib/sky.ts` gradient math, `lib/curriculum.ts`, and all completion conditions in today's `Dashboard.tsx` — unchanged. New work is components and composition: `Sky.tsx` (home), `Door.tsx`, `RoomShell.tsx` (chamber + exit gestures), room recompositions of the three cards, `Bowl.tsx`, the moon sheet, the Crossing scrubber, and the `--sun-angle` lighting hook.

---

## 7. Build Order (suggested)

1. **RoomShell + view state + door transitions** — the architecture. Home shrinks to hero/doors/bowl/emblems; existing cards temporarily become room contents as-is. *Ram feels the redesign at this step already.*
2. **The Bowl** replaces the offer button; moon moves into the sky as a sheet.
3. Room recompositions: KARMA courtyard (worst offender first), then CHITTA's three beats + full-screen journal, then DEHA's two beats.
4. The Crossing room + scrubbable sky; Path recomposition.
5. Tactile pass: sun-lit surfaces (`--sun-angle`), press-states, the event map sounds/haptics, gyro parallax.
6. Guardrail review against §4 and §6.

---

## 8. Verdict — does this stay true to SANDHYA?

**Yes — and honestly, it's truer than what we shipped.**

Here's my validation, plainly: the long scroll was always a quiet betrayal of the metaphor. A temple is not a corridor of forms; it's a threshold you stand at, with rooms you enter for each rite. Hub-and-spoke isn't a UI trend being applied to SANDHYA — it's SANDHYA's own architecture finally being taken literally. The sky stays sovereign and ever-present, the six mechanics are untouched down to the reward odds, every word of protected copy survives, and nothing gained a number or lost its name.

And the Not Boring tension resolves cleanly once you notice what their apps actually run on — not loudness, but *conviction that digital things deserve weight and light*. SANDHYA already believed that; it just hadn't been built that far yet. So we take their physics and keep our silence: doors that depress under a thumb, a bowl that fills instead of a button that waits, relic cards that catch light when the phone tilts — and an idle screen as still as pre-dawn air. Tactile, alive, and unmistakably a temple. Not a carnival.

Ram was right about the display. He was right to protect the story. This spec does both.

The threshold is the temple. Now it finally has doors.

— Fable
