import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getLatestYear,
  isOffseason,
  getGameStatus,
  formatGameScore,
  formatGameInfo,
  getCurrentWeekGame,
  isByeWeek,
  findHeadToHeadMatchups,
  ALL_NFL_TEAMS,
} from '../src/api.js';
import { MOCK_SCHEDULE } from '../src/mock.js';

function game(id, homeAbbr, awayAbbr, status, homeScore, awayScore, dateStr) {
  const statusMap = {
    live: { name: 'STATUS_IN_PROGRESS', description: 'In Progress' },
    halftime: { name: 'STATUS_HALFTIME', description: 'Halftime' },
    final: { name: 'STATUS_FINAL', description: 'Final' },
    scheduled: { name: 'STATUS_SCHEDULED', description: 'Scheduled' },
  };
  return {
    id: String(id),
    date: dateStr || '2025-10-26T17:00Z',
    competitions: [{
      competitors: [
        { homeAway: 'home', team: { abbreviation: homeAbbr }, score: String(homeScore || 0) },
        { homeAway: 'away', team: { abbreviation: awayAbbr }, score: String(awayScore || 0) },
      ],
      status: { type: statusMap[status] },
    }],
  };
}

describe('getLatestYear', () => {
  it('returns highest numeric key', () => {
    expect(getLatestYear({ '2023': [], '2025': [], '2024': [] })).toBe(2025);
  });

  it('works with single year', () => {
    expect(getLatestYear({ '2024': [] })).toBe(2024);
  });
});

describe('isOffseason', () => {
  it('null schedule means offseason', () => {
    expect(isOffseason(null)).toBe(true);
  });

  it('schedule object means not offseason', () => {
    expect(isOffseason(MOCK_SCHEDULE)).toBe(false);
  });
});

describe('getGameStatus', () => {
  it('STATUS_IN_PROGRESS → live', () => {
    expect(getGameStatus(game(1, 'A', 'B', 'live', 0, 0))).toBe('live');
  });

  it('STATUS_HALFTIME → live', () => {
    expect(getGameStatus(game(1, 'A', 'B', 'halftime', 0, 0))).toBe('live');
  });

  it('STATUS_FINAL → final', () => {
    expect(getGameStatus(game(1, 'A', 'B', 'final', 0, 0))).toBe('final');
  });

  it('STATUS_SCHEDULED → scheduled', () => {
    expect(getGameStatus(game(1, 'A', 'B', 'scheduled', 0, 0))).toBe('scheduled');
  });

  it('null game → null', () => {
    expect(getGameStatus(null)).toBeNull();
  });
});

describe('formatGameScore', () => {
  it('shows vs prefix for home team', () => {
    const g = game(1, 'BAL', 'BUF', 'live', 21, 24);
    expect(formatGameScore(g, 'BAL')).toBe('vs BUF 21-24');
  });

  it('shows @ prefix for away team', () => {
    const g = game(1, 'BAL', 'BUF', 'live', 21, 24);
    expect(formatGameScore(g, 'BUF')).toBe('@ BAL 24-21');
  });

  it('returns empty string for null game', () => {
    expect(formatGameScore(null, 'BAL')).toBe('');
  });
});

describe('formatGameInfo', () => {
  it('shows scheduled game with date/time and vs prefix', () => {
    const g = game(1, 'CHI', 'GB', 'scheduled', 0, 0, '2025-10-27T00:20Z');
    const result = formatGameInfo(g, 'CHI');
    expect(result).toMatch(/^vs GB/);
    expect(result).toContain('·');
  });

  it('shows @ prefix for away team', () => {
    const g = game(1, 'CHI', 'GB', 'scheduled', 0, 0, '2025-10-27T00:20Z');
    const result = formatGameInfo(g, 'GB');
    expect(result).toMatch(/^@ CHI/);
  });

  it('returns empty string for null game', () => {
    expect(formatGameInfo(null, 'BAL')).toBe('');
  });
});

describe('getCurrentWeekGame', () => {
  it('finds game by home team abbreviation', () => {
    const g = getCurrentWeekGame(MOCK_SCHEDULE, 'BAL');
    expect(g).not.toBeNull();
    expect(g.id).toBe('1001');
  });

  it('finds game by away team abbreviation', () => {
    const g = getCurrentWeekGame(MOCK_SCHEDULE, 'BUF');
    expect(g).not.toBeNull();
    expect(g.id).toBe('1001');
  });

  it('returns null for bye team', () => {
    const g = getCurrentWeekGame(MOCK_SCHEDULE, 'TB');
    expect(g).toBeNull();
  });

  it('returns null when schedule is null', () => {
    expect(getCurrentWeekGame(null, 'BAL')).toBeNull();
  });
});

describe('isByeWeek', () => {
  it('true when no game found', () => {
    expect(isByeWeek(MOCK_SCHEDULE, 'TB')).toBe(true);
  });

  it('false when game exists', () => {
    expect(isByeWeek(MOCK_SCHEDULE, 'BAL')).toBe(false);
  });

  it('false when schedule is null', () => {
    expect(isByeWeek(null, 'BAL')).toBe(false);
  });
});

describe('findHeadToHeadMatchups', () => {
  it('detects cross-drafter opponents', () => {
    const stats = [
      {
        name: 'CODY',
        teams: [{ abbreviation: 'BAL', nextGame: game(1001, 'BAL', 'BUF', 'live', 21, 24) }],
      },
      {
        name: 'ETHAN',
        teams: [{ abbreviation: 'BUF', nextGame: game(1001, 'BAL', 'BUF', 'live', 21, 24) }],
      },
    ];

    const matchups = findHeadToHeadMatchups(stats);
    expect(matchups.size).toBe(1);
    const m = matchups.get('1001');
    expect(m.team1).toBe('BAL');
    expect(m.team2).toBe('BUF');
  });

  it('skips LEFTOVERS', () => {
    const stats = [
      {
        name: 'CODY',
        teams: [{ abbreviation: 'BAL', nextGame: game(1001, 'BAL', 'BUF', 'live', 21, 24) }],
      },
      {
        name: 'LEFTOVERS',
        teams: [{ abbreviation: 'BUF', nextGame: game(1001, 'BAL', 'BUF', 'live', 21, 24) }],
      },
    ];

    const matchups = findHeadToHeadMatchups(stats);
    expect(matchups.size).toBe(0);
  });

  it('skips same-drafter matchups', () => {
    const stats = [
      {
        name: 'CODY',
        teams: [
          { abbreviation: 'BAL', nextGame: game(1001, 'BAL', 'KC', 'live', 21, 24) },
          { abbreviation: 'KC', nextGame: game(1001, 'BAL', 'KC', 'live', 21, 24) },
        ],
      },
    ];

    const matchups = findHeadToHeadMatchups(stats);
    expect(matchups.size).toBe(0);
  });
});

describe('ALL_NFL_TEAMS', () => {
  it('has 32 teams', () => {
    expect(ALL_NFL_TEAMS.length).toBe(32);
  });
});
