# Golden Barbers — Brand System (After Hours)

> Locked design decisions. Not a moodboard. Every customer-facing surface obeys this document.

---

## Archetype

**"After Hours."** A private cigar lounge at 11pm. A whisky bar with no signage on the door. Hawksmoor steakhouse mid-service. Truefitt & Hill on Old Bond Street.

Not: nightclub, crypto dashboard, gaming overlay, Tailwind portfolio, sneaker drop site.

Restraint > flash. Material weight > motion. Negative space > content density. The visitor should feel they've arrived somewhere that doesn't try to impress.

## Differentiator

99% of barbershop sites lean cheap (bright primary colors, stock photos, generic "modern" UI) or faux-luxury (black + neon gold). Golden Barbers does neither. We borrow from **luxury whisky brands** and **editorial men's magazines** (Esquire, Monocle, GQ Style Quarterly) — categories where the visual language has decades of muted-masculine refinement.

---

## Palette

| Role | Name | Hex | Use |
|---|---|---|---|
| Primary surface | Eerie Black | `#0A0A0A` | Page background. Never pure black `#000`. |
| Elevated surface | Onyx | `#141414` | Cards, modals, raised sections. |
| Quiet surface | Slate Smoke | `#1C1C1C` | Subtle stratification within cards. |
| Primary metal (the "gold") | **Antique Brass** | `#B8895C` | Brand accent. Headlines emphasis, links, CTAs. **Replaces neon gold #D4AF37 / #FFD700.** |
| Brass — light variant | Brass Light | `#D4A878` | Hover states on links/CTAs only. |
| Brass — deep variant | Brass Deep | `#8B6440` | Pressed states, deeper accents. |
| Surprise warm secondary | **Dried Wine** | `#5C1A1A` | Sparing use: emergency-close banner, hot-towel chapter accent, premium service tier marker. Never as a section bg. |
| Bone (text on dark) | Bone | `#E8DDD0` | Primary text on dark surfaces. Warmer than `#FFFFFF`. Never use pure white. |
| Bone soft | Bone Soft | `#B8AFA3` | Secondary text, body copy. |
| Bone whisper | Bone Whisper | `#6B6259` | Tertiary text, captions, disabled states. |
| Hairline | Hairline | `rgba(232, 221, 208, 0.08)` | Borders, dividers. 8% bone, never grey. |

**Strategic neon**: keep `#FFD700` as a single utility color — only used inside the **admin panel** (operational dashboard, where punchy = clarity) and for **alert states** on the customer site (emergency close, payment failed). Never on hero, nav, or marketing copy.

**Banned**: pure white `#FFFFFF`, pure black `#000000`, the cyberpunk trio (`#00F0FF` / `#BF00FF` / `#FF0080`), Tailwind grey scale, triple gradients.

## Typography

### Pairing

- **Display** — `Fraunces` (free, Google Fonts) — expressive variable serif by Undercase Type. Optical sizing = "soft" for headlines, weight 600. Italic where appropriate. Use generously.
- **Body** — `Manrope` (free, Google Fonts) — geometric sans, clean at all sizes, distinct from Inter. Weight 400 body / 500 emphasis / 700 strong.
- **Mono / tags** — `JetBrains Mono` (free, Google Fonts) — chapter numerals, timestamps, smart-amount displays, kbd styling. Weight 500.

### Scale (modular, ratio 1.25)

| Token | Size | Use |
|---|---|---|
| `--text-display-1` | clamp(2.5rem, 5vw, 5rem) | Page headers (e.g. "The Art of Fades") |
| `--text-display-2` | clamp(2rem, 4vw, 3.75rem) | Section openers |
| `--text-h1` | clamp(1.75rem, 3vw, 2.5rem) | Major headings |
| `--text-h2` | clamp(1.375rem, 2.2vw, 1.875rem) | Sub-headings |
| `--text-h3` | clamp(1.125rem, 1.6vw, 1.375rem) | Card titles |
| `--text-body` | 1rem | 16px body |
| `--text-small` | 0.875rem | Captions, meta |
| `--text-xs` | 0.75rem | Labels, tags |
| `--text-mono-tag` | 0.7rem | All-caps mono labels (CHAPTER 3, RESERVED) |

### Treatment rules

- **Display headlines**: Fraunces, soft optical, weight 600, line-height 1.05, letter-spacing -0.02em. Often italic for emotional weight.
- **Body**: Manrope, weight 400, line-height 1.7, max-width 65ch. Drop caps on the first paragraph of editorial sections (Fraunces, weight 700, 4 lines tall).
- **Mono labels**: JetBrains Mono, all-caps, letter-spacing 0.16em, weight 500.
- **Never** use bold sans for headlines. Bold sans = SaaS. We are not SaaS.

## Spatial system

Vertical rhythm based on 8px. Use 8/16/24/32/48/64/96/128. Section padding `clamp(64px, 8vw, 128px)` vertical, `clamp(24px, 5vw, 80px)` horizontal.

**Reading measure**: body paragraphs cap at `65ch` width regardless of viewport. On ultrawide, text columns lock to comfortable reading; surrounding negative space carries the layout.

## Layout discipline

- **Asymmetric grids** preferred over symmetric. Magazine-style: heavy left, breathing right. Or chapter spreads: text-text-photo-text.
- **No bento grids** unless content semantically demands tile-equality (gallery, product grid).
- **No centered-everything heroes**. Hero asymmetry: type aligned left, image bleed right, ratio 5:7.
- **Section dividers**: thin Hairline rule + Roman numeral (I, II, III) in JetBrains Mono. Not horizontal-line decoration.
- **Negative space** is the loudest design element. If a section feels "empty," it's probably right.

## Motion principles

- **Easing**: `cubic-bezier(0.7, 0, 0.3, 1)` (slow-out-slow-in, no spring, no bounce). 600–800ms for big reveals, 200ms for hovers.
- **No carousel auto-rotate**, no parallax bg, no scroll-jacking, no bouncy springs.
- **Signature motion**: section reveal as horizontal mask wipe (left → right, 700ms). Used once per section first-paint.
- **Hover**: 200ms color transition on links/buttons. Underline reveals from left in 220ms. No scale, no shadow lift.
- **Cursor states**: subtle blend-mode cursor on photos (mix-blend-difference, slight delay).

## Photography direction

- **Editorial, not "results"**. Wide environmental shots. Focus on craft, ambient light, hands-and-tools.
- **Color grading**: warm, slightly desaturated, never crushed black, never blown highlights. Reference: Hodinkee, Esquire UK, Mr. Porter.
- **Banned**: stock-photo "happy customer in chair smiling at camera," Photoshop-glow on hair, before/after slider chevrons.

## Voice (when copy is in scope)

Spare. Confident. Never explanatory. Never "modern" / "clean" / "sleek" / "elevate." If a sentence could appear on a Squarespace template, kill it.

Reference cadence: Hodinkee feature paragraphs. Aesop product copy. Mr Porter Journal essays.

## What stays from current site

- Brand name "Golden Barbers"
- Service catalogue + pricing (Fade £25, Skin Fade £28, etc.) — content untouched per scope
- Booking flow + payment system + admin — backend untouched per scope
- Knowledge chapters as concept (12-chapter learning section)
- Gold as a brand color (now matured to Antique Brass)

## What dies

- Cyber-blue / cyber-purple / cyber-pink utility classes
- Neon gold `#FFD700` as a primary
- "$10,000+ Agency-Level Website" comment in CSS — embarrassing, remove
- "ULTRA PREMIUM FUTURISTIC" framing — nothing about After Hours is futuristic
- Outfit font as primary (becomes optional fallback)
- Bento-style "feature grids" where present
- Triple-gradient overlays
- Scale-bounce hover effects

## Implementation order

1. CSS palette + type system (foundational — propagates everywhere)
2. Hero on `index.html` (sets the tone)
3. Nav + footer (visible on every page)
4. Service cards (`services.html`)
5. About + Contact + Gallery
6. Knowledge chapters (already partly designed — light tweak only)
7. Admin stays as-is (operational dashboard, not customer-facing)
