# PROGRESS.md — Taurek AI

## Status legend
| Emoji | Status |
|-------|--------|
| ⚪ | To Do |
| 🟡 | Testing |
| 🟢 | Done |

---

## Etap 1 — Project Setup

| # | Substep | Status | Dependencies |
|---|---------|--------|--------------|
| 1.1 | Vite + React + TypeScript init | 🟢 Done | — |
| 1.2 | File structure created (`src/`, `components/`) | 🟢 Done | 1.1 |
| 1.3 | `types.ts` — `ChatMessage`, `Language`, `Role`, constants | 🟢 Done | 1.1 |
| 1.4 | `package.json` dependencies installed | 🟢 Done | 1.1 |

---

## Etap 2 — UI Components (shell)

| # | Substep | Status | Dependencies |
|---|---------|--------|--------------|
| 2.1 | `App.tsx` — state setup (`messages`, `language`, `ecoPoints`, `isLoading`, `input`) | 🟢 Done | 1.3 |
| 2.2 | `ChatWindow.tsx` — renders message list + empty state + typing indicator | 🟢 Done | 1.3 |
| 2.3 | `Message.tsx` — renders single chat bubble (user / assistant) | 🟢 Done | 1.3 |
| 2.4 | `QuickPrompts.tsx` — 5 shortcut buttons, calls `onSelect` | 🟢 Done | 1.3 |
| 2.5 | `EcoPoints.tsx` — static display of points + level label | 🟢 Done | 1.3 |
| 2.6 | `App.tsx` — input bar (field + send button) | 🟢 Done | 2.1 |
| 2.7 | `App.tsx` — header with language switcher buttons | 🟢 Done | 2.1 |

---

## Etap 3 — Localization (UI strings)

| # | Substep | Status | Dependencies |
|---|---------|--------|--------------|
| 3.1 | `LANGUAGE_LABELS` (🇵🇱 / 🇬🇧 / ⚡) in `types.ts` | 🟢 Done | 1.3 |
| 3.2 | `QUICK_PROMPTS` per language (polish / english / silesian) | 🟢 Done | 1.3 |
| 3.3 | `EMPTY_STATE` per language in `ChatWindow.tsx` | 🟢 Done | 2.2 |
| 3.4 | `TYPING_LABEL` per language in `ChatWindow.tsx` | 🟢 Done | 2.2 |
| 3.5 | Input placeholder per language in `App.tsx` | 🟢 Done | 2.6 |

---

## Etap 4 — Claude API Integration ⭐ CORE

| # | Substep | Status | Dependencies |
|---|---------|--------|--------------|
| 4.1 | `.env` file with `VITE_ANTHROPIC_API_KEY` | 🟢 Done | 1.1 |
| 4.2 | `@anthropic-ai/sdk` installed + `dangerouslyAllowBrowser: true` | 🟢 Done | 4.1 |
| 4.3 | System prompt function `SYSTEM_PROMPT(language)` | 🟢 Done | 1.3 |
| 4.4 | `sendMessage` — real Claude API call with full message history | 🟢 Done | 4.1, 4.3 |
| 4.5 | Response from Claude appended to `messages` state | 🟢 Done | 4.4, 2.2 |
| 4.6 | `isLoading` managed around API call (typing indicator shows) | 🟢 Done | 4.4, 2.2 |
| 4.7 | Manual test — send message, get real Taurek response | 🟢 Done | 4.5, 4.6 |
| 4.8 | Context memory test — follow-up question uses earlier message | ⚪ To Do | 4.7 |

---

## Etap 5 — Eco Points System

| # | Substep | Status | Dependencies |
|---|---------|--------|--------------|
| 5.1 | Parse `[ECO+1]` token from Claude response | 🟢 Done | 4.5 |
| 5.2 | Strip `[ECO+1]` from displayed message text | 🟢 Done | 5.1 |
| 5.3 | Increment `ecoPoints` counter in state | 🟢 Done | 5.1 |
| 5.4 | `EcoPoints.tsx` — progress bar toward next level | 🟢 Done | 5.3 |
| 5.5 | Animated `+1` float on eco point earned | 🟢 Done | 5.3 |
| 5.6 | Level badge update (`Śląski Oszczędny` → `Energetyk` → `Mistrz Prądu`) | 🟢 Done | 5.3 |
| 5.7 | Test — ask energy question → ECO+1 awarded + animated | 🟢 Done | 5.5, 5.6 |

---

## Etap 6 — CSS & Styling (TAURON brand)

| # | Substep | Status | Dependencies |
|---|---------|--------|--------------|
| 6.1 | Remove default Vite CSS, set TAURON colors (`#EC008C`, `#656263`) | 🟢 Done | 2.1 |
| 6.2 | `.app` layout — full-height flex column | 🟢 Done | 6.1 |
| 6.3 | `.header` styles — title + controls row | 🟢 Done | 6.1, 2.7 |
| 6.4 | `.chat-window` — scrollable message area | 🟢 Done | 6.1, 2.2 |
| 6.5 | `.message` bubbles — user (right, magenta) / assistant (left, gray) | 🟢 Done | 6.1, 2.3 |
| 6.6 | `.message` — smooth fade-in animation on arrival | 🟢 Done | 6.5 |
| 6.7 | `.quick-prompts` row of buttons | 🟢 Done | 6.1, 2.4 |
| 6.8 | `.input-bar` — input field + send button | 🟢 Done | 6.1, 2.6 |
| 6.9 | `.lang-switcher` — active state highlight | 🟢 Done | 6.3 |
| 6.10 | Mobile-first responsive layout (max-width: 768px) | 🟢 Done | 6.2–6.9 |
| 6.11 | Visual test — looks correct on desktop + mobile | 🟡 Testing | 6.10 |

---

## Etap 7 — Demo Prep

| # | Substep | Status | Dependencies |
|---|---------|--------|--------------|
| 7.1 | `vite build` — production build passes with no errors | 🟢 Done | 4–6 |
| 7.2 | Demo script test — 3 min flow works end-to-end | ⚪ To Do | 4.8, 5.7, 6.11 |
| 7.3 | Silesian mode test — audience wow-factor verified | ⚪ To Do | 4.7, 3.2 |
| 7.4 | Language switch test — EN / PL / Silesian all work | ⚪ To Do | 4.7, 3.1–3.5 |
| 7.5 | Edge case: empty input, double-send, very long response | ⚪ To Do | 4.7 |
