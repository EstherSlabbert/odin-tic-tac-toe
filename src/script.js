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
    isFull,
    checkWinner,
    resetBoard,
  };
})();

const gameFlow = ((player1name = "Player1", player2name = "Player2") => {
  const createPlayer = (name, marker) => {
    const getMarker = () => marker;
    return { name, getMarker };
  };
  const player1 = createPlayer(player1name, "X");
  const player2 = createPlayer(player2name, "O");
  const players = [player1, player2];
  let activePlayer = players[0];

  function switchPlayerTurn() {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  const getActivePlayer = () => activePlayer;

  return { switchPlayerTurn, getActivePlayer };
})();

const playRound = (() => {
  const gameGrid = document.querySelectorAll(".cell");
  const gameStateTextArea = document.getElementById("active-player");
  const resetButton = document.getElementById("reset");
  let gameOver = false;

  const updateDisplay = () => {
    let gameboard = Gameboard.getGameboard();
    let rows = document.querySelectorAll(".row");
    gameboard.forEach((row, rowIndex) => {
      let htmlRow = rows[rowIndex];
      row.forEach((cellValue, columnIndex) => {
        let cell = htmlRow.children[columnIndex];
        cell.textContent = cellValue;
      });
    });
  };

  // set initial display
  updateDisplay();
  gameStateTextArea.innerHTML = `${
    gameFlow.getActivePlayer().name
  }'s turn (marker: ${gameFlow.getActivePlayer().getMarker()})`;

  const handleBoardSquareClick = (boardSquare) => {
    // prevents rewriting
    if (boardSquare.innerHTML == "") {
      const row = boardSquare.getAttribute("data-row");
      const column = boardSquare.getAttribute("data-column");
      if (!gameOver) {
        Gameboard.updateBoard(
          row,
          column,
          gameFlow.getActivePlayer().getMarker()
        );
        updateDisplay();
        checkGameOver();
        if (!gameOver) {
          gameFlow.switchPlayerTurn();
          gameStateTextArea.innerHTML = `${
            gameFlow.getActivePlayer().name
          }'s turn (marker: ${gameFlow.getActivePlayer().getMarker()})`;
        }
      }
    }
  };

  Array.from(gameGrid).forEach((boardSquare) => {
    boardSquare.addEventListener("click", (event) => {
      const boardSquare = event.target;
      handleBoardSquareClick(boardSquare);
    });
  });

  const removeEventListeners = () => {
    Array.from(gameGrid).forEach((boardSquare) => {
      boardSquare.removeEventListener("click", (event) => {
        const boardSquare = event.target;
        handleBoardSquareClick(boardSquare);
      });
    });
  };

  resetButton.addEventListener("click", () => {
    Gameboard.resetBoard();
    gameStateTextArea.innerHTML = "";
    gameOver = false;
    Array.from(gameGrid).forEach((boardSquare) => {
      boardSquare.innerHTML = "";
    });
    document.getElementById("end").innerHTML = "";
    removeEventListeners();
    playRound;
  });

  const checkGameOver = () => {
    if (Gameboard.isFull()) {
      gameOver = true;
      gameStateTextArea.innerHTML = `It's a tie!`;
    }
    if (Gameboard.checkWinner() !== "") {
      gameOver = true;
      gameStateTextArea.innerHTML = `${
        gameFlow.getActivePlayer().name
      } wins! (marker: ${gameFlow.getActivePlayer().getMarker()})`;
    }
    if (gameOver) {
      document.getElementById("end").innerHTML =
        "Game finished. Thanks for playing!";
      removeEventListeners();
      return;
    }
  };
})();
