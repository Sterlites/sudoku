// utils/sudokuLogic.ts

const generateSudoku = (difficulty: 'easy' | 'medium' | 'hard'): [number[][], number[][]] => {
  const solution = Array(9).fill(null).map(() => Array(9).fill(0));
  const board = Array(9).fill(null).map(() => Array(9).fill(0));

  const startTime = Date.now();
  const timeout = 5000; // 5 seconds timeout

  const fillSolutionWithTimeout = () => {
    if (Date.now() - startTime > timeout) {
      throw new Error('Sudoku generation timed out');
    }
    return fillSolution(solution);
  };

  try {
    if (!fillSolutionWithTimeout()) {
      throw new Error('Failed to generate a valid Sudoku');
    }

    // Copy solution to board
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        board[i][j] = solution[i][j];
      }
    }
 // Create the game board by removing numbers based on difficulty
 const cellsToRemove = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 40 : 50;
 for (let i = 0; i < cellsToRemove; i++) {
   let row, col;
   do {
     row = Math.floor(Math.random() * 9);
     col = Math.floor(Math.random() * 9);
   } while (board[row][col] === 0);
   board[row][col] = 0;
 }

 return [board, solution];
} catch (error) {
 console.error('Error generating Sudoku:', error);
 return [Array(9).fill(null).map(() => Array(9).fill(0)), Array(9).fill(null).map(() => Array(9).fill(0))];
}
};

const fillSolution = (board: number[][]) => {
  // Implement backtracking algorithm to fill the Sudoku solution
  // This is a simplified version and should be replaced with a more efficient algorithm
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (fillSolution(board)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const isValid = (board: number[][], row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
};

const solveSudoku = (board: number[][]): boolean => {
  // Implementation of Sudoku solving algorithm (similar to fillSolution)
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

export { generateSudoku, solveSudoku };
