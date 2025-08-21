type Board = number[][]; // 9x9, 0 = empty

export interface GameState {
  board: Board;
  initialBoard: Board;
  selectedCell: [number, number] | null;
  history: Board[];
  notes: number[][][]; // [row][col][notes array]
  isNotesMode: boolean;
  difficulty: string;
  startTime: number;
  endTime?: number;
  hintsUsed: number;
  maxHints: number;
}

export class SudokuService {
  private rand = Math.random;

  // Validation - checks if a value can be placed at position (row, col)
  isValid(board: Board, row: number, col: number, value: number): boolean {
    // Check row (excluding the current cell)
    for (let i = 0; i < 9; i++) {
      if (i !== col && board[row][i] === value) return false;
    }

    // Check column (excluding the current cell)  
    for (let i = 0; i < 9; i++) {
      if (i !== row && board[i][col] === value) return false;
    }

    // Check 3x3 block (excluding the current cell)
    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const currentRow = blockRow + i;
        const currentCol = blockCol + j;
        if (!(currentRow === row && currentCol === col) && 
            board[currentRow][currentCol] === value) return false;
      }
    }

    return true;
  }

  // Helper method to check if a number placement would create conflicts
  wouldCreateConflict(board: Board, row: number, col: number, value: number): boolean {
    if (value === 0) return false; // Empty cell can't create conflicts
    
    // Temporarily place the value
    const originalValue = board[row][col];
    board[row][col] = value;
    
    // Check if this creates any conflicts
    const hasConflicts = this.getConflicts(board, row, col).length > 0;
    
    // Restore original value
    board[row][col] = originalValue;
    
    return hasConflicts;
  }

  // Backtracking solver
  solve(board: Board): boolean {
    const copyBoard = board.map(row => [...row]);
    
    const solveFn = (b: Board): boolean => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (b[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (this.isValid(b, row, col, num)) {
                b[row][col] = num;
                if (solveFn(b)) return true;
                b[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    const result = solveFn(copyBoard);
    if (result) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          board[i][j] = copyBoard[i][j];
        }
      }
    }
    return result;
  }

  // Count solutions with limit
  countSolutions(board: Board, limit: number = 2): number {
    let count = 0;

    const helper = (b: Board): boolean => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (b[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (this.isValid(b, row, col, num)) {
                b[row][col] = num;
                if (helper(b)) {
                  b[row][col] = 0;
                  if (++count >= limit) return true;
                } else {
                  b[row][col] = 0;
                }
              }
            }
            return false;
          }
        }
      }
      count++;
      return count >= limit;
    };

    const copyBoard = board.map(row => [...row]);
    helper(copyBoard);
    return count;
  }

  // Generate full solved board
  generateFullBoard(): Board {
    const board: Board = Array(9).fill(null).map(() => Array(9).fill(0));
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const fillBoard = (board: Board, index: number): boolean => {
      if (index >= 81) return true;
      
      const row = Math.floor(index / 9);
      const col = index % 9;
      
      if (board[row][col] !== 0) return fillBoard(board, index + 1);

      // Shuffle numbers for randomness
      const shuffledNumbers = [...numbers].sort(() => Math.random() - 0.5);
      
      for (const num of shuffledNumbers) {
        if (this.isValid(board, row, col, num)) {
          board[row][col] = num;
          if (fillBoard(board, index + 1)) return true;
          board[row][col] = 0;
        }
      }
      return false;
    };

    // Fill diagonal 3x3 blocks first for efficiency
    for (let block = 0; block < 3; block++) {
      const blockRow = block * 3;
      const blockCol = block * 3;
      const sequence = [...numbers].sort(() => Math.random() - 0.5);
      let k = 0;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          board[blockRow + i][blockCol + j] = sequence[k++];
        }
      }
    }

    fillBoard(board, 0);
    return board;
  }

  // Remove cells to create puzzle
  removeCellsForDifficulty(fullBoard: Board, difficulty: string): Board {
    let clues: number;
    switch (difficulty.toLowerCase()) {
      case 'facil':
      case 'fácil':
      case 'easy':
        clues = 40;
        break;
      case 'medio':
      case 'médio':
      case 'medium':
        clues = 32;
        break;
      case 'dificil':
      case 'difícil':
      case 'hard':
        clues = 26;
        break;
      default:
        clues = 32;
    }

    const puzzle = fullBoard.map(row => [...row]);
    const positions = Array.from({length: 81}, (_, i) => i).sort(() => Math.random() - 0.5);

    for (const pos of positions) {
      if (this.countNonZero(puzzle) <= clues) break;
      
      const row = Math.floor(pos / 9);
      const col = pos % 9;
      
      if (puzzle[row][col] === 0) continue;

      const oldValue = puzzle[row][col];
      puzzle[row][col] = 0;

      if (this.countSolutions(puzzle, 2) !== 1) {
        puzzle[row][col] = oldValue;
      }
    }

    return puzzle;
  }

  private countNonZero(board: Board): number {
    let count = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== 0) count++;
      }
    }
    return count;
  }

  // Main puzzle generation function
  generatePuzzle(difficulty: string): Board {
    const fullBoard = this.generateFullBoard();
    return this.removeCellsForDifficulty(fullBoard, difficulty);
  }

  // Get hint for current position
  getHint(board: Board): [number, number, number] | null {
    const solvedBoard = board.map(row => [...row]);
    if (!this.solve(solvedBoard)) return null;

    // Find empty cells
    const emptyCells: [number, number][] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) return null;

    // Return random empty cell with its solution
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];
    return [row, col, solvedBoard[row][col]];
  }

  // Check if puzzle is completed
  isCompleted(board: Board): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) return false;
      }
    }
    return true;
  }

  // Get conflicts for a position
  getConflicts(board: Board, row: number, col: number): [number, number][] {
    const conflicts: [number, number][] = [];
    const value = board[row][col];
    
    if (value === 0) return conflicts;

    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && board[row][c] === value) {
        conflicts.push([row, c]);
      }
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && board[r][col] === value) {
        conflicts.push([r, col]);
      }
    }

    // Check 3x3 block
    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;
    for (let r = blockRow; r < blockRow + 3; r++) {
      for (let c = blockCol; c < blockCol + 3; c++) {
        if (r !== row && c !== col && board[r][c] === value) {
          conflicts.push([r, c]);
        }
      }
    }

    return conflicts;
  }

  // Create initial game state with better difficulty balance
  createGameState(difficulty: string): GameState {
    const puzzle = this.generatePuzzle(difficulty);
    
    // More generous hint system for learning
    let maxHints: number;
    switch (difficulty.toLowerCase()) {
      case 'facil':
      case 'fácil':
        maxHints = 8; // More hints for beginners
        break;
      case 'medio':
      case 'médio':
        maxHints = 5; // Moderate hints for intermediate
        break;
      case 'dificil':
      case 'difícil':
        maxHints = 3; // Fewer hints for advanced
        break;
      default:
        maxHints = 5;
    }
    
    return {
      board: puzzle.map(row => [...row]),
      initialBoard: puzzle.map(row => [...row]),
      selectedCell: null,
      history: [puzzle.map(row => [...row])],
      notes: Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])),
      isNotesMode: false,
      difficulty,
      startTime: Date.now(),
      hintsUsed: 0,
      maxHints
    };
  }

  // Get all possible valid numbers for a cell (helpful for beginners)
  getPossibleNumbers(board: Board, row: number, col: number): number[] {
    if (board[row][col] !== 0) return []; // Cell already filled
    
    const possible: number[] = [];
    for (let num = 1; num <= 9; num++) {
      if (this.isValid(board, row, col, num)) {
        possible.push(num);
      }
    }
    return possible;
  }

  // Auto-fill obvious moves (cells with only one possibility)
  getObviousMoves(board: Board): Array<{row: number, col: number, value: number}> {
    const moves: Array<{row: number, col: number, value: number}> = [];
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const possible = this.getPossibleNumbers(board, row, col);
          if (possible.length === 1) {
            moves.push({row, col, value: possible[0]});
          }
        }
      }
    }
    
    return moves;
  }
}