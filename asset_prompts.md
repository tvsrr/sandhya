# SANDHYA — asset prompts (final)

Only the assets where an emoji is a real compromise. Generate with Nano Banana
(Gemini 2.5 Flash Image), save with the **exact filename** shown, drop into the folder.
I handle the rest (threshold-letter + mood glyphs) as inline SVG — you don't generate those.

---

## ⚙️ Read this first — two kinds of image, two backgrounds

**1. CUTOUT objects** (diya, bowl, blade, temple) — I remove the background in code, so:
- Put the subject on a **flat, uniform, solid pure-magenta background, hex #FF00FF**, evenly
  lit like a studio sweep. (Magenta never appears in this warm palette, so it keys out cleanly.)
- **No** gradient, **no** ground plane, **no** shadow cast onto the background, **no** vignette.
- Center the subject with **generous empty margin** on all sides (don't crop edges).
- Keep any glow **tight to the object** — don't let light bleed into the magenta. I re-add
  glow in-app with CSS, so a clean hard-ish edge is better than a soft halo.
- Nothing in the subject itself may be magenta/hot-pink.

**2. FULL-BLEED art** (app icon, relic cards, scenes) — keep its own background, fills the frame.

---

## 🎨 House style (in every prompt — don't remove)
> Painterly digital illustration blending the warmth of Indian Pahari/Rajput miniature
> painting with modern celestial editorial art. Soft dawn light, fine gold-leaf linework,
> subtle grain, serene and sacred. Strict palette: deep indigo #141733, violet #2e285c,
> rose #964e5c, ember amber #ff8c42, warm gold #ffcf6b, warm off-white #fff8ee.
> No text, no letters, no numbers, no signature, no watermark, no UI.

**Consistency:** generate `icon` first, then for every later image keep the same chat and
begin with *"In the exact same art style, palette and lighting as before —"*.

---

# CUTOUT OBJECTS — flat magenta #FF00FF background

### `public/diya-lit.png` · 1024×1024
> A single traditional Indian clay diya (oil lamp) with a warm glowing flame, three-quarter
> view, hand-painted miniature style with gold-leaf rim. SANDHYA house style. Centered with
> wide empty margin on a flat, evenly-lit solid pure-magenta (#FF00FF) studio background —
> no gradient, no shadow on the background, keep the flame's glow tight to the lamp. No text.

### `public/diya-unlit.png` · 1024×1024
> In the same style and exact same lamp — but unlit, no flame, a quiet wick resting in the
> oil, cooler muted indigo-violet tones, same gold rim. Same three-quarter view. Centered
> with wide margin on a flat solid pure-magenta (#FF00FF) background, no shadow, no gradient.

### `public/bowl.png` · 1024×1024
> A small handmade clay ritual bowl (arghya patra) holding a shallow pool of water catching
> golden dawn light, a few faint embers hovering just above the surface. Three-quarter
> top-down view, miniature style with gold-leaf edge. SANDHYA house style. Centered with wide
> margin on a flat solid pure-magenta (#FF00FF) background, no shadow, no gradient. No text.

### `public/blade-full.png` · 1024×1536 (2:3)
> An elegant hand-forged double-edged sword, vertical, tip up, faint warm glow along the
> fuller, gold-inlaid guard and wrapped hilt, slightly imperfect and beautiful. Steel shifts
> from cool indigo shadow to warm gold edge. SANDHYA house style. Centered vertically with
> margin on a flat solid pure-magenta (#FF00FF) background, no shadow, no gradient. No text.

### `public/temple-full.png` · 1024×1536 (2:3)
> A serene South-Indian stone temple at dawn: stepped base, rows of carved pillars, a vaulted
> sanctum, and a tall tapering spire (shikhara) crowned with a point of golden light. Warm
> miniature style, gold-leaf edges, amber sunrise on one side, indigo shadow on the other.
> SANDHYA house style. Centered with margin on a flat solid pure-magenta (#FF00FF) background,
> no shadow, no gradient. No text.

---

# FULL-BLEED ART — keep the background

### `public/icon.png` — app / home-screen icon · 1024×1024
> App icon, SANDHYA house style. A single serene emblem: a stylized sun cresting a flat
> horizon line, rays as fine gold leaf, a few stars fading in the indigo sky above. Centered,
> bold, readable at 32px. Full-bleed deep-indigo→amber vertical gradient background. No text.

### Relic cards — `public/relics/relic-01.png` … `relic-10.png` · 900×1200 (3:4)
Collectible oracle cards. **Minimum 3–4 to start** (I use whatever exists and fall back
gracefully). Full-bleed art, thin ornate gold-leaf inner border, **no text/numbers on the
card** (I add the name in-app). Prepend each with:
*"Oracle-style 3:4 portrait card, thin ornate gold-leaf inner border, SANDHYA house style,
palette indigo/violet/rose/amber/gold, soft grain, no text, no numbers, no watermark —"*

- `relic-01.png` *The Open Door in a Field* — a wooden door standing open and free-floating in a vast dawn meadow, golden light spilling through onto the grass, indigo sky, a few fading stars.
- `relic-02.png` *The First Star Over the Anvil* — a blacksmith's anvil on dark ground at dusk, one bright silver star rising directly above it, faint ember glow at its base.
- `relic-03.png` *The Ferryman's Lantern* — a small wooden boat on still dark water at pre-dawn, a warm lantern on its prow casting gold reflections, distant amber horizon.
- `relic-04.png` *The Threshold Stone* — a weathered carved stone doorstep at an unseen home's entrance, first sunrise light grazing its worn surface, gold-leaf accents.
- `relic-05.png` *The Blade Half-Drawn* — an elegant sword half-drawn from an ornate scabbard, warm light along the exposed steel, indigo-to-amber background.
- `relic-06.png` *The Waxing Moon Over Water* — a luminous waxing gibbous moon reflected on calm night water, violet-indigo sky, a thin rose band at the horizon.
- `relic-07.png` *The Cupped Hands of Dawn* — two open cupped hands lifted in offering, water and golden light pouring from them toward a rising sun, gentle and sacred.
- `relic-08.png` *The Long Shadow Walking East* — a lone robed figure from behind walking toward a golden sunrise on a wide plain, long shadow trailing, hopeful.
- `relic-09.png` *The Ember That Would Not Die* — a single glowing ember in grey ash in near-darkness, refusing to go out, a soft amber halo around it.
- `relic-10.png` *The Sun Caught in the Doorframe* — a stone doorway framing a full golden sunrise perfectly within it, light flooding through onto a dark floor.

### Scenes — `public/scenes/*.png` · 1080×1920 (9:16, full-screen)
**Minimum: `threshold` + `day75`.** Full-bleed, no text.

- `scenes/threshold.png` *(onboarding hero)* — a doorway of warm light standing alone in a dark pre-dawn field, deep indigo sky full of soft stars, a faint amber band at the horizon, an inviting path to the door.
- `scenes/day25.png` *(First Twilight)* — the moment violet floods over indigo, a lone figure at a threshold looking east toward a thin rose line of dawn, hopeful.
- `scenes/day50.png` *(High Crossing)* — a high bright sun near its zenith over a wide river, a small boat halfway across, warm and steady.
- `scenes/day75.png` *(Emergence)* — a full golden sunrise clearing the horizon, a figure mid-stride walking through a doorway of light into full daylight, serene and triumphant.
- `scenes/farewell.png` *(last KPIT day)* — an office door closing gently behind a small figure walking toward a warm dawn horizon across an open plain, cool office indigo giving way to gold ahead, bittersweet and peaceful.

---

## Priority
1. `diya-lit`, `diya-unlit`, `bowl` — the sacred ritual moments (biggest win).
2. 3–4 `relic` cards — makes the reward feel like treasure.
3. `icon` — needed for a clean home-screen install.
4. `blade-full`, `temple-full` — the Day-75 / Path payoff.
5. `scenes/threshold` + `scenes/day75` — the emotional peaks.

I'll handle the 💌 threshold letter and the mood glyphs as inline SVG — no generation needed.
