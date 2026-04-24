import { describe, it, expect } from 'vitest';
import {
  createDraftState,
  selectTeam,
  advancePicker,
  undoPick,
  isDraftComplete,
  buildDrafters,
  getDraftBoard,
} from '../src/draft.js';

describe('createDraftState', () => {
  it('returns initial state with empty collections', () => {
    const state = createDraftState(['A', 'B']);
    expect(state.players).toEqual(['A', 'B']);
    expect(state.selectedTeams.size).toBe(0);
    expect(state.draftOrder).toEqual([]);
    expect(state.currentPickerIndex).toBe(0);
    expect(state.snakeDirection).toBe(1);
    expect(state.finished).toBe(false);
  });
});

describe('snake draft order', () => {
  it('3 players: picks go 0,1,2,2,1,0,0,1,2', () => {
    const players = ['A', 'B', 'C'];
    const teams = ['ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE', 'DAL'];
    let state = createDraftState(players);

    const expectedOrder = [0, 1, 2, 2, 1, 0, 0, 1, 2];
    for (let i = 0; i < expectedOrder.length; i++) {
      expect(state.currentPickerIndex).toBe(expectedOrder[i]);
      state = selectTeam(state, teams[i]);
    }
  });

  it('2 players: picks go 0,1,1,0,0,1', () => {
    const players = ['X', 'Y'];
    const teams = ['ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI'];
    let state = createDraftState(players);

    const expectedOrder = [0, 1, 1, 0, 0, 1];
    for (let i = 0; i < expectedOrder.length; i++) {
      expect(state.currentPickerIndex).toBe(expectedOrder[i]);
      state = selectTeam(state, teams[i]);
    }
  });

  it('assigns correct player to each pick', () => {
    const players = ['A', 'B', 'C'];
    const teams = ['ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI'];
    let state = createDraftState(players);

    for (const t of teams) state = selectTeam(state, t);

    expect(state.draftOrder.map(p => p.player)).toEqual([
      'A', 'B', 'C', 'C', 'B', 'A',
    ]);
  });
});

describe('selectTeam', () => {
  it('records pick with correct pick number', () => {
    let state = createDraftState(['A', 'B']);
    state = selectTeam(state, 'ARI');
    state = selectTeam(state, 'BAL');

    expect(state.draftOrder[0].pickNumber).toBe(1);
    expect(state.draftOrder[1].pickNumber).toBe(2);
  });

  it('ignores duplicate team selection', () => {
    let state = createDraftState(['A', 'B']);
    state = selectTeam(state, 'ARI');
    state = selectTeam(state, 'ARI');

    expect(state.draftOrder.length).toBe(1);
  });

  it('ignores selection when finished', () => {
    let state = createDraftState(['A', 'B']);
    state = { ...state, finished: true };
    state = selectTeam(state, 'ARI');

    expect(state.draftOrder.length).toBe(0);
  });

  it('ignores selection when no players', () => {
    let state = createDraftState([]);
    state = selectTeam(state, 'ARI');

    expect(state.draftOrder.length).toBe(0);
  });

  it('maps team to correct player in selectedTeams', () => {
    let state = createDraftState(['A', 'B']);
    state = selectTeam(state, 'ARI');

    expect(state.selectedTeams.get('ARI')).toBe('A');
  });
});

describe('undoPick', () => {
  it('removes last pick and restores previous picker', () => {
    let state = createDraftState(['A', 'B', 'C']);
    state = selectTeam(state, 'ARI');
    state = selectTeam(state, 'ATL');
    state = selectTeam(state, 'BAL');

    state = undoPick(state);

    expect(state.draftOrder.length).toBe(2);
    expect(state.selectedTeams.has('BAL')).toBe(false);
    expect(state.currentPickerIndex).toBe(2);
    expect(state.snakeDirection).toBe(1);
  });

  it('undoing at round boundary reverses direction', () => {
    let state = createDraftState(['A', 'B']);
    state = selectTeam(state, 'ARI');
    state = selectTeam(state, 'ATL');

    expect(state.currentPickerIndex).toBe(1);
    expect(state.snakeDirection).toBe(-1);
    state = undoPick(state);
    expect(state.currentPickerIndex).toBe(1);
    expect(state.snakeDirection).toBe(1);
    expect(state.draftOrder.length).toBe(1);
  });

  it('undoing all picks returns to exact initial state', () => {
    let state = createDraftState(['A', 'B']);
    state = selectTeam(state, 'ARI');
    state = selectTeam(state, 'ATL');

    state = undoPick(state);
    state = undoPick(state);

    expect(state.draftOrder.length).toBe(0);
    expect(state.selectedTeams.size).toBe(0);
    expect(state.currentPickerIndex).toBe(0);
    expect(state.snakeDirection).toBe(1);
  });

  it('N picks then N undos returns to exact initial state (3 players)', () => {
    const players = ['A', 'B', 'C'];
    const teams = ['ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI'];
    let state = createDraftState(players);

    for (const t of teams) state = selectTeam(state, t);
    for (let i = 0; i < teams.length; i++) state = undoPick(state);

    expect(state.currentPickerIndex).toBe(0);
    expect(state.snakeDirection).toBe(1);
    expect(state.draftOrder.length).toBe(0);
    expect(state.selectedTeams.size).toBe(0);
  });

  it('no-op when no picks exist', () => {
    const state = createDraftState(['A', 'B']);
    const result = undoPick(state);

    expect(result.draftOrder.length).toBe(0);
    expect(result.currentPickerIndex).toBe(0);
  });

  it('clears finished flag', () => {
    let state = createDraftState(['A', 'B']);
    state = selectTeam(state, 'ARI');
    state = { ...state, finished: true };
    state = undoPick(state);

    expect(state.finished).toBe(false);
  });
});

describe('isDraftComplete', () => {
  it('true when picks = players × roundsPerPlayer', () => {
    let state = createDraftState(['A', 'B']);
    const teams = ['ARI', 'ATL', 'BAL', 'BUF'];
    for (const t of teams) state = selectTeam(state, t);

    expect(isDraftComplete(state, 2)).toBe(true);
  });

  it('true when manually finished', () => {
    let state = createDraftState(['A', 'B']);
    state = selectTeam(state, 'ARI');
    state = { ...state, finished: true };

    expect(isDraftComplete(state, 5)).toBe(true);
  });

  it('false mid-draft', () => {
    let state = createDraftState(['A', 'B']);
    state = selectTeam(state, 'ARI');

    expect(isDraftComplete(state, 5)).toBe(false);
  });

  it('true when all NFL teams are drafted', async () => {
    const { ALL_NFL_TEAMS } = await import('../src/api.js');
    let state = createDraftState(['A', 'B']);
    for (const t of ALL_NFL_TEAMS) state = selectTeam(state, t);

    expect(isDraftComplete(state, 100)).toBe(true);
  });
});

describe('buildDrafters', () => {
  it('groups teams by player in draft order', () => {
    let state = createDraftState(['A', 'B']);
    state = selectTeam(state, 'ARI');
    state = selectTeam(state, 'ATL');
    state = selectTeam(state, 'BAL');
    state = selectTeam(state, 'BUF');

    const drafters = buildDrafters(state);
    const a = drafters.find(d => d.name === 'A');
    const b = drafters.find(d => d.name === 'B');

    expect(a.teams).toEqual(['ARI', 'BUF']);
    expect(b.teams).toEqual(['ATL', 'BAL']);
  });

  it('LEFTOVERS contains all undrafted teams', () => {
    let state = createDraftState(['A']);
    state = selectTeam(state, 'ARI');

    const drafters = buildDrafters(state);
    const leftovers = drafters.find(d => d.name === 'LEFTOVERS');

    expect(leftovers.teams).not.toContain('ARI');
    expect(leftovers.teams.length).toBe(31);
  });
});

describe('getDraftBoard', () => {
  it('returns map with picks grouped by player', () => {
    let state = createDraftState(['A', 'B']);
    state = selectTeam(state, 'ARI');
    state = selectTeam(state, 'ATL');

    const board = getDraftBoard(state);

    expect(board.get('A').length).toBe(1);
    expect(board.get('A')[0].team).toBe('ARI');
    expect(board.get('B').length).toBe(1);
    expect(board.get('B')[0].team).toBe('ATL');
  });

  it('empty picks for players who have not picked yet', () => {
    let state = createDraftState(['A', 'B']);
    state = selectTeam(state, 'ARI');

    const board = getDraftBoard(state);
    expect(board.get('B')).toEqual([]);
  });
});
