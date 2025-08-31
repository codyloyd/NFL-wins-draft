const api = {
  currentYear: 2025
}

// Initialize API data
const initializeApiData = async (year = 2024) => {
  // get all teams
  const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams')
  const json = await response.json()
  const allTeams = json.sports[0].leagues[0].teams
  api.allTeams = allTeams

  const scheduleResponse = await fetch('https://cdn.espn.com/core/nfl/schedule?xhr=1')
  const scheduleJson = await scheduleResponse.json()
  const schedule = scheduleJson.content.schedule
  api.schedule = schedule
  api.week = scheduleJson.content.parameters.week
  api.currentYear = year
}

// Initialize with current year
await initializeApiData(2024)

// Array of all 32 NFL teams for reference
const allNFLTeams = [
  'ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE', 
  'DAL', 'DEN', 'DET', 'GB', 'HOU', 'IND', 'JAX', 'KC', 
  'LAC', 'LAR', 'LV', 'MIA', 'MIN', 'NE', 'NO', 'NYG', 
  'NYJ', 'PHI', 'PIT', 'SEA', 'SF', 'TB', 'TEN', 'WSH'
]

// Historical draft data
const historicalDrafts = {
  2024: [
    {
      name: 'Ethan',
      teams: ['SF', 'KC', 'GB', 'DAL', 'CHI']
    },
    {
      name: 'Mom',
      teams: ['HOU', 'MIA', 'CIN', 'PHI', 'JAX']
    },
    {
      name: 'Dad',
      teams: ['BAL', 'DET', 'BUF', 'ATL', 'TB']
    },
    {
      name: 'Micah',
      teams: ['LAR', 'CLE', 'PIT', 'SEA', 'ARI']
    },
    {
      name: 'LEFTOVERS',
      teams: ['TEN', 'NYJ', 'IND', 'CAR', 'MIN', 'LV', 'LAC', 'NYG', 'NO', 'DEN', 'WSH', 'NE']
    }
  ],
    2025: [
    {
      name: 'Ethan',
      teams: ['BUF', 'WSH', 'DET', 'TB', 'DEN']
    },
    {
      name: 'Kayla',
      teams: ['PHI', 'LAC', 'SF', 'JAX', 'HOU']
    },
    {
      name: 'Cody',
      teams: ['BAL', 'KC', 'GB', 'CIN', 'LAR']
    },
    {
      name: 'LEFTOVERS',
      teams: ['ARI', 'ATL', 'CAR', 'CHI', 'CLE', 'DAL', 'IND', 'LV', 'MIA', 'MIN', 'NE', 'NO', 'NYG', 'NYJ', 'PIT', 'SEA', 'TEN']
    }
  ]
}

// Current drafts - defaults to current year
let drafts = historicalDrafts[api.currentYear]

const getTeam = (abbr) => {
  return api.allTeams.find(team =>  {
      return team.team.abbreviation === abbr
  })
}

const getRecord = async (team) => {
  const url = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${api.currentYear}/types/2/teams/${team.id}/record`
  const response = await fetch(url)
  const json = await response.json()
  return json.items.find(item => item.name === 'overall')
}

const getCurrentWeekGame = (team) => {
  let game = null
  Object.values(api.schedule).forEach(day => {
    day.games.forEach(g => {
      if (g.competitions[0].competitors.find(c => c.team.abbreviation === team.abbreviation)) {
        game = g
      }
    })
  })
  return game
}

const loadAllStats = async () => {
  const stats = await Promise.all(drafts.map(async draft => {
    return {
      name: draft.name,
      teams: await Promise.all(draft.teams.map(async team => {
        const teamInfo = getTeam(team).team
        const record = await getRecord(teamInfo)
        teamInfo.wins = record.stats.find(stat => stat.name === 'wins').value
        teamInfo.record = record.summary
        teamInfo.nextGame = getCurrentWeekGame(teamInfo)
        // debugger
        return teamInfo
      }))
    }
    }))

  return stats
}

// Function to change the active year
const changeYear = async (year) => {
  if (!historicalDrafts[year]) {
    console.error(`No draft data available for year ${year}`)
    return false
  }
  
  api.currentYear = year
  drafts = historicalDrafts[year]
  
  // Reinitialize API data for the selected year
  await initializeApiData(year)
  
  return true
}

// Function to get available years
const getAvailableYears = () => {
  return Object.keys(historicalDrafts).map(year => parseInt(year)).sort((a, b) => b - a)
}

export {api, loadAllStats, allNFLTeams, changeYear, getAvailableYears, historicalDrafts}
