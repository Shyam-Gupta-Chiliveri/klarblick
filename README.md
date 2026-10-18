# Klarblick

Klarblick (AI Hackathon) — patient-facing translator for German discharge letters. Built for the CGM / WHU Innovation Career Hub challenge.

[**Open Klarblick**](http://localhost:3000) · [**Open repository**](https://github.com/Shyam-Gupta-Chiliveri/klarblick)

Public website: [https://shyam-gupta-chiliveri.github.io/klarblick/](https://shyam-gupta-chiliveri.github.io/klarblick/)

**No medical advice.** Every date, dose and phone number must come from the letter. Inference is designed for [TrustedTokens](https://trustedtokens.eu/docs/) in the EU (or another OpenAI-compatible endpoint in `.env.local`).

## GitHub Pages vs the live app

The Pages site is a static landing. Next.js App Router routes such as `/api/analyze` need Node and cannot run on GitHub Pages. Keep the API key in `.env.local` only. Never commit it, never paste it into GitHub or a public demo.

## Run

```bash
cp .env.example .env.local   # paste your own TrustedTokens / OpenAI-compatible key
npm install
npm run dev
```

Then [**Open Klarblick**](http://localhost:3000).

## What the jury sees

1. Upload a letter (or a CGM sample).
2. **Worry compass** — follow-up urgency, not how sick someone is.
3. One sentence: what the letter is about.
4. **FAR** — Fristen, Aufgaben, Risiken (including decline/object if the letter allows it).
5. Plain-language summary → 1:1 details with original quotes → FAQ → grounded AI chat.
6. Accessibility: listen, print, large type, DE/EN.

## Business

Sold to statutory health insurers as a digital Nachsorge service after § 39 SGB V discharge management, launched from CGM hospital software so the letter leaves the ward already understood.
