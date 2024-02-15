// Tic Tac Toe Game

const Gameboard = (function () {
  let gameboard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  const getGameboard = () => gameboard;

  const updateBoard = (row, column, marker) => {
    if (gameboard[row][column] === "") {
      gameboard[row][column] = marker;
    }
  };

  const positionIsUnavailable = (row, column) => gameboard[row][column] !== "";

  const isFull = () => !gameboard.flat().includes("");

  const checkWinner = () => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (
        gameboard[i][0] !== "" &&
        gameboard[i][0] === gameboard[i][1] &&
        gameboard[i][0] === gameboard[i][2]
      ) {
        return gameboard[i][0];
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (
        gameboard[0][i] !== "" &&
        gameboard[0][i] === gameboard[1][i] &&
        gameboard[0][i] === gameboard[2][i]
      ) {
        return gameboard[0][i];
      }
    }

    // Check diagonals
    if (
      gameboard[0][0] !== "" &&
      gameboard[0][0] === gameboard[1][1] &&
      gameboard[0][0] === gameboard[2][2]
    ) {
      return gameboard[0][0];
    }
    if (
      gameboard[0][2] !== "" &&
      gameboard[0][2] === gameboard[1][1] &&
      gameboard[0][2] === gameboard[2][0]
    ) {
      return gameboard[0][2];
    }

    // No winner yet
    return "";
  };

  const resetBoard = () => {
    gameboard = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  };

  return {
    getGameboard,
    updateBoard,
    positionIsUnavailable,
    isFull,
    checkWinner,
    resetBoard,
  };
})();

function createPlayer(name, marker) {
  const getMarker = () => marker;
  return { name, getMarker };
}

const GameController = ((player1name = "Player1", player2name = "Player2") => {
  const board = Gameboard;
  let gameOver = false;
  const players = [
    createPlayer(player1name, "X"),
    createPlayer(player2name, "O"),
  ];
  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    console.log(board.getGameboard());
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playGame = () => {
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const playRound = (row, column) => {
      if (board.positionIsUnavailable(row, column)) {
        console.log(
          `Invalid move! Please try again. Position row ${row}, column ${column} is already marked.`
        );
        printNewRound();
        play();
      } else {
        // Turn for the current player
        console.log(
          `${
            getActivePlayer().name
          } marks row ${row}, column ${column} with ${getActivePlayer().getMarker()}...`
        );
        board.updateBoard(row, column, getActivePlayer().getMarker());

        // Check for a winner
        const winnerMarker = board.checkWinner();
        if (winnerMarker !== "") {
          console.log(board.getGameboard());
          console.log(
            `${getActivePlayer().name}, playing with '${winnerMarker}'s, wins!`
          );
          gameOver = true;
          rl.close();
          return;
        }

        // Switch player turn
        switchPlayerTurn();
        printNewRound();
        play();
      }
    };

    const play = () => {
      if (board.isFull()) {
        console.log("The game is a tie!");
        gameOver = true;
        rl.close();
        return;
      } else {
        rl.question(
          "Enter your move (row no. (0-2) column no. (0-2) e.g., 02): ",
          (answer) => {
            answer = answer.trim();

            if (answer.match(/[^0-2]/) || answer.length !== 2) {
              console.log("Invalid input. Please enter a valid move.");
              play();
              return;
            }

            const row = parseInt(answer[0]);
            const col = parseInt(answer[1]);
            playRound(row, col);
          }
        );
      }
    };

    if (!gameOver) {
      // Initial play game message
      printNewRound();
      play();
    }
    rl.on("close", () => {
      console.log("Game finished. Thanks for playing!");
    });
  };

  return { playGame, getActivePlayer };
})();

// Plays a single Tic Tac Toe Game in the console:
GameController.playGame();
