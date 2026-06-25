# Memorial — 2026 State Tournament Game Times

An interactive **if/then scenario runner** for the Memorial Little League teams at the
2026 Nebraska State Little League Tournament (Patriot Park, Kearney).

Coaches pick **Majors** or **Minors**, then tap **Won** or **Lost** for each game to
walk Memorial's path through the double-elimination bracket and see exactly when and
where the next game is.

A companion **tournament tracker** (`/bracket/`) holds the full bracket for both
divisions — every team and game. Enter a final score for any game and the winner
advances automatically. Results you enter there feed the scenario runner: once a
Memorial game has a real score, the runner locks it in and shows the actual opponent
for upcoming games (so you can simulate only what hasn't been played yet).

## Live site

Once GitHub Pages is enabled, the runner is the homepage:
`https://rmjh.github.io/memorial-tournament/`

## Files

| File | What it is |
|------|------------|
| `index.html` | Interactive scenario runner (the homepage) |
| `bracket/index.html` | Full interactive bracket + score tracker for both divisions |
| `tournament.js` | Shared bracket data + resolution engine used by both pages |
| `scores.json` | Published scores everyone loads (updated by the scorekeeper — see below) |
| `all-game-times.html` | Full printable table of every possible Memorial game, both divisions |
| `nav.js` | Shared hamburger nav (top-right) injected on every page |
| `manifest.webmanifest`, `sw.js` | PWA manifest + service worker (installable + offline) |
| `icon-192.png`, `icon-512.png`, `maskable-512.png` | App icons |
| `Memorial_Majors_Game_Times.pdf` | One-page Majors reference |
| `Memorial_Minors_Game_Times.pdf` | One-page Minors reference |

## Install as an app (PWA)

Every page links the manifest and registers a service worker, so the site can be installed to
a phone's home screen and opened full-screen, and still works offline at the field (it caches
the pages, then network-first so code and scores stay fresh when there's signal).

- **iPhone (Safari):** Share → **Add to Home Screen**.
- **Android / desktop Chrome:** **Install app** from the address bar / menu.

The top-right **☰ menu** moves between the planner, bracket tracker, printable schedule, and PDFs.

## How the tracker works

- **List & scores** view is chronological with a score box per team; **Bracket** view draws
  the same data as a double-elim bracket. Games involving Memorial are highlighted.
- **GameChanger links** can be pasted per team; a `GC` chip then appears for one-tap access
  to box scores and pitch counts.

### Sharing scores (one scorekeeper, everyone reads)

GitHub Pages is static — it can serve a shared file but can't accept writes. So scoring uses a
**single-scorekeeper** model:

1. The scorekeeper enters scores in the bracket tracker (saved locally in their browser as they go).
2. **Share scores → Export `scores.json`** downloads the current scores.
3. They upload `scores.json` to the **repo root** on GitHub (drag-and-drop → commit).
4. Anyone who opens the page loads `scores.json` automatically — so everyone sees the latest
   published scores on refresh. The published results also feed the scenario planner.

Notes:
- Only the scorekeeper's edits ever change the shared file; viewers' pages stay read-only copies.
- Your own in-progress edits are kept locally and are **not** overwritten by the published file
  (the **Load published** button force-pulls the latest if you want to resync).
- To wipe scores (e.g. after testing): **Clear all scores**, then Export and upload the blank file.

## Notes

- It's a **double-elimination** tournament: two losses and you're out.
- Times are scheduled **start** times and can run early or late (previous game, weather,
  field prep, umpires). Be in the dugout 30 minutes early.
- Majors play on the Championship Field (Diamond #3); Minors on the Loyalty Field (Diamond #4).
- Majors Game 14 shows **3:00 PM** on the bracket tab and **3:30 PM** on the schedule tab —
  worth confirming with the tournament director.

_Built from the official 2026 State Tournament bracket spreadsheet._
