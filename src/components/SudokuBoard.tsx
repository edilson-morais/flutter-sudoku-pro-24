
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
      <div className="bg-card border border-border rounded-lg p-3 shadow-sm">
        {/* Main board grid com bordas visíveis */}
        <div className="relative bg-white border-4 border-gray-800 aspect-square w-full max-w-sm mx-auto">
          {/* Grid 9x9 */}
          <div className="grid grid-cols-9 grid-rows-9 h-full w-full">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                // Determinar bordas grossas para separar blocos 3x3
                const rightBorder = (colIndex + 1) % 3 === 0 && colIndex !== 8 ? "border-r-4 border-r-gray-800" : "border-r border-r-gray-300";
                const bottomBorder = (rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? "border-b-4 border-b-gray-800" : "border-b border-b-gray-300";
                
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`${rightBorder} ${bottomBorder} relative`}
                  >
                    <SudokuCell
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
                  </div>
                );
              })
            )}
          </div>
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
