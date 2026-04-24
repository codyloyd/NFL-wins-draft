import bundledDrafts from '../drafts.json';
import { MOCK_SCHEDULE, MOCK_WEEK, MOCK_RECORDS } from './mock.js';

const USE_MOCK = false;

const REPO_OWNER = 'codyloyd';
const REPO_NAME = 'NFL-wins-draft';

const ALL_NFL_TEAMS = [
  'ARI','ATL','BAL','BUF','CAR','CHI','CIN','CLE',
  'DAL','DEN','DET','GB','HOU','IND','JAX','KC',
  'LV','LAC','LAR','MIA','MIN','NE','NO','NYG',
  'NYJ','PHI','PIT','SEA','SF','TB','TEN','WSH',
];

export async function fetchTeams() {
  const cached = localStorage.getItem('wd-teams');
  if (cached) return JSON.parse(cached);

  const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams');
  const json = await res.json();
  const teams = json.sports[0].leagues[0].teams;
  localStorage.setItem('wd-teams', JSON.stringify(teams));
  return teams;
}

export async function fetchSchedule() {
  if (USE_MOCK) return { schedule: MOCK_SCHEDULE, week: MOCK_WEEK };

  try {
    const res = await fetch('https://cdn.espn.com/core/nfl/schedule?xhr=1');
    const json = await res.json();
    const content = json.content;
    const seasonType = content.parameters.seasontype;
    if (seasonType !== 2) return { schedule: null, week: null };
    return {
      schedule: content.schedule,
      week: content.parameters.week,
    };
  } catch {
    return { schedule: null, week: null };
  }
}

export async function fetchRecord(teamId, year, abbr) {
  if (USE_MOCK && abbr && MOCK_RECORDS[abbr]) {
    return MOCK_RECORDS[abbr];
  }

  try {
    const res = await fetch(
      `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${year}/types/2/teams/${teamId}/record`
    );
    const json = await res.json();
    const overall = json.items.find(i => i.name === 'overall');
    if (!overall) return { wins: 0, summary: '0-0' };
    const winStat = overall.stats.find(s => s.name === 'wins');
    return {
      wins: winStat ? winStat.value : 0,
      summary: overall.summary,
    };
  } catch {
    return { wins: 0, summary: '0-0' };
  }
}

export async function fetchDrafts() {
  const cached = localStorage.getItem('wd-drafts');
  if (cached) return JSON.parse(cached);

  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/drafts.json`
    );
    if (res.ok) {
      const json = await res.json();
      localStorage.setItem('wd-drafts', JSON.stringify(json));
      return json;
    }
  } catch { /* fall through to bundled data */ }

  localStorage.setItem('wd-drafts', JSON.stringify(bundledDrafts));
  return bundledDrafts;
}

export async function saveDraftToGitHub(year, drafters, token) {
  const headers = {
    Authorization: `token ${token}`,
    'Content-Type': 'application/json',
  };

  const getRes = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/drafts.json`,
    { headers }
  );
  const getCurrent = await getRes.json();
  const existing = JSON.parse(atob(getCurrent.content));

  existing[String(year)] = drafters;

  const putRes = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/drafts.json`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Add ${year} draft picks`,
        content: btoa(JSON.stringify(existing, null, 2)),
        sha: getCurrent.sha,
      }),
    }
  );

  if (putRes.ok) {
    localStorage.setItem('wd-drafts', JSON.stringify(existing));
    return true;
  }
  return false;
}

export function clearCache() {
  Object.keys(localStorage)
    .filter(k => k.startsWith('wd-'))
    .forEach(k => localStorage.removeItem(k));
}

export function getLatestYear(drafts) {
  return Math.max(...Object.keys(drafts).map(Number));
}

export function getCurrentWeekGame(schedule, teamAbbr) {
  if (!schedule) return null;
  for (const dateKey of Object.keys(schedule)) {
    const games = schedule[dateKey].games;
    if (!games) continue;
    for (const game of games) {
      const home = game.competitions[0].competitors.find(c => c.homeAway === 'home');
      const away = game.competitions[0].competitors.find(c => c.homeAway === 'away');
      if (
        home.team.abbreviation === teamAbbr ||
        away.team.abbreviation === teamAbbr
      ) {
        return game;
      }
    }
  }
  return null;
}

export function findHeadToHeadMatchups(stats) {
  const teamToPlayer = new Map();
  for (const drafter of stats) {
    if (drafter.name === 'LEFTOVERS') continue;
    for (const team of drafter.teams) {
      teamToPlayer.set(team.abbreviation, drafter.name);
    }
  }

  const matchups = new Map();
  for (const drafter of stats) {
    if (drafter.name === 'LEFTOVERS') continue;
    for (const team of drafter.teams) {
      if (!team.nextGame) continue;
      const comp = team.nextGame.competitions[0];
      const home = comp.competitors.find(c => c.homeAway === 'home');
      const away = comp.competitors.find(c => c.homeAway === 'away');
      const opponentAbbr =
        home.team.abbreviation === team.abbreviation
          ? away.team.abbreviation
          : home.team.abbreviation;

      const opponentOwner = teamToPlayer.get(opponentAbbr);
      if (opponentOwner && opponentOwner !== drafter.name) {
        const gameId = team.nextGame.id;
        if (!matchups.has(gameId)) {
          matchups.set(gameId, {
            player1: drafter.name,
            team1: team.abbreviation,
            player2: opponentOwner,
            team2: opponentAbbr,
          });
        }
      }
    }
  }
  return matchups;
}

function resolveTeam(allTeams, abbr) {
  for (const entry of allTeams) {
    const t = entry.team;
    if (t.abbreviation === abbr) return t;
  }
  return null;
}

export async function loadAllStats(drafts, year, allTeams, schedule) {
  const draftersForYear = drafts[String(year)];
  if (!draftersForYear) return [];

  const results = [];

  for (const drafter of draftersForYear) {
    const teams = [];

    const teamPromises = drafter.teams.map(async (abbr) => {
      const espnTeam = resolveTeam(allTeams, abbr);
      if (!espnTeam) return null;

      const { wins, summary } = await fetchRecord(espnTeam.id, year, abbr);
      const nextGame = schedule ? getCurrentWeekGame(schedule, abbr) : null;

      return {
        ...espnTeam,
        abbreviation: abbr,
        wins,
        record: summary,
        nextGame,
      };
    });

    const resolved = await Promise.all(teamPromises);
    for (const t of resolved) {
      if (t) teams.push(t);
    }

    results.push({
      name: drafter.name,
      teams,
    });
  }

  return results;
}

export function isOffseason(schedule) {
  return !schedule;
}

export function getGameStatus(game) {
  if (!game) return null;
  const comp = game.competitions[0];
  const status = comp.status?.type?.name;
  if (status === 'STATUS_IN_PROGRESS' || status === 'STATUS_HALFTIME') return 'live';
  if (status === 'STATUS_FINAL' || status === 'STATUS_END_PERIOD') return 'final';
  return 'scheduled';
}

export function formatGameScore(game, teamAbbr) {
  if (!game) return '';
  const comp = game.competitions[0];
  const home = comp.competitors.find(c => c.homeAway === 'home');
  const away = comp.competitors.find(c => c.homeAway === 'away');
  const isHome = home.team.abbreviation === teamAbbr;
  const us = isHome ? home : away;
  const them = isHome ? away : home;
  const prefix = isHome ? 'vs' : '@';
  return `${prefix} ${them.team.abbreviation} ${us.score}-${them.score}`;
}

export function formatGameInfo(game, teamAbbr) {
  if (!game) return '';
  const comp = game.competitions[0];
  const home = comp.competitors.find(c => c.homeAway === 'home');
  const away = comp.competitors.find(c => c.homeAway === 'away');
  const isHome = home.team.abbreviation === teamAbbr;
  const them = isHome ? away : home;
  const prefix = isHome ? 'vs' : '@';
  const date = new Date(game.date);
  const day = date.toLocaleDateString('en-US', { weekday: 'short' });
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${prefix} ${them.team.abbreviation} · ${day} ${time}`;
}

export function isByeWeek(schedule, teamAbbr) {
  if (!schedule) return false;
  return getCurrentWeekGame(schedule, teamAbbr) === null;
}

export { ALL_NFL_TEAMS, REPO_OWNER, REPO_NAME };
