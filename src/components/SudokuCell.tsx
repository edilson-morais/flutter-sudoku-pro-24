
import { cn } from "@/lib/utils";

interface SudokuCellProps {
  value: number;
  notes: number[];
  row: number;
  col: number;
  isSelected: boolean;
  isHighlighted: boolean;
  isGiven: boolean;
  hasConflict: boolean;
  onClick: () => void;
}

export function SudokuCell({
  value,
  notes,
  row,
  col,
  isSelected,
  isHighlighted,
  isGiven,
  hasConflict,
  onClick
}: SudokuCellProps) {
  const isThickBorderRight = (col + 1) % 3 === 0 && col !== 8;
  const isThickBorderBottom = (row + 1) % 3 === 0 && row !== 8;

  return (
    <div
      className={cn(
        // Base styles
        "relative aspect-square flex items-center justify-center text-lg font-semibold cursor-pointer transition-all duration-200 select-none",
        "border border-border/30",
        "hover:bg-primary/10 active:scale-95",
        
        // Border effects for 3x3 grids
        {
          "border-r-2 border-r-white": isThickBorderRight,
          "border-b-2 border-b-white": isThickBorderBottom,
        },
        
        // State-based styling
        {
          // Selected cell
          "bg-primary/20 border-primary/50 scale-105 z-10": isSelected,
          
          // Highlighted cells
          "bg-primary/5": isHighlighted && !isSelected,
          
          // Given numbers
          "bg-muted/50": isGiven,
          
          // Conflict state
          "bg-destructive/20 animate-pulse border-destructive/50": hasConflict,
          
          // Default state
          "bg-background": !isSelected && !isHighlighted && !isGiven && !hasConflict,
          
          // Text styling
          "text-muted-foreground font-bold": isGiven,
          "text-primary font-semibold": !isGiven && value > 0,
        }
      )}
      onClick={onClick}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-primary/70 rounded-sm animate-pulse" />
      )}
      
      {/* Cell content */}
      {value > 0 ? (
        <span className="relative z-10 text-center">
          {value}
        </span>
      ) : notes.length > 0 ? (
        <div className="relative z-10 grid grid-cols-3 gap-0 text-[0.4rem] text-muted-foreground p-0.5">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i + 1} className="text-center leading-none font-medium">
              {notes.includes(i + 1) ? i + 1 : ''}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
