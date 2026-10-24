# Raven Hsu — Portfolio

A static portfolio about founder programs, behavioral science and software built around observed needs.

**Live:** [ravenhsu1995.github.io](https://ravenhsu1995.github.io/)

## Development

Use Node.js 22.13 or newer. There is no application build step and no runtime package dependency.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4176`. The preview server binds to localhost and disables caching. GitHub Pages serves the same HTML, CSS and native JavaScript modules directly.

```sh
npm run check    # ESLint, Stylelint, formatting and Node tests
npm run format  # Format authored source
```

## Structure

| Path                                                                                                          | Responsibility                                                                      |
| ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `index.html`                                                                                                  | Semantic content, navigation, initial theme bootstrap and accessible control markup |
| `style.css`                                                                                                   | Theme tokens, layout, components, responsive rules and reduced-motion behavior      |
| `js/main.js`                                                                                                  | Composition root; passes shared media preferences and demo frames explicitly        |
| `js/office-hours.js`                                                                                          | Demo scene selection, keyboard tabs and submission feedback                         |
| `js/demo-bridge.js`, `js/demo-state.js`                                                                       | Same-origin iframe messaging, validated payloads and bounded in-memory state        |
| `js/frame-layout.js`                                                                                          | Responsive demo canvases; measurements precede style writes                         |
| `js/motion.js`, `js/workroom.js`                                                                              | Visibility-aware playback, reduced motion and the opening composition               |
| `js/theme.js`, `js/media-viewer.js`, `js/project-preview.js`, `js/besci-gallery.js`, `js/artifact-gallery.js` | Independent page enhancements                                                       |
| `demo/`                                                                                                       | Vendored product-demo snapshot; separate from the portfolio's authored modules      |
| `tests/`                                                                                                      | Message validation/state limits, frame geometry and HTML/resource contracts         |

Core copy and project links are present in HTML. JavaScript enhances the page with scene selection, image enlargement and animation. Keep meaningful content available without animation, preserve keyboard access, and use the existing theme tokens when changing colors.

The small inline theme bootstrap intentionally runs before rendering to avoid a theme flash. It accepts only `light` and `dark`; unavailable storage falls back to the system preference. This is the only portfolio preference persisted in storage.

## Product demo boundary

The office-hours iframe is a compiled snapshot of the original product client, adapted in a separate capture harness. **This repository does not contain that harness or a reproducible build of the product.** Treat `demo/assets/` as generated vendor files; do not edit the minified bundle by hand or run the portfolio formatter over it. Its bundled dependency notices are in `demo/THIRD_PARTY_NOTICES.txt`.

The demo uses fictional records and an in-memory fetch adapter. Its content security policy blocks network connections and form submission. The parent accepts messages only from its known same-origin demo frames, validates the message type, form kind, category and body length, and keeps at most five visitor posts. Reloading the page clears these records. The original application's authentication, database and operational data are outside this site.

AI-assisted development is disclosed in the portfolio. Source organization and checks describe the implementation; they do not imply a different authorship history.

The Travel Fox iframe is a separate, live public itinerary hosted on Vercel. It is outside the in-memory Garage demo bridge and may open public map links. The adjacent captured screen remains available as a static reference.

The 1→0 case leads with the deployed product for human judgement in innovation. Its live iframe loads only when the visitor expands it and unloads on collapse. Screenshot galleries preserve the source images and support enlargement. The separate Deus Studio captures document the local research tools reading Second Brain; their library counts are a snapshot, not product usage metrics. BeSci remains an archived experiment, with its original `#besci` link preserved.

## Verification and deployment

The GitHub Actions check runs `npm ci` and `npm run check` on pushes to `main` and pull requests. It checks authored code; generated demo assets are excluded from source linting and formatting. Tests do not replace browser verification.

Before publishing interaction changes, check:

- Light/dark themes, a narrow phone viewport and desktop layout.
- The opening slider and reset, with reduced motion respected.
- All four demo scenes, arrow/Home/End tab navigation, submission feedback and replay.
- Product and knowledge screenshot selection, BeSci archive selection, image-dialog Escape/focus return, project previews and both live product embeds.

GitHub Pages publishes the repository's `main` branch root. A passing check and a successful Pages deployment are separate signals; verify both after pushing. For an asset release, update the stylesheet and entry-module query versions in `index.html`, version any changed imported modules as well, then verify the live page.

## Assets

Project images document the work shown. Do not replace them with invented product screens or imply that concepts were launched. Font license files are included in `fonts/`; bundled demo license notices remain in `demo/`. No general license is granted for the portfolio text or project photographs.
