# form X Interiors — Next.js landing page

An animated, single-page landing site for **form X Interiors** (Hyderabad design-and-build
studio), built in Next.js (App Router). It ports and unifies the reference HTML mockups and
the PPT storyboard into one production app.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## What's inside

Section order follows the PPT storyboard:

1. **Logo intro animation** — `form ✕` lockup animates and docks into the menu button.
2. **Scroll-scrubbed film hero** — a live canvas "dolly through a room" scrubs as you scroll
   (drop an mp4 path into `VIDEO_SRC` in `lib/formx.js` to swap in real footage). Reactive
   orange "slats" field follows the cursor.
3. **DESIGN ✕ BUILD ✕ DELIVER** marquee — speeds up / reverses with scroll velocity.
4. **Offers** — Design / Build / Deliver, priced up front.
5. **Estimator** — pick a project + unit, tap rooms on the floor plan, live itemised quote.
6. **Titanium / Platinum** tier switch — rewrites the quote, the cost split and the spec table.
7. **Cost anatomy** — interactive spend breakdown, tied to the live quote.
8. **Selected projects** — tilt cards that open a full-screen case study overlay.
9. **Rethink · ten-year wear** — canvas comparison of cheap vs. proper materials over 10 years.
10. **Parametric wall** — live CNC fin model; sliders + material change the price; save as PNG.
11. **Process** — draggable, snapping four-stage timeline.
12. **Testimonials** — draggable review carousel with expandable project details.
13. **Book a consultation** — two-step form → WhatsApp-ready summary.
14. **Contact + footer.**

## Structure

- `app/layout.js` — fonts (Bricolage Grotesque / Instrument Sans / DM Mono) + metadata.
- `app/globals.css` — the full design system (tokens, all section styles).
- `app/page.js` — all section markup (mirrors the reference DOM).
- `lib/formx.js` — every interaction/animation, wired on mount and torn down on unmount.

Respects `prefers-reduced-motion`. Custom cursor + magnetic buttons on fine pointers only.

## Notes

Phone numbers, emails, project names, rates and reviews are placeholders from the mockups —
swap the data blocks in `lib/formx.js` (`PLANS`, `UNITS`, `TIERS`, `COST`, `T`) and the copy
in `app/page.js` for the real content.
