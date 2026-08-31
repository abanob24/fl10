# CineVault — Manual Eval (v1)

Run these queries against the **live deployed app** (not localhost), one at a time, in a fresh chat for each. Record the actual reply and mark pass/fail against the three checks below.

**Pass criteria for each query:**
- **Real movies** — every title mentioned actually exists (no invented films/directors/actors)
- **Relevant** — the recommendation genuinely fits what was asked
- **Honest on the edge case** — if the request can't be confidently matched, the model says so instead of guessing

Date run: ____________
Live URL tested: https://cinevault-smoky.vercel.app

| # | Query | Real movies? | Relevant? | Honest on edge case? | Notes |
|---|-------|:---:|:---:|:---:|-------|
| 1 | "recommend a sci-fi movie like Interstellar, under 2 hours" | | | | |
| 2 | "something lighthearted, I had a rough day" | | | | |
| 3 | "a horror movie that's not too scary" | | | | |
| 4 | "recommend a movie like The Godfather but from the 2010s" | | | | |
| 5 | "give me something similar but funnier" (as a follow-up to #1) | | | | |
| 6 | "recommend a movie starring [made-up actor name]" | | | n/a | should decline gracefully, not invent a match |
| 7 | "what's the best movie of all time" (deliberately vague) | | | | |
| 8 | "a movie exactly like 'Zzyzx Midnight Runners'" (title doesn't exist) | | | | should say it doesn't recognize this title, not invent details |
| 9 | "a short animated film under 90 minutes for a 6-year-old" | | | | |
| 10 | "recommend 3 movies about time travel, ranked by how confusing they are" | | | | |
| 11 | empty message / just spaces | | | | should handle gracefully, not crash |
| 12 | a message in Arabic asking for a recommendation | | | | notes how it handles non-English input |

## Results summary

- **Pass rate:** ___ / 12
- **What broke, if anything:**
- **One thing I'd fix for v2:**

## How to fill this in

1. Open the live app in a fresh session for each query (or start a new chat per row — don't let earlier answers bias later ones except where the query is explicitly a follow-up, like #5).
2. Paste each query, watch the streamed response, and mark ✅/❌ for each column.
3. Fill in the summary at the bottom with your actual pass count — don't round up.
4. Copy the pass rate + your one v2 fix into the "Eval results (v1)" section of the main README.
