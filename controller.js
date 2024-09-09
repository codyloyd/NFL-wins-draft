const api = {}

// get all teams
const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams')
const json = await response.json()
const allTeams = json.sports[0].leagues[0].teams
api.allTeams = allTeams

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
  }
]

const getTeam = (abbr) => {
  return allTeams.find(team =>  {
      return team.team.abbreviation === abbr
  })
}

const getRecord = async (team) => {
  const url = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2024/types/2/teams/${team.id}/record`
  const response = await fetch(url)
  const json = await response.json()
  return json.items.find(item => item.name === 'overall')
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
        return teamInfo
      }))
    }
    }))

  return stats
}

export {api, loadAllStats}