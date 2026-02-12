# Our Moments Quiz (GitHub Pages)

A static, mobile-first quiz website built with Vite + React + TypeScript.

## Features

- 5 chapters x 10 questions loaded from JSON (`src/data/questions.json`).
- Kahoot-like flow: intro -> chapter select -> question loop -> chapter summary -> final reveal.
- Score + progress tracking with answer lock and immediate feedback.
- Optional timer scoring and option shuffle (configurable in `src/data/settings.json`).
- Persistent progress in `localStorage` + full restart reset.
- Theme switcher with 3 dark presets (`Темна романтика`, `Темний персик`, `Смарагдова ніч`) and saved preference.
- Animated UI: falling themed hearts background, lively button interactions, and floating moment cards.
- Final gift/reveal screen with optional easter egg threshold.
- Static deployment via GitHub Actions to GitHub Pages.

## Project Structure

- `public/images` - chapter/reveal visuals (replace with your optimized images).
- `public/audio` - optional short audio assets.
- `src/data/chapters.json` - chapter metadata.
- `src/data/questions.json` - all quiz questions.
- `src/data/settings.json` - quiz behavior toggles.
- `src/data/reveal.json` - final gift/reveal content.
- `src/components/*` - UI screens/components.
- `src/App.tsx` - state machine and app flow.
- `vite.config.ts` - auto `base` handling for GitHub Pages subpath.
- `.github/workflows/deploy.yml` - build + deploy workflow.

## Local Development

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build
npm run preview
npm run test
npm run lint
```

## Content Editing

### Update chapters

Edit `src/data/chapters.json`.

### Update questions

Edit `src/data/questions.json`.

Each question object supports:

- `id`
- `chapterId`
- `text`
- `options[]`
- `correctOptionIndex`
- `explanation` (optional)
- `momentCard` (optional): `{ image, caption, audio? }`

### Update reveal / gift

Edit `src/data/reveal.json`.

- Main reveal text/image/link
- Easter egg threshold: `easterEgg.minScore`

### Update behavior toggles

Edit `src/data/settings.json`.

- `timerEnabled`
- `questionTimeLimitSeconds`
- `timerBonusMaxPoints`
- `shuffleOptions`
- `basePointsPerCorrect`

### Media paths

Use relative paths like `images/your-file.webp` in JSON so assets respect `import.meta.env.BASE_URL` on Pages.

## GitHub Pages Deployment

1. Push this repository to GitHub.
2. In GitHub repository settings, open **Settings -> Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Ensure your default deploy branch is `main` (or adjust `.github/workflows/deploy.yml`).
5. Push to `main` to trigger deployment.

The workflow does:

1. Checkout repository
2. Install dependencies
3. Build app
4. Upload Pages artifact
5. Deploy to GitHub Pages

## Notes for Pages Limits

- Keep media optimized (WebP/compressed) to stay under Pages limits.
- Prefer short audio clips and compressed images.
- Do not store private/sensitive content in this public site.
