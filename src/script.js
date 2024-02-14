// Tic Tac Toe Game

/* Your main goal here is to have as little global code as possible.
   Try tucking as much as you can inside factories.
   If you only need a single instance of something (e.g. the gameboard, the displayController etc.)
   then wrap the factory inside an IIFE (module pattern) so it cannot be reused to create additional instances. */

const Gameboard = (function () {
    let gameboard = [
      ['','',''],
      ['','',''],
      ['','','']
    ];
    const getGameboard = () => gameboard; // Gameboard object

    const updateBoard = (row, column, marker) => {
        if (gameboard[row][column] === '') {
            gameboard[row][column] = marker;
        }
    };

    const positionIsUnavailable = (row, column) => (gameboard[row][column] !== ''); // Is there already a marker in this position?

    const isFull = () => !gameboard.flat().includes('');

    const checkWinner = () => {
      // Check rows
      for (let i = 0; i < 3; i++) {
        if (gameboard[i][0] !== '' && gameboard[i][0] === gameboard[i][1] && gameboard[i][0] === gameboard[i][2]) {
          return gameboard[i][0];
        }
      }
    
      // Check columns
      for (let i = 0; i < 3; i++) {
        if (gameboard[0][i] !== '' && gameboard[0][i] === gameboard[1][i] && gameboard[0][i] === gameboard[2][i]) {
          return gameboard[0][i];
        }
      }
    
      // Check diagonals
      if (gameboard[0][0] !== '' && gameboard[0][0] === gameboard[1][1] && gameboard[0][0] === gameboard[2][2]) {
        return gameboard[0][0];
      }
      if (gameboard[0][2] !== '' && gameboard[0][2] === gameboard[1][1] && gameboard[0][2] === gameboard[2][0]) {
        return gameboard[0][2];
      }
    
      // No winner yet
      return '';
    };

    const resetBoard = () => {
        gameboard = [
            ['','',''],
            ['','',''],
            ['','','']
        ];
    };

    return { getGameboard, updateBoard, positionIsUnavailable, isFull, checkWinner, resetBoard };
})();

// players are also going to be stored in objects (factory)
// marker: X or O
function createPlayer(name, marker) {
    const getMarker = () => marker;
    return { name, getMarker };
}

// an object to control the flow of the game itself (factory)
// Game flow Controller
const GameController = ((player1name = 'Player1', player2name = 'Player2') => {
  const board = Gameboard;
  const players = [
    createPlayer(player1name, 'X'),
    createPlayer(player2name, 'O')
  ]
  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    console.log(board.getGameboard());
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    if (board.isFull()) {
      console.log('The game is a tie!');
      return;
    } else if (board.positionIsUnavailable(row, column)) {
      console.log(`Invalid move! Please try again. Position row ${row}, column ${column} is already marked.`);
      printNewRound();
    } else {
      // Turn for the current player
      console.log(
        `${getActivePlayer().name} marks row ${row}, column ${column} with ${getActivePlayer().getMarker()}...`
      );
      board.updateBoard(row, column, getActivePlayer().getMarker());

      // Check for a winner
      const winnerMarker = board.checkWinner();
      if (winnerMarker !== '') {
        console.log(board.getGameboard());
        console.log(`${getActivePlayer().name}, playing with '${winnerMarker}'s, wins!`);
        return;
      }

      // Switch player turn
      switchPlayerTurn();
      printNewRound();
    }
  };

  // Initial play game message
  printNewRound();

  return { playRound, getActivePlayer };
})();

// Play Game:
GameController.playRound(2, 0);
GameController.playRound(1, 0);
GameController.playRound(1, 1);
GameController.playRound(1, 2);
GameController.playRound(0, 2);