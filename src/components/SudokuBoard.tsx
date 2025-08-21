
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
    <div className="w-full">
      {/* Board container */}
      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-2 shadow-lg">
        {/* Main board grid */}
        <div className="relative grid grid-cols-9 gap-0 bg-background border-2 border-primary/30 rounded aspect-square overflow-hidden">
          {/* 3x3 block separators */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Vertical separators */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-white" style={{ left: 'calc(33.333% - 1px)' }} />
            <div className="absolute top-0 bottom-0 w-0.5 bg-white" style={{ left: 'calc(66.666% - 1px)' }} />
            
            {/* Horizontal separators */}
            <div className="absolute left-0 right-0 h-0.5 bg-white" style={{ top: 'calc(33.333% - 1px)' }} />
            <div className="absolute left-0 right-0 h-0.5 bg-white" style={{ top: 'calc(66.666% - 1px)' }} />
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
        <div className="mt-3 w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out rounded-full"
            style={{
              width: `${(board.flat().filter(cell => cell !== 0).length / 81) * 100}%`
            }}
          />
        </div>
        
        {/* Completion percentage */}
        <div className="text-center mt-2 text-xs text-muted-foreground font-medium">
          {Math.round((board.flat().filter(cell => cell !== 0).length / 81) * 100)}% completo
        </div>
      </div>
    </div>
  );
}
