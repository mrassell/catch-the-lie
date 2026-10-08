# Catch the Lie

A classroom detective game for 6th graders. An AI "witness" explains a topic and slips in a few false or one-sided claims. Students circle the lies, ask questions and check sources.

Built for T-566 Learning Design for All (HGSE).

## Run locally

```bash
npm install
npm run dev
```

## Edit the example

The example lives in `cases.js`. Add a `lie` field to any line that should be caught.

## Deploy

Import the repo on Vercel. It detects Vite automatically (build: `npm run build`, output: `dist`).
