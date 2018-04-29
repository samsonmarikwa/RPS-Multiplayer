$(document).ready(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAlQKYKtWoCE67LWcNHH8ih9tqUeffZM8c",
        authDomain: "rockpaperscissors-2bc08.firebaseapp.com",
        databaseURL: "https://rockpaperscissors-2bc08.firebaseio.com",
        projectId: "rockpaperscissors-2bc08",
        storageBucket: "",
        messagingSenderId: "786215929145"
    };
    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();

    // create objects for the players
    var players = {
        connectedUsers: 0,
        whoIsPlaying: "player1",
        winner: "",
        player1: {
            name: "",
            active: true,
            won: 0,
            loss: 0,
        },
        player2: {
            name: "",
            active: false,
            won: 0,
            loss: 0,
        }
    }

    var gameOn = true;
    var switchUser = 0;
    var playerRun = 0;
    var playerInfo = "";
    var greeting = "";
    var player1Name = "";
    var player2Name = "";


    // create player elements and display on ui
    function createPlayerElements() {

        if (switchUser == 0) {
            greeting = "Hi Player 1: ";
            playerInfo = "Please enter your name and click Start.";
        } else if (switchUser == 1) {
            greeting = "Hi Player 2: ";
            playerInfo = "Please enter your name and click Start.";
        }

        var paragraph = document.getElementById("player-identity");

        // greet player
        document.getElementById("player-identity").innerHTML = greeting;

        // create textbox
        var playerInp = document.createElement("INPUT");
        playerInp.setAttribute("type", "text");
        playerInp.setAttribute("value", "");
        playerInp.setAttribute("id", "playerName");
        paragraph.appendChild(playerInp);

        //create start button
        var startBtn = document.createElement("INPUT");
        startBtn.setAttribute("type", "button");
        startBtn.setAttribute("value", "   Start   ");
        startBtn.setAttribute("id", "startBtn");
        paragraph.appendChild(startBtn);
        document.getElementById("startBtn").setAttribute("class", "btn");

        // player instructions
        document.getElementById("player-info").innerHTML = playerInfo;

        // add event listener for the start button for player1
        document.getElementById("startBtn").addEventListener("click", getPlayer);
    }


    function getPlayer() {

        document.getElementById("player-info").innerHTML = "Waiting for another player to join.";

        // update player name
        if (switchUser == 0) {
            player1Name = document.getElementById("playerName").value;
        } else if (switchUser == 1) {
            player2Name = document.getElementById("playerName").value;
        }

        // update firebase player 1 details
        if (switchUser == 0) {
            players.player1.name = playerName;
            playerInfo = "Waiting for another player to join.";
            database.ref().set({
                switchUser: 1,
                player1Name: player1Name,
                player1Choice: "",
                checkWinnerFl: false,
                whoIsPlaying: "none",
                winner: "",
                player2Name: "Player 2",
                playerInfo: playerInfo,
                greeting: "Hi Player 2: ",
                playerRun: playerRun
            });
        } else {
            playerInfo = "Player1's turn to select Rock, Paper or Scissors";
            database.ref().update({
                switchUser: 0,
                player2Name: player2Name,
                player2Choice: "",
                checkWinnerFl: false,
                whoIsPlaying: "player1",
                playerInfo: playerInfo,
                playerRun
            });
        }

        // remove typed name in textbox
        document.getElementById("playerName").value = "";

        // display player instruction
        document.getElementById("player-info").innerHTML = playerInfo;

        // display player names in the respective columns
        var paragraph = document.getElementById("player1");
        paragraph.innerHTML = "<strong>" + players.player1.name + "</strong>";
        paragraph = document.getElementById("player2");
        paragraph.innerHTML = "<strong>" + players.player2.name + "</strong>";

    }

    function checkWinner(pL1Choice, pL2Choice, player1Wins, player1Loss, player2Wins, player2Loss) {
        console.log("Checking Winner");

        // Determine outcome of the game (win/loss) and increments the appropriate number
        if ((pL1Choice === "R") || (pL1Choice === "P") || (pL1Choice === "S")) {

            if ((pL1Choice === "R") && (pL2Choice === "S")) {

                database.ref().update({
                    winner: "Player 1 Won",
                    player1Wins: ++player1Wins,
                    player2Loss: ++player2Loss
                });

            } else if ((pL1Choice === "R") && (pL2Choice === "P")) {

                database.ref().update({
                    winner: "Player 2 Won",
                    player2Wins: ++player2Wins,
                    player1Loss: ++player1Loss
                });

            } else if ((pL1Choice === "S") && (pL2Choice === "R")) {

                database.ref().update({
                    winner: "Player 2 Won",
                    player2Wins: ++player2Wins,
                    player1Loss: ++player1Loss
                });

            } else if ((pL1Choice === "S") && (pL2Choice === "P")) {

                database.ref().update({
                    winner: "Player 1 Won",
                    player1Wins: ++player1Wins,
                    player2Loss: ++player2Loss
                });

            } else if ((pL1Choice === "P") && (pL2Choice === "R")) {

                database.ref().update({
                    winner: "Player 1 Won",
                    player1Wins: ++player1Wins,
                    player2Loss: ++player2Loss
                });

            } else if ((pL1Choice === "P") && (pL2Choice === "S")) {

                database.ref().update({
                    winner: "Player 2 Won",
                    player2Wins: ++player2Wins,
                    player1Loss: ++player1Loss
                });

            } else if (pL1Choice === pL2Choice) {

                database.ref().update({
                    winner: "You are tied"
                });

            }

            /*      // Creating a variable to hold our new HTML. Our HTML now keeps track of the user and computer guesses, and wins/losses/ties.
                 var html =
                     "<p>Player 1 chose: " + pL1Choice + "</p>" +
                     "<p>Player 2 chose: " + pL2Choice + "</p>" +
                     "<p>wins: " + wins + "</p>" +
                     "<p>losses: " + losses + "</p>" +
                     "<p>ties: " + ties + "</p>";

                 // Set the inner HTML contents of the #game div to our html string
                  document.querySelector("#game").innerHTML = html;
                  */
        }

        database.ref().update({
            checkWinner: false
        });

    }


    // event listeners for Player choices
    document.getElementById("pl1R").onclick = function(event) {
        updatePlayerChoice("player1", "R");
    }

    document.getElementById("pl1P").onclick = function(event) {
        updatePlayerChoice("player1", "P");
    }

    document.getElementById("pl1S").onclick = function(event) {
        updatePlayerChoice("player1", "S");
    }

    document.getElementById("pl2R").onclick = function(event) {
        updatePlayerChoice("player2", "R");
    }

    document.getElementById("pl2P").onclick = function(event) {
        updatePlayerChoice("player2", "P");
    }

    document.getElementById("pl2S").onclick = function(event) {
        updatePlayerChoice("player2", "S");
    }

    // update player's choice on firebase
    function updatePlayerChoice(playerId, choice) {
        if (playerId === "player1") {
            database.ref().update({
                player1Choice: choice,
                whoIsPlaying: "player2",
                checkWinnerFl: false
            });
        } else if (playerId === "player2") {
            database.ref().update({
                player2Choice: choice,
                whoIsPlaying: "player1",
                checkWinnerFl: true
            });
        }
    }


    // Firebase is always watching for changes to the data.
    // When changes occurs it will print them to console and html
    database.ref().on("value", function(snapshot) {

        // Print the initial data to the console.
        console.log(snapshot.val());
        switchUser = snapshot.val().switchUser;

        players.player1.name = snapshot.val().player1Name;
        players.player1.active = snapshot.val().player1Active;
        players.player1.won = snapshot.val().player1Won;
        players.player1.loss = snapshot.val().loss;

        players.player2.name = snapshot.val().player2Name;
        players.player2.active = snapshot.val().player2Active;
        players.player2.won = snapshot.val().player2Won;
        players.player2.loss = snapshot.val().loss;

        greeting = snapshot.val().greeting;

        // Log the value of the various properties
        console.log("Snapshot player 1 " + snapshot.val().player1Name);
        console.log("Snapshot player 2 " + snapshot.val().player2Name);

        // display player instruction
        document.getElementById("player-info").innerHTML = playerInfo;

        // display player names in the respective columns
        var paragraph = document.getElementById("player1");
        paragraph.innerHTML = "<strong>" + players.player1.name + "</strong>";
        paragraph = document.getElementById("player2");
        paragraph.innerHTML = "<strong>" + players.player2.name + "</strong>";

        if (switchUser == 0 && snapshot.val().playerRun == 0) {;
        }

        if (switchUser == 0 && snapshot.val().playerRun == 1) {

        }
        if (switchUser == 0 && snapshot.val().playerRun == 2) {

        }

        console.log("CheckWinnerFl = " + snapshot.val().checkWinnerFL);



        if (snapshot.val().checkWinnerFL) {
            var pl1C = snapshot.val().player1Choice;
            var pl2C = snapshot.val().player2Choice;
            var pl1W = snapshot.val().player1Wins;
            var pl1L = snapshot.val().player1Loss;
            var pl2W = snapshot.val().player2Wins;
            var pl2L = snapshot.val().player2Loss;

            checkWinner(pl1C, pl2C, pl1W, pl1L, pl2W, pl2L);
        }

        snapshot.val().playerRun += 1;
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    // document.getElementById("game-result").style.visibility = 'hidden';

    createPlayerElements();

});