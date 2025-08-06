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

import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
  const playersRef = ref(window.db, 'players');
  const snapshot = await get(playersRef);
  const players = snapshot.val();

  if (!players) {
    return [];
  }

  const drafts = Object.values(players).map(player => {
    return {
      name: player.name,
      teams: player.teams ? Object.keys(player.teams) : []
    };
  });

  const stats = await Promise.all(drafts.map(async draft => {
    return {
      name: draft.name,
      teams: await Promise.all(draft.teams.map(async team => {
        const teamInfo = getTeam(team).team
        const record = await getRecord(teamInfo)
        teamInfo.wins = record.stats.find(stat => stat.name === 'wins').value
        teamInfo.record = record.summary
        teamInfo.nextGame = getCurrentWeekGame(teamInfo)
        return teamInfo
      }))
    }
  }));

  return stats;
}

export {api, loadAllStats}