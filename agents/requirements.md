# Wins Draft - Application Requirements

## Overview

A family NFL "wins draft" tracker. Each season, family members draft NFL teams in a snake-style draft. Throughout the NFL season, the app tracks how many regular-season wins each person's drafted teams accumulate. The person whose portfolio of teams racks up the most combined wins by the end of the season is the winner.

The app has two pages:

1. **Leaderboard** (main page) - Live-updating scoreboard showing each drafter ranked by total wins, with per-team breakdowns, current week game info, and head-to-head matchup highlights.
2. **Draft Picker** - A tool for conducting the draft itself at the start of each season, then saving the results to GitHub.

---

## Data Source

All NFL data comes from ESPN's public APIs. No authentication is required.

### Endpoints Used

| Purpose | URL |
|---|---|
| All 32 NFL teams (logos, colors, abbreviations, names) | `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams` |
| Current week's schedule (games, scores, statuses, week number) | `https://cdn.espn.com/core/nfl/schedule?xhr=1` (current season only — not called for past years) |
| Team season record (wins, losses, overall summary) | `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/{year}/types/2/teams/{teamId}/record` |

### Key Data Shapes

**Team object** (from ESPN teams endpoint): `{ team: { id, abbreviation, displayName, shortDisplayName, nickname, color, alternateColor, logos: [{ href }], links: [{ href }] } }`

**Schedule**: Keyed by date string. Each date contains `games[]`, each game has `competitions[0].competitors[]` with `team.abbreviation`, `score`, `winner` boolean, and `status.type.name` (one of `STATUS_FINAL`, `STATUS_IN_PROGRESS`, `STATUS_SCHEDULED`).

**Record**: `items[]` where `name === 'overall'` contains `summary` (e.g. "10-4") and `stats[]` where `name === 'wins'` has a numeric `value`.

---

## Data Model

### Draft Configuration

Draft assignments are stored in `drafts.json` in the GitHub repo (see Backend section). The file is keyed by year:

```json
{
  "2024": [
    { "name": "Ethan", "teams": ["SF", "KC", "GB", "DAL", "CHI"] },
    { "name": "LEFTOVERS", "teams": ["TEN", "NYJ", "IND", "CAR"] }
  ]
}
```

- Each year typically has 3-5 drafters, each with ~5 teams.
- There is always a special entry with `name: "LEFTOVERS"` containing all 32 NFL teams not drafted by any player. Leftovers are displayed but styled differently (muted/smaller) and excluded from rankings.
- The app defaults to the latest year in `drafts.json` on load (i.e. the highest year key). This means the "current year" advances automatically when a new draft is saved. Supports switching to any year that has draft data.

### All 32 NFL Team Abbreviations

```
ARI, ATL, BAL, BUF, CAR, CHI, CIN, CLE,
DAL, DEN, DET, GB, HOU, IND, JAX, KC,
LAC, LAR, LV, MIA, MIN, NE, NO, NYG,
NYJ, PHI, PIT, SEA, SF, TB, TEN, WSH
```

---

## Page 1: Leaderboard

### Functional Requirements

1. **On load**, fetch all NFL team data and the current week's schedule from ESPN, then compute stats for each drafter based on the current year's draft configuration.

2. **Drafter cards** are displayed in a responsive grid, **sorted by total wins descending** (most wins first).

3. Each drafter card shows:
   - **Rank** (1st, 2nd, 3rd get special color treatment: gold, silver, bronze)
   - **Drafter name** (uppercase, bold display font)
   - **Total combined wins** across all their teams
   - **Win bar** - a horizontal progress bar showing wins relative to the leader (leader = 100% width)
   - **Team list** sorted by individual team wins descending, each showing:
     - Team logo (50x50, from ESPN)
     - Team short display name
     - Individual team win count
     - Team season record (e.g. "10-4")
     - Current/next game info (see below)
     - Team colors used as card background gradient (primary color + alternate color)
     - Team cards link to the team's ESPN clubhouse page

4. **Game status display** for each team's current-week game (in-season only):
   - **Scheduled**: Show opponent abbreviation, day of week, date, and time
   - **In Progress**: Show "LIVE" badge (pulsing animation), current score with both team abbreviations
   - **Final**: Show "Final:" with score, winning team's score bolded
   - **Bye Week**: Show "Bye Week" with muted styling
   - **Offseason**: When viewing a completed season (no active schedule data), hide game info entirely and just show the team's final win-loss record. Do not show "Bye Week" for every team.

5. **Head-to-head matchup detection**: When two drafted teams (belonging to different players) play each other in the current week:
   - Both team cards get a gold highlight border
   - An "H2H" badge appears showing "vs [opponent's drafter name]"
   - This only applies to teams owned by actual drafters (not LEFTOVERS)

6. **LEFTOVERS card**: Always displayed last (after ranked players), with visually muted/smaller styling. No rank number. Not included in the ranking sort.

7. **Year selector**: A dropdown in the footer lets users switch between available years. Changing the year reloads all data from ESPN for that season and re-renders with that year's draft configuration.

8. **Current week badge**: Displayed in the header showing "Wk {N}" for the current NFL week (only shown when viewing the latest year and the NFL season is active — not shown in offseason or for past years).

9. **Header**: Shows "Loyd Family {year} Wins" with a sticky header that stays at top on scroll. Red-to-orange gradient background with diagonal stripe texture.

10. **Footer**: Contains a link to the Draft Picker page and the year selector dropdown.

---

## Page 2: Draft Picker

### Functional Requirements

1. **Player management**: Users add drafter names via a text input. Players appear as removable tags. Removing a player also removes all their draft picks.

2. **Team grid**: All 32 NFL teams displayed in a responsive card grid. Each card shows:
   - Team logo (48x48)
   - Full team name
   - Previous year's win total (for draft strategy context)
   - Current season record

3. **Draft mechanics**:
   - A "current picker" indicator shows whose turn it is
   - Clicking a team card assigns it to the current picker
   - Turn automatically advances to the next player using **snake draft order** (e.g. with 3 players: 1-2-3-3-2-1-1-2-3-...)
   - Selected teams can be hidden from the grid (toggle checkbox) or shown grayed out
   - Teams cannot be selected twice

4. **Draft board sidebar**: Sticky sidebar showing each player's picks grouped by player, with:
   - Pick order number
   - Team logo (24x24)
   - Team abbreviation

5. **Sorting**: Teams can be sorted by:
   - Most wins (previous year) - default
   - Least wins (previous year)
   - Team name A-Z
   - Team name Z-A

6. **Save draft to GitHub**: A button saves the completed draft directly to `drafts.json` in the GitHub repo via the GitHub Contents API (see Backend section). The user enters a GitHub personal access token in a text input before saving. Automatically includes a LEFTOVERS entry for any undrafted teams. This creates a git commit and triggers a site rebuild.

7. **Undo last pick**: A button to undo the most recent draft pick. Returns the team to the available pool and rewinds the turn order by one step.

8. **Previous year wins**: For draft context, shows each team's win total from the prior NFL season. Falls back to a hardcoded lookup table if the ESPN API doesn't have historical data.

9. **Navigation**: Link back to the main leaderboard page.

---

## Technical Architecture

### Stack

- **Vite** for dev server and build tooling (no framework, no bundler config needed beyond defaults)
- **Lit** (web components library) for all UI components across the entire app
- **GitHub-backed storage** - draft data stored as a JSON file in the repo, read/written via GitHub API (see Backend section below). Repo owner/name are configured as constants in the controller (single-owner app, not multi-tenant)
- **No routing library** - separate HTML entry points per page
- **No CSS framework** - all custom CSS via Lit's scoped styles, with CSS custom properties for theming and team colors

### Module Architecture

- A shared data/controller layer handles ESPN API calls, GitHub API calls, draft config, and team lookups — imported by all pages
- All UI is built with Lit web components — reusable primitives (buttons, cards, badges, etc.) shared across pages, composed into page-level components

### File Structure

Exact file layout TBD, but the general structure:

```
drafts.json                # Draft configuration data for all years (read/written via GitHub API)
index.html                 # Leaderboard page entry
picks.html                 # Draft picker page entry
design.html                # Design guidelines page entry (development only)
src/
  controller.js            # Shared data layer: ESPN API, GitHub API, draft config, team lookups
  components/              # Reusable Lit components (buttons, cards, badges, text, etc.)
  pages/                   # Page-level Lit components (leaderboard, draft picker)
```

### Key Design Decisions

1. **Draft data lives in a JSON file in the GitHub repo**, read at runtime via the GitHub raw content URL and written from the draft picker via the GitHub Contents API. No server, no database — GitHub is the backend.
2. **All API calls happen client-side** directly to ESPN and GitHub. No proxy, no caching layer.
3. **All UI is Lit web components.** Reusable primitives (buttons, cards, badges, text styles) are built first, then composed into page-level components.
4. **Team colors from ESPN** are used as CSS custom properties (`--team-color`, `--alternate-color`) to dynamically style each team's card with that team's actual brand colors.
5. **PWA-lite**: Has apple-touch-icon and mobile web app meta tags for home screen installation, but no service worker or manifest.

---

## Backend: GitHub as a Data Store

### Overview

Draft configuration is stored as a `drafts.json` file in the GitHub repo. There is no server — GitHub itself is the database. The file is read via GitHub's raw content URL (no auth needed for public repos) and written via the GitHub Contents API (requires a personal access token, used only from the draft picker).

### Data File: `drafts.json`

Stored at the repo root. Contains all draft data for all years:

```json
{
  "2024": [
    { "name": "Ethan", "teams": ["SF", "KC", "GB", "DAL", "CHI"] },
    { "name": "Mom", "teams": ["HOU", "MIA", "CIN", "PHI", "JAX"] },
    { "name": "LEFTOVERS", "teams": ["TEN", "NYJ", "IND", "CAR"] }
  ],
  "2025": [
    ...
  ]
}
```

### Reading Draft Data (Leaderboard)

- Fetch `drafts.json` from the repo's raw content URL (e.g. `https://raw.githubusercontent.com/{owner}/{repo}/main/drafts.json`)
- No authentication required (public repo)
- On first load, cache the response in `localStorage` keyed by year
- On subsequent visits, read from `localStorage` — draft data only changes once per year so the cache is essentially permanent
- If `localStorage` has data for the selected year, skip the fetch entirely
- Provide a manual "refresh" mechanism or cache-bust when the year changes in case new data was pushed

### Writing Draft Data (Draft Picker)

- When the draft is complete, the draft picker writes the results directly to `drafts.json` in the repo via the **GitHub Contents API**
- Endpoint: `PUT /repos/{owner}/{repo}/contents/drafts.json`
- Requires a GitHub **personal access token** (fine-grained, scoped to repo contents write permission)
- The token is entered by the user in the draft picker UI (a simple text input) — it is never stored persistently or committed to code
- Flow:
  1. `GET /repos/{owner}/{repo}/contents/drafts.json` to retrieve the current file's `sha` (required for updates)
  2. Merge the new year's draft data into the existing JSON
  3. `PUT` the updated file back with the `sha`, a commit message (e.g. "Add 2026 draft picks"), and the base64-encoded content
- This creates a real git commit in the repo, which triggers a site rebuild if using GitHub Pages / Netlify
- This replaces the old "copy to clipboard and paste into source code" workflow

### Caching Strategy

| Data | Cache Location | TTL | Invalidation |
|---|---|---|---|
| Draft config (`drafts.json`) | `localStorage` | Indefinite (per year) | Manual refresh or year change |
| ESPN team data (logos, colors, names) | `localStorage` | Season-long (teams don't change mid-season) | New season / manual clear |
| ESPN schedule/scores | Not cached | N/A | Fetched fresh each visit (scores change weekly) |

### Security Notes

- The GitHub token is only needed on the draft picker page, only once per year, and only by the person running the draft
- The token should be fine-grained with minimal scope: only "Contents: Read and write" on the single repo
- The token is entered at draft time and held in memory only — never saved to localStorage, cookies, or code
- All other users (family members checking scores) never need a token — reading is unauthenticated

---

## Development Approach

### Phase 1: Design Guidelines Page

Before building the real app, create a `design.html` page that serves as a living component reference. This page:

- Renders every reusable Lit component in isolation with hardcoded/placeholder data (no API calls)
- Includes: buttons, cards, badges (rank, live, H2H), text styles (headings, body, muted), team card, drafter card, win bar, loading states, input fields, dropdowns, player tags
- Shows component variations and states (e.g. button default/hover/disabled, team card selected/unselected, game status variants)
- Acts as the design approval checkpoint — visual direction is iterated here before wiring up real data
- Uses the same Lit components that will be imported by the real pages, so nothing is throwaway

### Phase 2: Implement Real Pages

Once the design guidelines page looks right, build the leaderboard and draft picker pages by composing the same components with real data from ESPN and GitHub APIs.

---

## Visual Design

Dark theme, sporty/bold aesthetic. Mobile-responsive. Design details left open for a fresh take.

---

## Edge Cases and Behaviors

1. **Year with no data**: If a user somehow selects a year with no draft data, show an alert and don't switch.
2. **ESPN API failure**: Loading screen shows; if API calls fail the app stays on the loading screen with no explicit error handling on the leaderboard (draft picker shows "Error loading teams. Please refresh.").
3. **Bye weeks**: Teams with no game in the current week's schedule show "Bye Week" instead of game info.
4. **Duplicate team prevention**: In the draft picker, clicking an already-drafted team does nothing.
5. **Team link target**: Each team card on the leaderboard links to the team's ESPN clubhouse page (index 3 in the team's `links` array from the ESPN API).
6. **Offseason / completed seasons**: If the schedule endpoint returns no games (offseason) or the selected year is a past season, display final records only — no game info, no "Bye Week" labels.
