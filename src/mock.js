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

const sundayEarly = '2025-10-26T17:00Z';
const sundayLate = '2025-10-26T20:25Z';
const sundayNight = '2025-10-27T00:20Z';
const mondayNight = '2025-10-28T00:15Z';

export const MOCK_SCHEDULE = {
  '2025-10-26': {
    games: [
      // H2H: Ethan's BUF vs Cody's BAL — LIVE, close game
      game(1001, 'BAL', 'BUF', 'live', 21, 24, sundayEarly),
      // H2H: Ethan's WSH vs Kayla's PHI — final, PHI won
      game(1002, 'PHI', 'WSH', 'final', 27, 17, sundayEarly),
      // H2H: Cody's KC vs Benjamin's KC — same team so not H2H, but KC plays
      game(1003, 'KC', 'DEN', 'live', 14, 10, sundayEarly),
      // Kayla's LAC vs LEFTOVERS' CLE — final
      game(1004, 'CLE', 'LAC', 'final', 13, 31, sundayEarly),
      // Ethan's DET vs LEFTOVERS' MIN — live, blowout
      game(1005, 'DET', 'MIN', 'live', 35, 14, sundayEarly),
      // Benjamin's PIT vs LEFTOVERS' NYJ — final
      game(1006, 'PIT', 'NYJ', 'final', 20, 16, sundayEarly),
      // Kayla's SF vs LEFTOVERS' SEA — scheduled (late window)
      game(1007, 'SF', 'SEA', 'scheduled', 0, 0, sundayLate),
      // Benjamin's ARI vs LEFTOVERS' NO — scheduled
      game(1008, 'ARI', 'NO', 'scheduled', 0, 0, sundayLate),
      // Cody's GB vs LEFTOVERS' CHI — scheduled (SNF)
      game(1009, 'CHI', 'GB', 'scheduled', 0, 0, sundayNight),
      // Cody's CIN vs LEFTOVERS' NE — final
      game(1010, 'CIN', 'NE', 'final', 38, 10, sundayEarly),
      // Cody's LAR vs LEFTOVERS' ATL — final
      game(1011, 'ATL', 'LAR', 'final', 20, 23, sundayEarly),
      // Kayla's HOU vs LEFTOVERS' IND — live
      game(1012, 'HOU', 'IND', 'live', 17, 13, sundayEarly),
      // Benjamin's MIA vs LEFTOVERS' CAR — final
      game(1013, 'MIA', 'CAR', 'final', 28, 10, sundayEarly),
      // LEFTOVERS matchups
      game(1014, 'DAL', 'NYG', 'final', 24, 21, sundayEarly),
      game(1015, 'LV', 'TEN', 'scheduled', 0, 0, mondayNight),
    ],
  },
};

// Bye teams this week: Ethan's TB, Kayla's JAX, Benjamin's PHI (already played... actually let me just not schedule them)
// TB, JAX not in any game above = bye week

export const MOCK_WEEK = 8;

export const MOCK_RECORDS = {
  BUF: { wins: 6, summary: '6-1' },
  WSH: { wins: 5, summary: '5-2' },
  DET: { wins: 6, summary: '6-1' },
  TB:  { wins: 4, summary: '4-3' },
  DEN: { wins: 4, summary: '4-3' },
  PHI: { wins: 5, summary: '5-2' },
  LAC: { wins: 4, summary: '4-3' },
  SF:  { wins: 3, summary: '3-4' },
  JAX: { wins: 2, summary: '2-5' },
  HOU: { wins: 5, summary: '5-2' },
  BAL: { wins: 5, summary: '5-2' },
  KC:  { wins: 6, summary: '6-1' },
  GB:  { wins: 5, summary: '5-2' },
  CIN: { wins: 4, summary: '4-3' },
  LAR: { wins: 3, summary: '3-4' },
  PIT: { wins: 4, summary: '4-3' },
  ARI: { wins: 4, summary: '4-3' },
  MIA: { wins: 3, summary: '3-4' },
  ATL: { wins: 4, summary: '4-3' },
  CAR: { wins: 1, summary: '1-6' },
  CHI: { wins: 2, summary: '2-5' },
  CLE: { wins: 1, summary: '1-6' },
  DAL: { wins: 3, summary: '3-4' },
  IND: { wins: 3, summary: '3-4' },
  LV:  { wins: 2, summary: '2-5' },
  MIN: { wins: 4, summary: '4-3' },
  NE:  { wins: 1, summary: '1-6' },
  NO:  { wins: 2, summary: '2-5' },
  NYG: { wins: 2, summary: '2-5' },
  NYJ: { wins: 2, summary: '2-5' },
  SEA: { wins: 3, summary: '3-4' },
  TEN: { wins: 1, summary: '1-6' },
};
