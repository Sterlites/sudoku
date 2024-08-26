import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SudokuBoardProps {
  board: number[][];
  setBoard: React.Dispatch<React.SetStateAction<number[][]>>;
  gameState: "playing" | "solved" | "failed";
  selectedCell: [number, number] | null;
  setSelectedCell: React.Dispatch<
    React.SetStateAction<[number, number] | null>
  >;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  setBoard,
  gameState,
  selectedCell,
  setSelectedCell,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null))
  );

  useEffect(() => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      inputRefs.current[row][col]?.focus();
    }
  }, [selectedCell]);

  const handleCellChange = (row: number, col: number, value: string) => {
    if (gameState === "playing") {
      const newBoard = [...board];
      const numValue = parseInt(value);
      newBoard[row][col] = numValue >= 1 && numValue <= 9 ? numValue : 0;
      setBoard(newBoard);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell([row, col]);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    if (e.key === "Enter" || e.key === "Escape") {
      setSelectedCell(null);
      e.currentTarget.blur();
    } else if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      e.preventDefault();
      let newRow = row;
      let newCol = col;

      switch (e.key) {
        case "ArrowUp":
          newRow = (newRow - 1 + 9) % 9;
          break;
        case "ArrowDown":
          newRow = (newRow + 1) % 9;
          break;
        case "ArrowLeft":
          newCol = (newCol - 1 + 9) % 9;
          break;
        case "ArrowRight":
          newCol = (newCol + 1) % 9;
          break;
      }

      setSelectedCell([newRow, newCol]);
    }
  };

  return (
    <motion.div
      className="sudoku-board"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {board.map((row, rowIndex) => (
        <motion.div
          key={rowIndex}
          className="sudoku-row"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: rowIndex * 0.05, duration: 0.3 }}
        >
          {row.map((cell, colIndex) => (
            <AnimatePresence key={`${rowIndex}-${colIndex}`}>
              <motion.input
                key={`${rowIndex}-${colIndex}`}
                ref={(el) => (inputRefs.current[rowIndex][colIndex] = el)}
                type="text"
                inputMode="numeric"
                pattern="[1-9]"
                maxLength={1}
                value={cell || ""}
                onChange={(e) =>
                  handleCellChange(rowIndex, colIndex, e.target.value)
                }
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                className={`sudoku-cell ${
                  gameState !== "playing" ? "disabled" : ""
                } ${
                  selectedCell &&
                  selectedCell[0] === rowIndex &&
                  selectedCell[1] === colIndex
                    ? "selected"
                    : ""
                }`}
                animate={
                  selectedCell &&
                  selectedCell[0] === rowIndex &&
                  selectedCell[1] === colIndex
                    ? { scale: 1.1, transition: { duration: 0.2 } }
                    : { scale: 1, transition: { duration: 0.2 } }
                }
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                disabled={gameState !== "playing"}
              />
            </AnimatePresence>
          ))}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SudokuBoard;
