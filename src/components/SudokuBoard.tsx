import { SudokuCell } from "./SudokuCell";
import { GameState } from "@/services/sudoku-service";

interface SudokuBoardProps {
  gameState: GameState;
  conflicts: [number, number][];
  onCellClick: (row: number, col: number) => void;
}

export function SudokuBoard({ gameState, conflicts, onCellClick }: SudokuBoardProps) {
  const { board, initialBoard, selectedCell, notes } = gameState;

  const isCellHighlighted = (row: number, col: number): boolean => {
    if (!selectedCell) return false;
    const [selectedRow, selectedCol] = selectedCell;
    
    // Same row, column, or 3x3 block
    const sameRow = row === selectedRow;
    const sameCol = col === selectedCol;
    const sameBlock = 
      Math.floor(row / 3) === Math.floor(selectedRow / 3) &&
      Math.floor(col / 3) === Math.floor(selectedCol / 3);
    
    return sameRow || sameCol || sameBlock;
  };

  const hasCellConflict = (row: number, col: number): boolean => {
    return conflicts.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="bg-card rounded-lg p-1 shadow-lg w-full max-w-sm mx-auto">
      <div className="grid grid-cols-9 gap-0 border-2 border-grid-thick rounded-lg overflow-hidden aspect-square">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              notes={notes[rowIndex][colIndex]}
              row={rowIndex}
              col={colIndex}
              isSelected={
                selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex
              }
              isHighlighted={isCellHighlighted(rowIndex, colIndex)}
              isGiven={initialBoard[rowIndex][colIndex] !== 0}
              hasConflict={hasCellConflict(rowIndex, colIndex)}
              onClick={() => onCellClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
}