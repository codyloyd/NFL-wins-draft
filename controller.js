const api = {}

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

// Array of all 32 NFL teams for reference
const allNFLTeams = [
  'ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE', 
  'DAL', 'DEN', 'DET', 'GB', 'HOU', 'IND', 'JAX', 'KC', 
  'LAC', 'LAR', 'LV', 'MIA', 'MIN', 'NE', 'NO', 'NYG', 
  'NYJ', 'PHI', 'PIT', 'SEA', 'SF', 'TB', 'TEN', 'WSH'
]

const drafts = [
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
]

const getTeam = (abbr) => {
  return allTeams.find(team =>  {
      return team.team.abbreviation === abbr
  })
}

const getRecord = async (team) => {
  const url = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2025/types/2/teams/${team.id}/record`
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

export {api, loadAllStats, allNFLTeams}