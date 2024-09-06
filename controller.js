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
  const stats = []
  drafts.forEach(draft => {
    const draftStats = {
      name: draft.name,
      teams: []
    }
    draft.teams.forEach(async team => {
      const teamInfo = getTeam(team).team
      const record = await getRecord(teamInfo)
      teamInfo.wins = await record.stats.find(stat => stat.name === 'wins').value
      teamInfo.record = record.summary
      draftStats.teams.push(teamInfo)
    })
    stats.push(draftStats)
  })

  return stats
}

export {api, loadAllStats}