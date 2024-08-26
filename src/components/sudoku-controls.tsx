import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ControlsProps {
  newGame: () => void;
  checkSolution: () => void;
  solve: () => void;
  setDifficulty: React.Dispatch<React.SetStateAction<'easy' | 'medium' | 'hard'>>;
  difficulty: 'easy' | 'medium' | 'hard';
  gameState: 'playing' | 'solved' | 'failed';
  score: number;  // Add this line
}

const Controls: React.FC<ControlsProps> = ({
  newGame,
  checkSolution,
  solve,
  setDifficulty,
  difficulty,
  gameState,
  score,  // Add this line
}) => {
  return (
    <motion.div
      className="controls"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <motion.button
        onClick={newGame}
        whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        New Game
      </motion.button>
      <motion.button
        onClick={checkSolution}
        whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        Check Solution
      </motion.button>
      <motion.button
        onClick={solve}
        whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        Solve
      </motion.button>
      <motion.select
        value={difficulty}
        onChange={(e) =>
          setDifficulty(e.target.value as "easy" | "medium" | "hard")
        }
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </motion.select>
      <AnimatePresence>
        {gameState === "solved" && (
      <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      Score: {score}
    </motion.p>
        )}
        {gameState === "failed" && (
          <motion.p
            className="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            Oops! That's not correct. Try again!
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
export default Controls;
