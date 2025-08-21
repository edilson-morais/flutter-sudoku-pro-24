
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
    <div className="relative w-full max-w-sm mx-auto animate-fade-in">
      {/* Modern board container with advanced styling */}
      <div className="modern-card p-2">
        {/* Ambient glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-30 animate-pulse" />
        
        {/* Main board grid */}
        <div className="relative grid grid-cols-9 gap-0 border-2 border-grid-thick rounded-xl overflow-hidden aspect-square shadow-2xl">
          {/* 3x3 block separators with subtle gradients */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Vertical separators */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-grid-thick/50 via-grid-thick to-grid-thick/50" style={{ left: 'calc(33.333% - 1px)' }} />
            <div className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-grid-thick/50 via-grid-thick to-grid-thick/50" style={{ left: 'calc(66.666% - 1px)' }} />
            
            {/* Horizontal separators */}
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-grid-thick/50 via-grid-thick to-grid-thick/50" style={{ top: 'calc(33.333% - 1px)' }} />
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-grid-thick/50 via-grid-thick to-grid-thick/50" style={{ top: 'calc(66.666% - 1px)' }} />
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
        <div className="text-center mt-2 text-sm text-muted-foreground font-medium">
          {Math.round((board.flat().filter(cell => cell !== 0).length / 81) * 100)}% completo
        </div>
      </div>
    </div>
  );
}
