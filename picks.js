import { api, allNFLTeams } from './controller.js'

// Draft state
let players = []
let currentPlayerIndex = 0
let teamData = []
let selectedTeams = new Map() // teamAbbr -> playerName
let draftOrder = [] // Array of {player, team, pickNumber} for tracking order

// Initialize the page
async function init() {
  await loadTeamData()
  renderTeams()
  renderDraftBoard()
  updateCurrentPicker()
}

// Load team data with 2024 wins
async function loadTeamData() {
  try {
    const teamsWithStats = await Promise.all(allNFLTeams.map(async (abbr) => {
      const teamInfo = getTeam(abbr)
      if (!teamInfo) return null
      
      try {
        const record = await getRecord(teamInfo.team)
        const wins2024 = await get2024Wins(teamInfo.team.id)
        
        return {
          abbreviation: abbr,
          name: teamInfo.team.displayName,
          logo: teamInfo.team.logos?.[0]?.href || '',
          color: teamInfo.team.color || '000000',
          wins2024: wins2024 || 0,
          currentWins: record?.stats?.find(stat => stat.name === 'wins')?.value || 0,
          currentRecord: record?.summary || 'N/A'
        }
      } catch (error) {
        console.log(`Error loading stats for ${abbr}:`, error)
        return {
          abbreviation: abbr,
          name: teamInfo.team.displayName,
          logo: teamInfo.team.logos?.[0]?.href || '',
          color: teamInfo.team.color || '000000',
          wins2024: 0,
          currentWins: 0,
          currentRecord: 'N/A'
        }
      }
    }))
    
    teamData = teamsWithStats.filter(team => team !== null)
    
    // Sort by default (most wins 2024) after loading data
    teamData.sort((a, b) => b.wins2024 - a.wins2024)
    
    document.getElementById('loading').style.display = 'none'
    document.getElementById('teamsGrid').style.display = 'grid'
  } catch (error) {
    console.error('Error loading team data:', error)
    document.getElementById('loading').innerHTML = 'Error loading teams. Please refresh.'
  }
}

// Get 2024 season wins (we'll use a mock for now since 2024 data might not be available)
async function get2024Wins(teamId) {
  try {
    const url = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2024/types/2/teams/${teamId}/record`
    const response = await fetch(url)
    if (!response.ok) throw new Error('No 2024 data')
    const json = await response.json()
    const overallRecord = json.items.find(item => item.name === 'overall')
    return overallRecord?.stats?.find(stat => stat.name === 'wins')?.value || 0
  } catch (error) {
    // Mock 2024 wins data if API doesn't have it
    const mock2024Wins = {
      'BAL': 13, 'BUF': 13, 'KC': 15, 'HOU': 10, 'PIT': 10, 'LAC': 11,
      'DEN': 8, 'MIA': 8, 'CIN': 9, 'JAX': 4, 'IND': 8, 'CLE': 5,
      'TEN': 3, 'NYJ': 4, 'LV': 4, 'NE': 4, 'DET': 15, 'GB': 11,
      'MIN': 14, 'CHI': 5, 'PHI': 14, 'WSH': 12, 'DAL': 7, 'NYG': 3,
      'SEA': 10, 'LAR': 10, 'SF': 6, 'ARI': 4, 'ATL': 8, 'TB': 9,
      'CAR': 5, 'NO': 5
    }
    const team = getTeam(Object.keys(mock2024Wins).find(abbr => {
      const t = getTeam(abbr)
      return t?.team?.id === teamId
    }))
    return mock2024Wins[team?.team?.abbreviation] || 0
  }
}

// Helper functions from controller
function getTeam(abbr) {
  return api.allTeams?.find(team => team.team.abbreviation === abbr)
}

async function getRecord(team) {
  const url = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2025/types/2/teams/${team.id}/record`
  const response = await fetch(url)
  const json = await response.json()
  return json.items.find(item => item.name === 'overall')
}

// Player management
function addPlayer() {
  const input = document.getElementById('playerInput')
  const name = input.value.trim()
  
  if (name && !players.includes(name)) {
    players.push(name)
    input.value = ''
    renderPlayers()
    renderDraftBoard()
    updateCurrentPicker()
  }
}

function removePlayer(name) {
  players = players.filter(p => p !== name)
  // Remove their selections
  for (let [team, player] of selectedTeams) {
    if (player === name) {
      selectedTeams.delete(team)
    }
  }
  // Remove from draft order
  draftOrder = draftOrder.filter(pick => pick.player !== name)
  
  if (currentPlayerIndex >= players.length && players.length > 0) {
    currentPlayerIndex = 0
  }
  renderPlayers()
  renderTeams()
  renderDraftBoard()
  updateCurrentPicker()
}

function renderPlayers() {
  const container = document.getElementById('currentPlayers')
  container.innerHTML = players.map(player => 
    `<div class="player-tag">
      ${player} 
      <span style="cursor: pointer; margin-left: 8px;" onclick="removePlayer('${player}')">&times;</span>
    </div>`
  ).join('')
}

function updateCurrentPicker() {
  const picker = document.getElementById('currentPicker')
  if (players.length === 0) {
    picker.textContent = 'Add players to start drafting'
  } else {
    picker.textContent = `Current picker: ${players[currentPlayerIndex]}`
  }
}

// Team selection
function selectTeam(abbreviation) {
  if (players.length === 0) {
    alert('Add players first!')
    return
  }
  
  if (selectedTeams.has(abbreviation)) {
    // Already selected, maybe allow unselecting?
    return
  }
  
  const currentPlayer = players[currentPlayerIndex]
  const team = teamData.find(t => t.abbreviation === abbreviation)
  
  selectedTeams.set(abbreviation, currentPlayer)
  draftOrder.push({
    player: currentPlayer,
    team: abbreviation,
    teamName: team?.name || abbreviation,
    teamLogo: team?.logo || '',
    pickNumber: draftOrder.length + 1
  })
  
  // Move to next player
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length
  
  renderTeams()
  renderDraftBoard()
  updateCurrentPicker()
}

// Team rendering and sorting
function sortTeams() {
  const sortBy = document.getElementById('sortSelect').value
  
  teamData.sort((a, b) => {
    switch (sortBy) {
      case 'wins-desc':
        return b.wins2024 - a.wins2024
      case 'wins-asc':
        return a.wins2024 - b.wins2024
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      default:
        return b.wins2024 - a.wins2024
    }
  })
  
  renderTeams()
}

function renderTeams() {
  const container = document.getElementById('teamsGrid')
  const hideSelected = document.getElementById('hideSelected')?.checked ?? true
  
  // Filter teams based on hide selected setting
  const teamsToShow = hideSelected 
    ? teamData.filter(team => !selectedTeams.has(team.abbreviation))
    : teamData
  
  container.innerHTML = teamsToShow.map(team => {
    const isSelected = selectedTeams.has(team.abbreviation)
    const selectedBy = selectedTeams.get(team.abbreviation)
    
    return `
      <div class="team-card ${isSelected ? 'selected' : ''}" 
           onclick="${!isSelected ? `selectTeam('${team.abbreviation}')` : ''}"
           style="${!isSelected ? 'cursor: pointer;' : 'cursor: default; opacity: 0.6;'}">
        <div class="team-header">
          <img src="${team.logo}" alt="${team.name}" class="team-logo" 
               onerror="this.style.display='none'">
          <div class="team-name">${team.name}</div>
        </div>
        <div class="team-stats">
          2024 Wins: ${team.wins2024} | Current: ${team.currentRecord}
        </div>
        ${isSelected ? `<div class="team-picker">Selected by: ${selectedBy}</div>` : ''}
      </div>
    `
  }).join('')
  
  // Show a message if all teams are hidden
  if (teamsToShow.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px; opacity: 0.7;">
        <p style="font-size: 18px;">All teams have been selected!</p>
        <p>Uncheck "Hide selected teams" to see all teams.</p>
      </div>
    `
  }
}

// Render the draft board sidebar
function renderDraftBoard() {
  const container = document.getElementById('draftBoard')
  
  if (players.length === 0) {
    container.innerHTML = `
      <p style="opacity: 0.7; text-align: center; font-style: italic;">
        Add players and start drafting to see picks here
      </p>
    `
    return
  }
  
  // Group picks by player
  const picksByPlayer = {}
  players.forEach(player => {
    picksByPlayer[player] = draftOrder.filter(pick => pick.player === player)
  })
  
  container.innerHTML = players.map(player => {
    const picks = picksByPlayer[player] || []
    return `
      <div class="player-picks">
        <h4>${player} (${picks.length} picks)</h4>
        ${picks.length === 0 ? 
          `<p style="opacity: 0.6; font-style: italic; font-size: 12px;">No picks yet</p>` :
          picks.map(pick => `
            <div class="pick-item">
              <div class="pick-order">${pick.pickNumber}</div>
              <img src="${pick.teamLogo}" alt="${pick.teamName}" class="pick-logo" 
                   onerror="this.style.display='none'">
              <span>${pick.team}</span>
            </div>
          `).join('')
        }
      </div>
    `
  }).join('')
}

// Export current draft state (for console debugging)
function exportDraftState() {
  const draft = {}
  for (let [team, player] of selectedTeams) {
    if (!draft[player]) draft[player] = []
    draft[player].push(team)
  }
  console.log('Current Draft State:', draft)
  return draft
}

// Global functions for HTML
window.addPlayer = addPlayer
window.removePlayer = removePlayer
window.selectTeam = selectTeam
window.sortTeams = sortTeams
window.exportDraftState = exportDraftState

// Allow Enter key to add player
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('playerInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addPlayer()
    }
  })
})

// Initialize when page loads
init()
