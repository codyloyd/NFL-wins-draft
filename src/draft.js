import { ALL_NFL_TEAMS } from './api.js';

export function createDraftState(players) {
  return {
    players,
    selectedTeams: new Map(),
    draftOrder: [],
    currentPickerIndex: 0,
    snakeDirection: 1,
    finished: false,
  };
}

export function selectTeam(state, abbr) {
  if (state.selectedTeams.has(abbr)) return state;
  if (state.finished || state.players.length === 0) return state;

  const player = state.players[state.currentPickerIndex];
  const selectedTeams = new Map(state.selectedTeams);
  selectedTeams.set(abbr, player);

  const draftOrder = [...state.draftOrder, {
    player,
    team: abbr,
    pickNumber: state.draftOrder.length + 1,
  }];

  const advanced = advancePicker({
    ...state,
    selectedTeams,
    draftOrder,
  });

  return advanced;
}

export function advancePicker(state) {
  let next = state.currentPickerIndex + state.snakeDirection;
  let dir = state.snakeDirection;

  if (next >= state.players.length) {
    dir = -1;
    next = state.currentPickerIndex;
  } else if (next < 0) {
    dir = 1;
    next = state.currentPickerIndex;
  }

  return { ...state, currentPickerIndex: next, snakeDirection: dir };
}

export function undoPick(state) {
  if (state.draftOrder.length === 0) return state;

  const lastPick = state.draftOrder[state.draftOrder.length - 1];
  const draftOrder = state.draftOrder.slice(0, -1);
  const selectedTeams = new Map(state.selectedTeams);
  selectedTeams.delete(lastPick.team);

  const reversed = reversePicker({ ...state, draftOrder, selectedTeams });
  return { ...reversed, finished: false };
}

function reversePicker(state) {
  const N = state.players.length;
  const idx = state.currentPickerIndex;
  const dir = state.snakeDirection;

  if (dir === -1 && idx === N - 1) {
    return { ...state, snakeDirection: 1 };
  } else if (dir === 1 && idx === 0) {
    return { ...state, snakeDirection: -1 };
  } else {
    return { ...state, currentPickerIndex: idx - dir, snakeDirection: dir };
  }
}

export function isDraftComplete(state, roundsPerPlayer) {
  if (state.finished) return true;
  const totalPicks = state.players.length * roundsPerPlayer;
  if (state.draftOrder.length >= totalPicks) return true;
  return state.selectedTeams.size === ALL_NFL_TEAMS.length;
}

export function buildDrafters(state) {
  const drafters = state.players.map(player => ({
    name: player,
    teams: state.draftOrder.filter(p => p.player === player).map(p => p.team),
  }));
  const draftedAbbrs = new Set(state.draftOrder.map(p => p.team));
  const leftovers = ALL_NFL_TEAMS.filter(a => !draftedAbbrs.has(a));
  drafters.push({ name: 'LEFTOVERS', teams: leftovers });
  return drafters;
}

export function getDraftBoard(state) {
  const board = new Map();
  for (const player of state.players) {
    board.set(player, []);
  }
  for (const pick of state.draftOrder) {
    const list = board.get(pick.player);
    if (list) list.push(pick);
  }
  return board;
}
