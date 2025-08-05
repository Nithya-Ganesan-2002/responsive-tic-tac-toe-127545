import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Color palette:
 *  primary:   #1976D2 (main blue for board/borders/buttons)
 *  secondary: #424242 (dark gray for text/background/accent)
 *  accent:    #FFC107 (amber/gold for current player, winning, highlight)
 */

const COLORS = {
  primary: '#1976D2',
  secondary: '#424242',
  accent: '#FFC107',
  background: '#fff'
};

// PUBLIC_INTERFACE
function App() {
  // Tracks the X=0, O=1 as current player (alternates per move)
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [draw, setDraw] = useState(false);

  // Reset the board to start a new game
  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinner(null);
    setDraw(false);
  }

  // Calculate winner/draw after each board update
  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setWinner(result);
      setGameOver(true);
      setScore(s => ({
        ...s,
        [result]: s[result] + 1
      }));
      setDraw(false);
    } else if (board.every(cell => cell !== null)) {
      setDraw(true);
      setGameOver(true);
    }
  }, [board]);

  // Square click handler
  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    if (board[index] || gameOver) return;
    setBoard(board => {
      const newBoard = [...board];
      newBoard[index] = isXNext ? 'X' : 'O';
      return newBoard;
    });
    setIsXNext(x => !x);
  }

  // Draw the main status (current turn, winner, draw)
  function renderStatus() {
    if (winner) {
      return (
        <span className="status-winner" style={{ color: COLORS.accent }}>
          {winner} wins!
        </span>
      );
    }
    if (draw) {
      return (
        <span className="status-draw" style={{ color: COLORS.secondary }}>
          It&apos;s a draw!
        </span>
      );
    }
    // Game in progress
    const playerColor = isXNext ? COLORS.primary : COLORS.accent;
    return (
      <span className="status-next" style={{ color: playerColor }}>
        {isXNext ? "X" : "O"}&apos;s turn
      </span>
    );
  }

  // PUBLIC_INTERFACE
  return (
    <div className="app-tic-tac-toe">
      <div className="ttt-container">
        <div className="status-bar">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <div className="ttt-status">{renderStatus()}</div>
          <ScoreBoard score={score} />
        </div>
        <TicTacToeBoard
          board={board}
          onSquareClick={handleSquareClick}
          highlight={winner ? getWinningLine(board) : []}
        />
        <button
          className="ttt-reset-btn"
          onClick={handleReset}
          aria-label="Restart game"
        >
          Reset Game
        </button>
      </div>
      <footer className="ttt-footer">
        <span>
          &copy; {new Date().getFullYear()} | Two Player | React Tic Tac Toe
        </span>
      </footer>
    </div>
  );
}

// Board component: 3x3 grid of squares
function TicTacToeBoard({ board, onSquareClick, highlight }) {
  // highlight: array of board indexes to highlight for win
  function renderSquare(i) {
    const isHighlighted = highlight && highlight.includes(i);
    return (
      <button
        className={`ttt-square${isHighlighted ? " ttt-square-highlight" : ""}`}
        style={isHighlighted ? { color: COLORS.accent, borderColor: COLORS.accent } : undefined}
        key={i}
        onClick={() => onSquareClick(i)}
        aria-label={`Square ${i + 1}, ${board[i] ? board[i] : "empty"}`}
      >
        <span>{board[i]}</span>
      </button>
    );
  }

  return (
    <div className="ttt-board">
      {[0, 1, 2].map(row =>
        <div className="ttt-row" key={row}>
          {[0, 1, 2].map(col =>
            renderSquare(row * 3 + col)
          )}
        </div>
      )}
    </div>
  );
}

// Score board for X and O
function ScoreBoard({ score }) {
  return (
    <div className="ttt-scoreboard">
      <span className="ttt-score ttt-score-x" style={{ color: COLORS.primary }}>
        X: {score.X}
      </span>
      <span className="ttt-score-separator">|</span>
      <span className="ttt-score ttt-score-o" style={{ color: COLORS.accent }}>
        O: {score.O}
      </span>
    </div>
  );
}

// Returns X or O if found, else null
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];
  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// Helper: get winning indexes if win present
function getWinningLine(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return [a, b, c];
    }
  }
  return [];
}

export default App;
