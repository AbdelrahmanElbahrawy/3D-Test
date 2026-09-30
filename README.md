# Bench — a 3D recrystallization lab

An interactive Three.js laboratory based on the practical section (page 7) of **Lab 1+2 — Purification Of Organic Compounds**, supplied by the user.

## Run

Requires Node.js 22.12+ (validated with Node 24).

```sh
npm ci
npm run dev
```

Vite listens on port 5173 and all interfaces. Drag a 3D object or its labeled handle onto the highlighted destination to perform an operation. The source and target cards in the guide offer the same drag-and-drop interaction. Mouse, touchscreen, and pen use Pointer Events; a tap never advances the experiment. Drag empty bench space to orbit; scroll or pinch to zoom. Keyboard users can focus a source and press Space/Enter to pick it up, then focus a target and press Enter to drop. Escape cancels. The protocol button explains the source procedure and simulation assumptions.

## Experiment

Measure 50 mL of water, add three spatulas of the benzoic acid/charcoal sample, heat over a Bunsen burner, filter while hot, cool, perform cold gravity filtration with fresh paper, then dry the crystals on paper. Out-of-order actions explain the required next step. Repeat experiment resets the bench after completion.

Charcoal stays insoluble and is retained during hot filtration. Benzoic acid dissolves with heat and crystallizes on cooling. Heating, filtration, cooling and drying use accelerated times and discrete visual states; this is an educational model, not a quantitative thermodynamic simulation. Temperature readouts are illustrative. The source specifies neither spatula mass nor recovery, so the app does not invent purity or yield measurements.

## Validate

```sh
npm test
npm run build
# With the dev server running and Chromium installed at /usr/bin/chromium:
node scripts/browser-check.mjs
node scripts/model-drag-check.mjs
```

The browser check completes the experiment using real mouse and emulated touchscreen drag gestures, rejects taps and wrong drops, and checks off-bench release, Escape/touch cancellation, keyboard pickup/drop, reset, the protocol dialog, and mobile overflow. A WebGL-capable browser is required for the 3D view. Google Fonts is optional; system fonts are the fallback. No API keys or backend services are needed.

## Deployment

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and tests the app, then deploys the `dist` directory to GitHub Pages on pushes to `main` or manual workflow dispatch. GitHub Pages must be enabled for this repository with **GitHub Actions** as its source. The workflow has only read access to repository content; the deploy job receives Pages write and OIDC permissions.

`vite.config.js` uses relative asset paths so the production build supports the `/3D-Test/` project path and other static hosts. Deployment success and the final public URL must be verified in GitHub Actions; preparing or pushing the workflow alone does not establish that the site is live.
