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

    var switchUser = 0;
    var playerRun = 0;
    var playerInfo = "";
    var player1Name = "";
    var player2Name = "";
    var chatMessage = "";
    var chatInd = 0;

    // create player elements and display on ui
    function createPlayerElements() {

        var paragraph = document.getElementById("player-identity");

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

        // add event listener for the start button for player1
        document.getElementById("startBtn").addEventListener("click", getPlayer);
    }


    function getPlayer() {

        var paragraph = document.getElementById("player1");
        paragraph.innerHTML = "<strong>Player 1</strong>";
        paragraph = document.getElementById("player2");
        paragraph.innerHTML = "<strong>Player 2</strong>";

        // update player name
        if (switchUser == 0) {
            player1Name = document.getElementById("playerName").value;
        } else if (switchUser == 1) {
            player2Name = document.getElementById("playerName").value;
        }

        // update firebase player 1 details
        if (switchUser == 0) {
            players.player1.name = playerName;
            database.ref().set({
                switchUser: 1,
                player1Name: player1Name,
                player1Choice: "",
                checkWinner: false,
                whoIsPlaying: "none",
                winner: "",
                player2Name: "Player 2",
                playerInfo: "Waiting for another player to join.",
                playerRun: 1,
                player1Wins: 0,
                player1Loss: 0,
                chatInd: 1,
                chatMessage: ""
            });

            document.getElementById("player-info").innerHTML = "Waiting for another player to join";

            var playerInfo = firebase.database().ref();
            playerInfo.on("value", function(info) {
                document.getElementById("player1").innerHTML = "<strong>" + players.player1.name + "</strong>";

            });

        } else {
            database.ref().update({
                switchUser: 0,
                player2Name: player2Name,
                player2Choice: "",
                checkWinner: false,
                whoIsPlaying: "player1",
                playerInfo: players.player1.name + "'s turn to select Rock, Paper or Scissors",
                playerRun: 2,
                player2Wins: 0,
                player2Loss: 0
            });

            var playerInfo = firebase.database().ref();
            playerInfo.on("value", function(info) {
                // display player names in the respective columns
                document.getElementById("player1").innerHTML = "<strong>" + info.val().player1Name + "</strong>";
                document.getElementById("player2").innerHTML = "<strong>" + info.val().player2Name + "</strong>";

            });

        }

        // remove typed name in textbox
        document.getElementById("playerName").value = "";
        document.getElementById("playerName").disabled = true;
        document.getElementById("startBtn").disabled = true;

    }

    // event listener for chats
    document.getElementById("msg-btn").onclick = function(event) {
        sendMessage();
        document.getElementById("message").innerHTML = "";
    }

    function sendMessage() {
        var chat = firebase.database().ref();
        chat.on("value", function(snapShot) {
            chatMessage = snapShot.val().chatMessage;

            // display message on UI
            document.getElementById("message-display").innerHTML = chatMessage;
            document.getElementById("message-display").scrollTop = document.getElementById("message-display").scrollHeight;
        });

        database.ref().update({
            chatMessage: chatMessage + document.getElementById("message").value + "\n"
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

        if (playerId == "player1") {
            database.ref().update({
                player1Choice: choice,
                whoIsPlaying: "player2",
                checkWinner: false,
                playerRun: playerRun
            });
        }

        if (playerId == "player2") {
            database.ref().update({
                player2Choice: choice,
                whoIsPlaying: "player1",
                checkWinner: true,
                playerRun: playerRun
            });
        }

        var whoPlays = firebase.database().ref();
        whoPlays.on("value", function(whoPlays) {

            if (whoPlays.val().whoIsPlaying == 'player1') {
                document.getElementById("player-info").innerHTML = whoPlays.val().player1Name + "'s turn to play";
                document.getElementById("player1Div").style.borderColor = "#ff00ff";
                document.getElementById("player2Div").style.borderColor = "#5c8a8a";

            } else if (whoPlays.val().whoIsPlaying == 'player2') {
                document.getElementById("player-info").innerHTML = whoPlays.val().player2Name + "'s turn to play";
                document.getElementById("player2Div").style.borderColor = "#ff00ff";
                document.getElementById("player1Div").style.borderColor = "#5c8a8a";
            }

        });

    }

    function checkWinner(pL1Choice, pL2Choice, player1Wins, player1Loss, player2Wins, player2Loss) {

        // Determine outcome of the game (win/loss) and increments the appropriate number
        if ((pL1Choice === "R") && (pL2Choice === "S")) {

            database.ref().update({
                winner: "Player 1 Won",
                player1Wins: ++player1Wins,
                player2Loss: ++player2Loss,
                checkWinner: false
            });

        } else if ((pL1Choice === "R") && (pL2Choice === "P")) {

            database.ref().update({
                winner: "Player 2 Won",
                player2Wins: ++player2Wins,
                player1Loss: ++player1Loss,
                checkWinner: false
            });

        } else if ((pL1Choice === "S") && (pL2Choice === "R")) {

            database.ref().update({
                winner: "Player 2 Won",
                player2Wins: ++player2Wins,
                player1Loss: ++player1Loss,
                checkWinner: false
            });

        } else if ((pL1Choice === "S") && (pL2Choice === "P")) {

            database.ref().update({
                winner: "Player 1 Won",
                player1Wins: ++player1Wins,
                player2Loss: ++player2Loss,
                checkWinner: false
            });

        } else if ((pL1Choice === "P") && (pL2Choice === "R")) {

            database.ref().update({
                winner: "Player 1 Won",
                player1Wins: ++player1Wins,
                player2Loss: ++player2Loss,
                checkWinner: false
            });

        } else if ((pL1Choice === "P") && (pL2Choice === "S")) {

            database.ref().update({
                winner: "Player 2 Won",
                player2Wins: ++player2Wins,
                player1Loss: ++player1Loss,
                checkWinner: false
            });

        } else if (pL1Choice === pL2Choice) {

            database.ref().update({
                winner: "You are tied",
                checkWinner: false
            });

        }

        /* Update Result Window
         */

        var gameResult = firebase.database().ref();
        gameResult.on("value", function(game) {
            var winner = game.val().winner;
            var player1W = game.val().player1Wins;
            var player1L = game.val().player1Loss;
            var player2W = game.val().player2Wins;
            var player2L = game.val().player2Loss;
            document.getElementById("game-result").innerHTML = winner;
            document.getElementById("pl1-win").innerHTML = player1W;
            document.getElementById("pl1-losses").innerHTML = player1L;
            document.getElementById("pl2-win").innerHTML = player2W;
            document.getElementById("pl2-losses").innerHTML = player2L;

        });

    }

    // Firebase is always watching for changes to the data.
    // When changes occurs it will print them to console and html
    database.ref().on("value", function(snapshot) {

        switchUser = snapshot.val().switchUser;

        // switchUser ensures we do not display the users in the previous session before they are re-initialized
        if (switchUser == 1) {
            document.getElementById("player1").innerHTML = "<strong>" + snapshot.val().player1Name + "</strong>";
        }

        if (snapshot.val().playerRun == 2) {
            document.getElementById("player2").innerHTML = "<strong>" + snapshot.val().player2Name + "</strong>";
            document.getElementById("player-info").innerHTML = snapshot.val().player1Name + "'s turn to play";
            document.getElementById("player1Div").style.borderColor = "#ff00ff";
            document.getElementById("player2Div").style.borderColor = "#5c8a8a";
        }

        if (snapshot.val().playerRun == 3) {
            document.getElementById("player-info").innerHTML = snapshot.val().player2Name + "'s turn to play";
            document.getElementById("player2Div").style.borderColor = "#ff00ff";
            document.getElementById("player1Div").style.borderColor = "#5c8a8a";
        }

        ++playerRun;

        if (chatInd == 1) {
            // display message on UI
            document.getElementById("message-display").innerHTML = snapshot.val().chatMessage;
            document.getElementById("message-display").scrollTop = document.getElementById("message-display").scrollHeight;
        }

        // enable chat message display after clearing chat messages from previous sessions
        chatInd = snapshot.val().chatInd;

        players.player1.name = snapshot.val().player1Name;
        players.player2.name = snapshot.val().player2Name;

        // The second player sets the check winner flag to true so we can check who won between the two players
        if (snapshot.val().checkWinner) {
            var pl1C = snapshot.val().player1Choice;
            var pl2C = snapshot.val().player2Choice;
            var pl1W = snapshot.val().player1Wins;
            var pl1L = snapshot.val().player1Loss;
            var pl2W = snapshot.val().player2Wins;
            var pl2L = snapshot.val().player2Loss;

            checkWinner(pl1C, pl2C, pl1W, pl1L, pl2W, pl2L);
        }

    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    createPlayerElements();

});