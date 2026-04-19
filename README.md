# Taurek AI ⚡

Built for **AI Challenge powered by TAURON**.

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Add your Anthropic API key
echo "VITE_ANTHROPIC_API_KEY=your_key_here" > .env

# 3. Run
npm run dev
# → http://localhost:5173
```

---

---

## What is it?

Taurek is an AI-powered energy assistant that helps TAURON customers with:

- Understanding electricity bills and tariffs (G11 / G12)
- Getting personalized energy-saving tips
- Estimating appliance consumption
- Choosing the right tariff plan

The twist? Taurek speaks **Silesian dialect** — because energy advice hits different when your assistant says *"Ôj bajtel, twój sztrom to małowiela!"*

---

## Features

| Feature | Description |
|---|---|
| 🌐 3 language modes | Polski · English · Ślōnski dialect |
| 🌱 Eco Points | Earn points for asking about energy saving |
| ⚡ 5 quick prompts | One-tap common questions |
| 📱 Mobile-first | Works on any device, no install needed |

---

## How Eco Points work

When Taurek detects an energy-saving question, Claude returns `[ECO+1]` in the response. JS parses it, increments the counter, and triggers a reward animation. Simple, effective, gamified.

---

*Taurek AI — bo sztrom to nie żarty.* ⚡