import { LitElement, html, css } from 'lit';
import '../components/wd-header.js';
import '../components/wd-button.js';
import '../components/wd-input.js';
import '../components/wd-select.js';
import '../components/wd-player-tag.js';
import '../components/wd-card.js';
import '../components/wd-loading.js';
import { loadSavedTheme } from '../themes.js';
import {
  fetchTeams,
  fetchDrafts,
  fetchRecord,
  saveDraftToGitHub,
  getLatestYear,
  ALL_NFL_TEAMS,
} from '../api.js';
import {
  createDraftState,
  selectTeam as draftSelectTeam,
  undoPick,
  isDraftComplete,
  buildDrafters,
  getDraftBoard,
} from '../draft.js';

export class WdDraftPicker extends LitElement {
  static properties = {
    _loading: { state: true },
    _players: { state: true },
    _playerInput: { state: true },
    _allTeams: { state: true },
    _draftState: { state: true },
    _sortBy: { state: true },
    _hideSelected: { state: true },
    _githubToken: { state: true },
    _saving: { state: true },
    _saveMessage: { state: true },
    _draftStarted: { state: true },
    _draftFinished: { state: true },
    _draftYear: { state: true },
    _roundsPerPlayer: { state: true },
    _showPreview: { state: true },
  };

  constructor() {
    super();
    this._loading = true;
    this._players = [];
    this._playerInput = '';
    this._allTeams = [];
    this._draftState = createDraftState([]);
    this._sortBy = 'name';
    this._hideSelected = false;
    this._githubToken = '';
    this._saving = false;
    this._saveMessage = '';
    this._draftStarted = false;
    this._draftYear = new Date().getFullYear();
    this._roundsPerPlayer = 5;
    this._showPreview = false;
  }

  async connectedCallback() {
    super.connectedCallback();
    loadSavedTheme();
    const [teamsData, drafts] = await Promise.all([fetchTeams(), fetchDrafts()]);

    const latestYear = getLatestYear(drafts);
    const prevYear = latestYear;

    const teamDetails = [];
    for (const entry of teamsData) {
      const t = entry.team;
      if (!ALL_NFL_TEAMS.includes(t.abbreviation)) continue;

      let prevWins = 0;
      try {
        const rec = await fetchRecord(t.id, prevYear);
        prevWins = rec.wins;
      } catch { /* ignore */ }

      teamDetails.push({
        id: t.id,
        name: t.displayName,
        shortName: t.shortDisplayName,
        abbreviation: t.abbreviation,
        logo: t.logos?.[0]?.href || '',
        color: t.color || '333333',
        prevWins,
      });
    }

    this._allTeams = teamDetails;
    this._draftYear = latestYear + 1;
    this._loading = false;
  }

  _addPlayer() {
    const name = this._playerInput.trim().toUpperCase();
    if (!name || this._players.includes(name)) return;
    this._players = [...this._players, name];
    this._playerInput = '';
  }

  _removePlayer(e) {
    const name = e.detail.name;
    this._players = this._players.filter(p => p !== name);
  }

  _startDraft() {
    if (this._players.length < 2) return;
    this._draftStarted = true;
    this._draftState = createDraftState(this._players);
  }

  _finishDraft() {
    this._draftState = { ...this._draftState, finished: true };
  }

  _selectTeam(abbr) {
    if (!this._draftStarted || this._isDraftComplete()) return;
    this._draftState = draftSelectTeam(this._draftState, abbr);
  }

  _undo() {
    this._draftState = undoPick(this._draftState);
  }

  _getSortedTeams() {
    let teams = [...this._allTeams];
    if (this._hideSelected) {
      teams = teams.filter(t => !this._draftState.selectedTeams.has(t.abbreviation));
    }
    if (this._sortBy === 'wins') {
      teams.sort((a, b) => b.prevWins - a.prevWins || a.name.localeCompare(b.name));
    } else {
      teams.sort((a, b) => a.name.localeCompare(b.name));
    }
    return teams;
  }

  async _saveDraft() {
    if (!this._githubToken) {
      this._saveMessage = 'Enter a GitHub token first.';
      return;
    }

    this._saving = true;
    this._saveMessage = '';

    const drafters = buildDrafters(this._draftState);
    const ok = await saveDraftToGitHub(this._draftYear, drafters, this._githubToken);
    this._saving = false;
    this._saveMessage = ok ? 'Saved!' : 'Save failed — check your token.';
  }

  _findTeamByAbbr(abbr) {
    return this._allTeams.find(t => t.abbreviation === abbr);
  }

  _isDraftComplete() {
    return isDraftComplete(this._draftState, this._roundsPerPlayer);
  }

  static styles = css`
    :host { display: block; min-height: 100vh; }

    .layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: var(--space-4);
      max-width: 1400px;
      margin: 0 auto;
      padding: var(--space-4);
    }

    .main { min-width: 0; }

    .setup {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      padding: var(--space-6);
    }

    .setup-row {
      display: flex;
      gap: var(--space-3);
      align-items: flex-end;
    }

    .setup-row wd-input { flex: 1; }

    .players-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .controls {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) 0;
      flex-wrap: wrap;
    }

    .current-picker {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: var(--text-lg);
      color: var(--color-accent);
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .pick-num {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      letter-spacing: 1px;
    }

    .spacer { flex: 1; }

    .toggle-label {
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
      display: flex;
      align-items: center;
      gap: var(--space-2);
      cursor: pointer;
    }

    .toggle-label input {
      accent-color: var(--color-accent);
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 2px;
    }

    .team-cell {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3);
      background: var(--color-surface);
      border-left: 3px solid var(--tc, var(--color-border-strong));
      cursor: pointer;
      transition: background var(--duration-fast), opacity var(--duration-fast);
    }

    .team-cell:hover:not(.picked) {
      background: var(--color-surface-hover);
    }

    .team-cell.picked {
      opacity: 0.15;
      cursor: default;
    }

    .team-cell img {
      width: 32px;
      height: 32px;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4));
    }

    .team-cell-info {
      min-width: 0;
    }

    .team-cell-name {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: var(--text-sm);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .team-cell-meta {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .team-cell-owner {
      margin-left: auto;
      font-family: var(--font-display);
      font-size: 9px;
      font-weight: 700;
      color: var(--color-accent);
      text-transform: uppercase;
      letter-spacing: 1px;
      white-space: nowrap;
    }

    /* Sidebar */
    .sidebar {
      position: sticky;
      top: 80px;
      align-self: start;
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .board-section {
      margin-bottom: var(--space-3);
    }

    .board-player-name {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: var(--text-sm);
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--color-text-secondary);
      margin-bottom: var(--space-2);
    }

    .board-pick {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: 4px 0;
      font-size: var(--text-sm);
    }

    .board-pick-num {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      min-width: 20px;
    }

    .board-pick img {
      width: 20px;
      height: 20px;
    }

    .board-pick-abbr {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: var(--text-sm);
      letter-spacing: 1px;
    }

    .save-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      padding-top: var(--space-3);
      border-top: 1px solid var(--color-border-strong);
    }

    .save-section label {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .save-msg {
      font-size: var(--text-sm);
      color: var(--color-accent);
    }

    .save-msg.error {
      color: var(--color-pop);
    }

    .preview-json {
      background: var(--color-bg);
      border: 1px solid var(--color-border-strong);
      padding: var(--space-3);
      font-family: monospace;
      font-size: 11px;
      color: var(--color-text-secondary);
      white-space: pre;
      overflow-x: auto;
      max-height: 400px;
      overflow-y: auto;
      line-height: 1.5;
    }

    .back-link {
      display: inline-block;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: var(--text-xs);
      color: var(--color-text-secondary);
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 2px;
      padding: var(--space-3) 0;
      transition: color var(--duration-fast);
    }

    .back-link:hover { color: var(--color-accent); }

    .draft-complete {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: var(--text-lg);
      color: var(--color-accent);
      text-transform: uppercase;
      letter-spacing: 3px;
      text-align: center;
      padding: var(--space-4);
    }

    @media (max-width: 800px) {
      .layout {
        grid-template-columns: 1fr;
      }
      .sidebar {
        position: static;
        order: -1;
      }
    }
  `;

  _renderSetup() {
    return html`
      <wd-card elevated>
        <div class="setup">
          <div style="font-family: var(--font-display); font-weight: 800; font-size: var(--text-xl); text-transform: uppercase; letter-spacing: 3px; color: var(--color-text);">
            ${this._draftYear} Draft
          </div>
          <div class="setup-row">
            <wd-input
              placeholder="Player name"
              .value=${this._playerInput}
              @wd-input=${e => this._playerInput = e.detail.value}
              @wd-submit=${() => this._addPlayer()}
            ></wd-input>
            <wd-button size="sm" @click=${() => this._addPlayer()}>Add</wd-button>
          </div>
          <div class="players-list">
            ${this._players.map(p => html`
              <wd-player-tag .name=${p} @remove=${this._removePlayer}></wd-player-tag>
            `)}
          </div>
          ${this._players.length >= 2 ? html`
            <div class="setup-row">
              <wd-input
                type="number"
                placeholder="Rounds per player"
                .value=${String(this._roundsPerPlayer)}
                @wd-input=${e => {
                  const v = parseInt(e.detail.value);
                  if (v > 0 && v <= 32) this._roundsPerPlayer = v;
                }}
              ></wd-input>
              <span style="font-size: var(--text-sm); color: var(--color-text-secondary); white-space: nowrap;">${this._roundsPerPlayer * this._players.length} picks total</span>
            </div>
            <wd-button @click=${() => this._startDraft()}>Start Draft</wd-button>
          ` : ''}
        </div>
      </wd-card>
    `;
  }

  _renderControls() {
    const currentPlayer = this._players[this._draftState.currentPickerIndex];
    const pickNum = this._draftState.draftOrder.length + 1;
    const complete = this._isDraftComplete();

    return html`
      <div class="controls">
        ${complete ? html`
          <span class="draft-complete">Draft Complete</span>
        ` : html`
          <span class="pick-num">Pick #${pickNum}</span>
          <span class="current-picker">${currentPlayer}'s Pick</span>
        `}
        <span class="spacer"></span>
        ${!complete ? html`
          <wd-button variant="secondary" size="sm" ?disabled=${this._draftState.draftOrder.length === 0} @click=${() => this._finishDraft()}>Finish Draft</wd-button>
        ` : ''}
        <wd-button variant="ghost" size="sm" ?disabled=${this._draftState.draftOrder.length === 0 || complete} @click=${() => this._undo()}>Undo</wd-button>
        <label class="toggle-label">
          <input type="checkbox" .checked=${this._hideSelected} @change=${e => this._hideSelected = e.target.checked}>
          Hide picked
        </label>
        <wd-select
          .options=${[
            { value: 'name', label: 'A-Z' },
            { value: 'wins', label: 'Wins' },
          ]}
          .value=${this._sortBy}
          @wd-change=${e => this._sortBy = e.detail.value}
        ></wd-select>
      </div>
    `;
  }

  _renderTeamGrid() {
    const teams = this._getSortedTeams();
    return html`
      <div class="team-grid">
        ${teams.map(t => {
          const picked = this._draftState.selectedTeams.has(t.abbreviation);
          const owner = this._draftState.selectedTeams.get(t.abbreviation);
          return html`
            <div
              class="team-cell ${picked ? 'picked' : ''}"
              style="--tc: #${t.color}"
              @click=${() => !picked && this._selectTeam(t.abbreviation)}
            >
              <img src="${t.logo}" alt="${t.abbreviation}">
              <div class="team-cell-info">
                <div class="team-cell-name">${t.shortName}</div>
                <div class="team-cell-meta">${t.prevWins}W last year</div>
              </div>
              ${picked ? html`<span class="team-cell-owner">${owner}</span>` : ''}
            </div>
          `;
        })}
      </div>
    `;
  }

  _renderDraftBoard() {
    const board = getDraftBoard(this._draftState);
    return html`
      ${[...board.entries()].map(([player, picks]) => html`
        <div class="board-section">
          <div class="board-player-name">${player}</div>
          ${picks.length === 0 ? html`
            <div style="font-size: var(--text-xs); color: var(--color-text-muted); font-style: italic;">No picks yet</div>
          ` : picks.map(pick => {
            const team = this._findTeamByAbbr(pick.team);
            return html`
              <div class="board-pick">
                <span class="board-pick-num">#${pick.pickNumber}</span>
                ${team ? html`<img src="${team.logo}" alt="${pick.team}">` : ''}
                <span class="board-pick-abbr">${pick.team}</span>
              </div>
            `;
          })}
        </div>
      `)}
    `;
  }

  _renderSaveSection() {
    if (!this._isDraftComplete()) return '';

    const drafters = buildDrafters(this._draftState);
    const previewData = { [this._draftYear]: drafters };

    return html`
      <div class="save-section">
        <wd-button variant="ghost" size="sm" @click=${() => this._showPreview = !this._showPreview}>
          ${this._showPreview ? 'Hide' : 'Preview'} JSON
        </wd-button>
        ${this._showPreview ? html`
          <div class="preview-json">${JSON.stringify(previewData, null, 2)}</div>
        ` : ''}
        <label>GitHub Token</label>
        <wd-input
          type="password"
          placeholder="ghp_..."
          .value=${this._githubToken}
          @wd-input=${e => this._githubToken = e.detail.value}
        ></wd-input>
        <wd-button
          ?disabled=${this._saving}
          @click=${() => this._saveDraft()}
        >${this._saving ? 'Saving...' : 'Save to GitHub'}</wd-button>
        ${this._saveMessage ? html`
          <div class="save-msg ${this._saveMessage.includes('failed') ? 'error' : ''}">${this._saveMessage}</div>
        ` : ''}
      </div>
    `;
  }

  render() {
    if (this._loading) {
      return html`<wd-loading></wd-loading>`;
    }

    return html`
      <wd-header .year=${this._draftYear}></wd-header>

      ${!this._draftStarted ? html`
        <div class="layout">
          <div class="main">
            ${this._renderSetup()}
          </div>
          <div class="sidebar">
            <a href="/" class="back-link">&larr; Leaderboard</a>
          </div>
        </div>
      ` : html`
        <div class="layout">
          <div class="main">
            ${this._renderControls()}
            ${this._renderTeamGrid()}
          </div>
          <div class="sidebar">
            <a href="/" class="back-link">&larr; Leaderboard</a>
            ${this._renderDraftBoard()}
            ${this._renderSaveSection()}
          </div>
        </div>
      `}
    `;
  }
}

customElements.define('wd-draft-picker', WdDraftPicker);
