
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
    <div className="w-full max-w-sm mx-auto">
      {/* Board container */}
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        {/* Main board grid */}
        <div className="relative grid grid-cols-9 gap-0 bg-background border-2 border-foreground/20 aspect-square">
          {/* 3x3 block separators */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Vertical separators */}
            <div className="absolute top-0 bottom-0 w-1 bg-white" style={{ left: 'calc(33.333% - 2px)' }} />
            <div className="absolute top-0 bottom-0 w-1 bg-white" style={{ left: 'calc(66.666% - 2px)' }} />
            
            {/* Horizontal separators */}
            <div className="absolute left-0 right-0 h-1 bg-white" style={{ top: 'calc(33.333% - 2px)' }} />
            <div className="absolute left-0 right-0 h-1 bg-white" style={{ top: 'calc(66.666% - 2px)' }} />
          </div>
          
          {/* Cells */}
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
        
        {/* Progress indicator */}
        <div className="mt-3 w-full bg-muted rounded-full h-2">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"
            style={{
              width: `${(board.flat().filter(cell => cell !== 0).length / 81) * 100}%`
            }}
          />
        </div>
        
        {/* Completion percentage */}
        <div className="text-center mt-2 text-sm text-muted-foreground font-medium">
          {Math.round((board.flat().filter(cell => cell !== 0).length / 81) * 100)}% completo
        </div>
      </div>
    </div>
  );
}
