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

const gameFlow = (() => {
  const createPlayer = (name, marker) => {
    const getMarker = () => marker;
    return { name, getMarker };
  };
  let player1name = "Player 1";
  let player2name = "Player 2";
  let players = [
    createPlayer(player1name, "X"),
    createPlayer(player2name, "O"),
  ];
  let activePlayer = players[0];
  const updatePlayerNames = (name1, name2) => {
    player1name = name1;
    player2name = name2;
    players = [createPlayer(player1name, "X"), createPlayer(player2name, "O")];
    activePlayer = players[0];
  };
  const getPlayerNames = () => {
    return { player1name, player2name };
  };

  function switchPlayerTurn() {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  const getActivePlayer = () => activePlayer;

  return {
    switchPlayerTurn,
    updatePlayerNames,
    getPlayerNames,
    getActivePlayer,
  };
})();

const handlePlayerNames = (() => {
  const openDialogButton = document.getElementById("open-dialog");
  const dialog = document.querySelector("dialog.player-names");
  const submitForm = document.querySelector("form#form");
  const closeButton = document.querySelector("button.close-btn");

  openDialogButton.addEventListener("click", () => {
    dialog.showModal();
  });

  closeButton.addEventListener("click", () => {
    dialog.close();
  });

  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = document.getElementById("form");
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData);
    let player1Name = "Player 1";
    let player2Name = "Player 2";

    if (obj.playerName1) {
      player1Name = obj.playerName1;
    }
    if (obj.playerName2) {
      player2Name = obj.playerName2;
    }

    for (let field of document.getElementsByClassName("input-field")) {
      field.value = "";
    }

    dialog.close();
    gameFlow.updatePlayerNames(player1Name, player2Name);
    let winner = playRound.getWinner();
    playRound.startGame();
    if (winner !== "") {
      document.getElementById("active-player").innerHTML = `${
        winner[1] === "X" ? player1Name : player2Name
      } wins! (marker: ${winner[1]})`;
    }
  });
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

  const startGame = () => {
    // set initial display
    updateDisplay();
    gameStateTextArea.innerHTML = `${
      gameFlow.getActivePlayer().name
    }'s turn (marker: ${gameFlow.getActivePlayer().getMarker()})`;
  };

  startGame();

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

  resetButton.addEventListener("click", reset);

  function reset() {
    Gameboard.resetBoard();
    gameStateTextArea.innerHTML = "";
    gameOver = false;
    Array.from(gameGrid).forEach((boardSquare) => {
      boardSquare.innerHTML = "";
    });
    document.getElementById("end").innerHTML = "";
    gameStateTextArea.innerHTML = `${
      gameFlow.getActivePlayer().name
    }'s turn (marker: ${gameFlow.getActivePlayer().getMarker()})`;
    removeEventListeners();
    playRound;
  }

  let winner = "";

  const checkGameOver = () => {
    if (Gameboard.isFull()) {
      gameOver = true;
      gameStateTextArea.innerHTML = `It's a tie!`;
    }
    if (Gameboard.checkWinner() !== "") {
      winner = [
        gameFlow.getActivePlayer().name,
        gameFlow.getActivePlayer().getMarker(),
      ];
      gameOver = true;
      gameStateTextArea.innerHTML = `${winner[0]} wins! (marker: ${winner[1]})`;
    }
    if (gameOver) {
      document.getElementById("end").innerHTML =
        "Game finished. Thanks for playing!";
      removeEventListeners();
      return;
    }
  };

  const getWinner = () => {
    return winner;
  };

  return { startGame: startGame, getWinner };
})();
