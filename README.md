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
| `all-game-times.html` | Full printable table of every possible Memorial game, both divisions |
| `Memorial_Majors_Game_Times.pdf` | One-page Majors reference |
| `Memorial_Minors_Game_Times.pdf` | One-page Minors reference |

## How the tracker works

- **Scores are saved per browser/device** (`localStorage`) — nothing is uploaded or shared
  between phones. Each person tracking keeps their own copy.
- **List & scores** view is chronological with a score box per team; **Bracket** view draws
  the same data as a double-elim bracket. Games involving Memorial are highlighted.
- **GameChanger links** can be pasted per team; a `GC` chip then appears for one-tap access
  to box scores and pitch counts.

## Notes

- It's a **double-elimination** tournament: two losses and you're out.
- Times are scheduled **start** times and can run early or late (previous game, weather,
  field prep, umpires). Be in the dugout 30 minutes early.
- Majors play on the Championship Field (Diamond #3); Minors on the Loyalty Field (Diamond #4).
- Majors Game 14 shows **3:00 PM** on the bracket tab and **3:30 PM** on the schedule tab —
  worth confirming with the tournament director.

_Built from the official 2026 State Tournament bracket spreadsheet._
