@AGENTS.md

# Santi Chill — Personal Brand Strategist (Portfolio)

Premium portfolio web for a **digital creator / personal brand strategist**. Stack: Next.js 16 (App Router) + React 19 + Tailwind v4 + GSAP + Lenis + Three.js.

## Voice / Brand

- **Who is Santi:** Personal brand strategist for entrepreneurs. He does NOT do web design, visual identity, product design, or Webflow/Framer builds. Do not pitch design/dev services on the site.
- **Core positioning line:** "Ayudo a emprendedores a construir marca personal que atrae clientes."
- **Audience:** entrepreneurs / founders / experts who want authority in their niche.
- **Tone:** editorial, serious, no emojis anywhere in UI copy. Big typography, slow + buttery animations, lots of whitespace, warm cream palette.
- **Inspiration vibe:** Awwwards / FWA grade portfolio (Juan Mora-style refs the user shares. https://juanmora.co/).

## Stack

| Piece | Use |
|------|-----|
| Next.js 16 App Router | `src/app` — `layout.tsx`, `page.tsx`, route segments. Read `node_modules/next/dist/docs/` before changing APIs (per AGENTS.md). |
| React 19 | Client components must declare `"use client"`. Server components by default. |
| Tailwind v4 | `@import "tailwindcss";` in `globals.css`. `@theme inline` block exposes design tokens as utilities (`bg-bg-warm`, `text-ink`, etc.). |
| GSAP 3 | All scroll/scrub anims. `ScrollTrigger`, `MotionPathPlugin`. Register inside `if (typeof window !== "undefined")` guard. |
| Lenis | Smooth scroll, wired in `SmoothScroll.tsx`. GSAP ScrollTriggers must respect Lenis (raf integration). |
| Three.js | Used only for the `ShapeBlur` shader component (rounded-rect SDF + mouse-follow circle blur). |

## Design tokens (`globals.css`)

```
--bg-warm  #faf6ef   /* default page bg */
--bg-grey  #f4f4f4
--bg-cold  #e8e9ef
--orange1  #ffbc95   /* accent / lines / glow */
--orange2  #f99e76
--blue     #2e54fe   /* small punch accents */
--grey     #96908c   /* secondary text */
--grey-dark #706b67
--ink      #2a2a2a   /* primary text + dark pills */
--font-display       /* Inter via next/font, weights 400–900 */
```

Always pull colors via `var(--…)` or `bg-bg-warm` utilities. Do NOT hardcode hex inside components unless prototyping.

## Layout (`src/app/layout.tsx`)

Mounts in this order: `<Loader>`, `<SmoothScroll>` (Lenis), `<Nav>`, then `{children}`. Cursor component exists (`Cursor.tsx`) but is intentionally NOT mounted — native cursor used.

## Page composition (`src/app/page.tsx`)

Sections, top-to-bottom:

1. `Hero` — image bg + display headline + nav anchor `top`.
2. `ClickScroll` — pinned 150vh scene. Headline `15 years making people click and scroll my designs`. Two L's of "scroll" act as anchors; thin orange lines drip from each L to a focused shape (one left, one right) and light it up. Live-tracked Bezier paths rebuilt every frame via `gsap.ticker`. See "ClickScroll details" below.
3. `Marquee` — looping word strip (`Brand • Web • Product • Motion • Identity`).
4. `Services` — service tiles with mask-reveal. Tag: `Personal Brand Strategist`. Headline: `Ayudo a emprendedores a construir marca personal que atrae clientes.` Three rows (deliverables, not design services): **Auditoría de Marca**, **Narrativa & Storytelling**, **Autoridad & Posicionamiento**. Do NOT add Websites / Visual Branding / Product Design / Webflow & Framer — Santi does not offer those.
5. `WorkCta` — CTA into selected work.
6. `PersonalBrand` — long-form personal brand block.
7. `About` — bio + benefits with curved `ScrollLine` (variant `benefit`).
8. `Cta` — final CTA.
9. `Footer`.

Sections expose `data-nav="grey|peach"` to drive Nav color theming.

## Animation philosophy

- Default: scrub-bound to scroll, never time-bound, except hero/loader entries.
- Easing: `expo.out` for entrances, `power2.in/out` for exits, `none` (linear) for any scrub-driven tween.
- Scrub values: `0.2` for tight responsiveness (line draws), `1.2–1.6` for slow buttery reveals (shape entries, parallax).
- Stagger words/letters with `0.04–0.08` for headline reveals.
- Always `gsap.context(() => { … }, ref)` + `return () => ctx.revert();` inside `useEffect`. Cleanup or memory leaks on hot reload.
- Register plugins guarded: `if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);`

## ClickScroll details (the hero anim of the page)

- Section is `height: 150vh`, inner `<div ref={pinRef} className="sticky top-0 h-screen overflow-hidden">` — pinned scene via sticky.
- Headline absolutely centered. Each letter of `scroll` is its own `<span>`; the two L's get refs (`lAnchor1`, `lAnchor2`).
- Two target shapes (left + right) absolute, fade in at progress phases.
- `gsap.ticker.add(draw)` rebuilds each line every frame:
  - Measures `getBoundingClientRect()` for the L anchor and shape (live → tracks parallax / entrance moves).
  - Builds Bezier `M sx sy C cp1 cp2 ex ey` with opposite lateral bow per line.
  - Sets `strokeDasharray = len`, `strokeDashoffset = len * (1 - progress)`.
  - Headlight circle position = `getPointAtLength(len * progress)`.
- Progress (`prog.a`, `prog.b`) driven by independent ScrollTriggers (`scrub: 0.2`, narrow ranges around `12–24%`).
- When `progress > 0.95` → shape gets `.lit` class. CSS `.cs-shape.lit` does drop-shadow + scale glow.
- SVG sits z-20 (above shapes) so lines render foreground.

## Reusable patterns

- **Pin + sticky**: prefer `sticky top-0 h-screen overflow-hidden` inside a tall parent over GSAP's `pin: true` when possible — plays nicer with Lenis and SSR.
- **Live geometry tracking**: when a line/connector must follow moving DOM, prefer `gsap.ticker.add` rebuilding the SVG path from rects, NOT static viewBox coords.
- **Reveal masks**: `<span className="inline-block overflow-hidden"><span className="word">…</span></span>` + `gsap.from(yPercent: 110, stagger)`. Trigger must fire while element is still in flow — for pinned scenes use `start: "top 80%", once: true` on the section, NOT on the headline (since headline never crosses the trigger line).
- **Shape lit glow**: `filter: drop-shadow(...) drop-shadow(...) brightness(1.15)` + `transform: scale(1.04)`, transition `cubic-bezier(.2,.7,.2,1) .7s`.

## Conventions

- Component files: `src/components/PascalCase.tsx`, `"use client"` for any with hooks/refs/animation.
- Path alias: `@/components/Foo`, `@/app/...`.
- Public assets: `/public/shapes/*.png|svg` (organic blobs), `/public/img/*` (hero / personal brand). Reference with leading `/`.
- Tailwind: prefer utilities for layout, custom CSS in `globals.css` for anything stateful (`.cs-shape.lit`, `.click-btn`, `.click-hover-text`).
- Custom CSS classes that break Tailwind v4 expectations should be tested — if a `.foo` rule mysteriously doesn't apply, fall back to inline `style={{}}` (Tailwind v4 layer ordering can bite).
- Keep `data-nav="grey|peach"` on every section root so Nav color scheme tracks.

## Non-goals / pitfalls

- Do not reintroduce the custom `.cursor-jm` cursor — user explicitly removed it.
- Do not stack 10+ shapes as background clutter in `ClickScroll` — sequential focused reveals only.
- Lines must NOT appear before user has entered the section. Triggers should `start: "top+=10%+ top"` minimum.
- Never use 5xx Next.js patterns from training data without checking `node_modules/next/dist/docs/`.
- Don't hardcode `15` / `16` years — keep number copy-editable in one place per section.
- No emojis in UI copy — site is serious / editorial.
- Do not reintroduce design/dev service language ("Websites", "Landing Pages", "Visual Branding", "Product Design", "Webflow", "Framer", "UI/UX"). Santi sells personal brand strategy, not design.

## Commit style

Conventional Commits, scoped by section: `feat(click-scroll): …`, `fix(nav): …`, `chore: …`. Bodies optional but welcome when "why" is non-obvious.
