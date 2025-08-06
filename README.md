# NFL Wins Pool

This is a simple web application for running a "wins pool" for the NFL season. Players draft teams, and the player with the most wins at the end of the season is the winner.

The application uses the ESPN API to fetch team data, schedules, and scores. It uses Firebase for storing player and team selection data.

## Setup

1.  **Clone the repository.**

2.  **Create a Firebase project.**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Click "Add project" and follow the steps to create a new project.
    *   Once your project is created, go to the "Realtime Database" section and create a new database. Start in **test mode** for easy setup.
    *   In your project settings, click the "</>" icon (for web) to add a web app.
    *   Firebase will give you a `firebaseConfig` object. Copy this object.

3.  **Configure the application.**
    *   Create a new file named `firebase-config.js` in the root of the project.
    *   Add the following code to the file, pasting your `firebaseConfig` object where indicated:
        ```javascript
        const firebaseConfig = {
          // Paste your firebaseConfig object here
        };

        export { firebaseConfig };
        ```
    *   The `firebase-config.js` file is included in the `.gitignore` file, so your credentials will not be committed to the repository.

## Usage

### Team Selection

1.  Open the `selection.html` file in your browser.
2.  Use the input field to add players to the pool.
3.  To select teams for a player, click the radio button next to their name.
4.  Click on the available teams to assign them to the selected player.
5.  The selections are saved automatically to the Firebase database.

### Viewing the Standings

1.  Open the `index.html` file in your browser.
2.  The application will display the current standings, with the total number of wins for each player.
3.  The data is updated automatically from the ESPN API.
