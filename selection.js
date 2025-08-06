import { ref, onValue, push, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

let allTeams = [];
let players = {};
let selectedTeams = new Set();

const playerNameInput = document.getElementById('player-name');
const addPlayerBtn = document.getElementById('add-player-btn');
const playersContainer = document.getElementById('players-container');
const availableTeamsContainer = document.getElementById('available-teams-container');

async function fetchAllTeams() {
  const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams');
  const json = await response.json();
  allTeams = json.sports[0].leagues[0].teams.map(t => t.team);
  render();
}

function render() {
    renderPlayers();
    renderAvailableTeams();
}

function renderPlayers() {
    playersContainer.innerHTML = '';
    for (const playerId in players) {
        const player = players[playerId];
        const playerDiv = document.createElement('div');

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'player';
        radio.value = playerId;
        radio.id = `player-${playerId}`;

        const label = document.createElement('label');
        label.htmlFor = `player-${playerId}`;
        label.textContent = player.name;

        playerDiv.appendChild(radio);
        playerDiv.appendChild(label);

        const teamsList = document.createElement('ul');
        if (player.teams) {
            for (const teamAbbr in player.teams) {
                const team = allTeams.find(t => t.abbreviation === teamAbbr);
                const teamItem = document.createElement('li');
                teamItem.textContent = team ? team.displayName : teamAbbr;
                teamsList.appendChild(teamItem);
            }
        }
        playerDiv.appendChild(teamsList);
        playersContainer.appendChild(playerDiv);
    }
}

function renderAvailableTeams() {
    availableTeamsContainer.innerHTML = '';
    const available = allTeams.filter(team => !selectedTeams.has(team.abbreviation));
    available.forEach(team => {
        const teamButton = document.createElement('button');
        teamButton.textContent = team.displayName;
        teamButton.onclick = () => selectTeam(team.abbreviation);
        availableTeamsContainer.appendChild(teamButton);
    });
}

function selectTeam(teamAbbr) {
    const selectedPlayerId = getSelectedPlayerId();
    if (!selectedPlayerId) {
        alert('Please select a player first.');
        return;
    }

    const updates = {};
    updates[`/players/${selectedPlayerId}/teams/${teamAbbr}`] = true;
    updates[`/selections/${teamAbbr}`] = true;

    update(ref(window.db), updates);
}

function getSelectedPlayerId() {
    const selectedRadio = document.querySelector('input[name="player"]:checked');
    return selectedRadio ? selectedRadio.value : null;
}

addPlayerBtn.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        push(ref(window.db, 'players'), { name: playerName });
        playerNameInput.value = '';
    }
});

const playersRef = ref(window.db, 'players');
onValue(playersRef, (snapshot) => {
    players = snapshot.val() || {};
    selectedTeams.clear();
    for (const playerId in players) {
        const player = players[playerId];
        if (player.teams) {
            for (const teamAbbr in player.teams) {
                selectedTeams.add(teamAbbr);
            }
        }
    }
    render();
});

const selectionsRef = ref(window.db, 'selections');
onValue(selectionsRef, (snapshot) => {
    const selections = snapshot.val() || {};
    selectedTeams.clear();
    for (const teamAbbr in selections) {
        selectedTeams.add(teamAbbr);
    }
    render();
});

fetchAllTeams();
