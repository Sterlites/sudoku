import  { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import SudokuBoard from './components/sudoku-board';
import Controls from './components/sudoku-controls';
import Shortcuts from './components/shortcuts';
import { generateSudoku, solveSudoku } from './utils/sudoku-logic';
import './App.css';

function App() {
  const [board, setBoard] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [gameState, setGameState] = useState<'playing' | 'solved' | 'failed'>('playing');
  const [score, setScore] = useState(0);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confetti, setConfetti] = useState<{ x: number; y: number; color: string }[]>([]);
  const progress = useMotionValue(0);
  const opacity = useTransform(progress, [0, 100], [0, 1]);
console.log("RDx");
  useEffect(() => {
    newGame();
  }, [difficulty]);

  const newGame = () => {
    const [newBoard, newSolution] = generateSudoku(difficulty);
    setBoard(newBoard);
    setSolution(newSolution);
    setGameState('playing');
    setScore(0);
    setSelectedCell(null);
    setShowCelebration(false);
    setConfetti([]);
  };

  const checkSolution = () => {
    const isCorrect = board.every((row, i) =>
      row.every((cell, j) => cell === solution[i][j])
    );
    if (isCorrect) {
      setGameState('solved');
      setScore(prevScore => prevScore + 1000);
      setShowCelebration(true);
      generateConfetti();
      setTimeout(() => {
        setShowCelebration(false);
        setConfetti([]);
      }, 5000);
    } else {
      setGameState('failed');
      setScore(prevScore => Math.max(0, prevScore - 100));
    }
  };

  const solve = () => {
    const solvedBoard = board.map(row => [...row]);
    if (solveSudoku(solvedBoard)) {
      setBoard(solvedBoard);
      setGameState('solved');
    } else {
      setGameState('failed');
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing' || !selectedCell) return;

    const [row, col] = selectedCell;
    
    if (e.key >= '1' && e.key <= '9') {
      const newBoard = [...board];
      newBoard[row][col] = parseInt(e.key);
      setBoard(newBoard);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      const newBoard = [...board];
      newBoard[row][col] = 0;
      setBoard(newBoard);
    }
  }, [gameState, selectedCell, board]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const generateConfetti = () => {
    const newConfetti = Array(100).fill(null).map(() => ({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * 100,
      color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)],
    }));
    setConfetti(newConfetti);
  };

  return (
    <motion.div
      className="app"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Sudoku Game
      </motion.h1>
      <SudokuBoard
        board={board}
        setBoard={setBoard}
        gameState={gameState}
        selectedCell={selectedCell}
        setSelectedCell={setSelectedCell}
      />
      <Controls
        newGame={newGame}
        checkSolution={checkSolution}
        solve={solve}
        setDifficulty={setDifficulty}
        difficulty={difficulty}
        gameState={gameState}
        score={score}
      />
      <Shortcuts />
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="celebration-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="celebration"
              initial={{ scale: 0, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0, rotateY: -180 }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
            >
              <motion.h2
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Congratulations!
              </motion.h2>
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                You solved the puzzle!
              </motion.p>
            </motion.div>
            {confetti.map((conf, index) => (
              <motion.div
                key={index}
                className="confetti"
                initial={{ x: conf.x, y: conf.y, opacity: 1, scale: 0 }}
                animate={{
                  y: window.innerHeight + 20,
                  opacity: 0,
                  rotate: Math.random() * 720 - 360,
                  scale: 1,
                }}
                transition={{ duration: 2 + Math.random() * 3, ease: "easeInOut" }}
                style={{ backgroundColor: conf.color }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="progress-bar"
        style={{ scaleX: progress, opacity }}
      />
    </motion.div>
  );
}

export default App;