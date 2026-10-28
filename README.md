# BloxIdea Studio

BloxIdea Studio turns catchy Roblox game names into practical starter concepts and expandable game design blueprints. It is offline-first: the title generator and template blueprint engine work without API keys.

## Features

- Weighted title templates with naming styles, genres, keywords, and absurdity control.
- Quick concepts with a gameplay loop, mechanics, progression, signature hook, difficulty, and heuristic scores.
- Expandable offline blueprint including onboarding, world design, Roblox client/server notes, MVP milestones, and risks.
- Optional Gemini-powered blueprint expansion through a server-side route; the API key stays on the server.
- Favorites stored in browser localStorage.
- Markdown and JSON downloads.
- Responsive dark interface.

## Requirements

- Node.js 20 or newer recommended.
- npm.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Optional AI

Copy `.env.example` to `.env.local` and configure:

```env
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=gemini-2.5-flash-lite
```

Restart the development server after changing environment variables. AI is only called when the user enables AI expansion and expands a concept. Without a key, offline generation still works.

Gemini free-tier availability and quotas depend on the model and Google account. Check current limits in Google AI Studio. Do not commit `.env.local`; never use a `NEXT_PUBLIC_` prefix for the key.

## Quality checks

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

## Deploy to Vercel

1. Create a Git repository and push this project to GitHub.
2. Sign in to Vercel and import the GitHub repository.
3. Keep the detected Next.js build settings.
4. For offline-only use, deploy without environment variables.
5. For AI expansion, add `GEMINI_API_KEY` and optionally `GEMINI_MODEL` in Vercel Project Settings → Environment Variables. Add them to the relevant environments, then redeploy.
6. Open the deployment URL and test both offline generation and blueprint expansion.

Do not expose the API key through a `NEXT_PUBLIC_` variable.

## Data and limitations

- Favorites and settings live in localStorage. They do not sync between browsers or devices.
- Offline generation uses curated templates and heuristics. It is not a predictor of popularity.
- AI output is validated against a schema, but generated design documents still need human review.
- The included API route has basic input and output validation. Production use with public AI access should add a shared rate-limiting service and, if necessary, bot protection. In-memory rate limiting alone is not reliable across serverless instances.
- Title availability on Roblox is not checked.
- Development estimates are rough planning assumptions.

## License

Choose a license before publishing the repository publicly.
