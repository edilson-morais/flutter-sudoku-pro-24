
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
  return (
    <div
      className={cn(
        // Base styles
        "relative aspect-square flex items-center justify-center text-lg font-semibold cursor-pointer transition-all duration-150 select-none",
        "border-r border-b border-border/30",
        "hover:bg-primary/5",
        
        // Remove right border for last column in each 3x3 block
        {
          "border-r-0": col === 2 || col === 5 || col === 8,
        },
        
        // Remove bottom border for last row in each 3x3 block  
        {
          "border-b-0": row === 2 || row === 5 || row === 8,
        },
        
        // State-based styling
        {
          // Selected cell
          "bg-primary/20 border-primary ring-2 ring-primary/50 z-20": isSelected,
          
          // Highlighted cells
          "bg-primary/5": isHighlighted && !isSelected,
          
          // Given numbers
          "bg-muted/50": isGiven,
          
          // Conflict state
          "bg-destructive/20 border-destructive text-destructive": hasConflict,
          
          // Default state
          "bg-background": !isSelected && !isHighlighted && !isGiven && !hasConflict,
          
          // Text styling
          "text-foreground font-bold": isGiven,
          "text-primary font-semibold": !isGiven && value > 0,
        }
      )}
      onClick={onClick}
    >
      {/* Cell content */}
      {value > 0 ? (
        <span className="relative z-10 text-center">
          {value}
        </span>
      ) : notes.length > 0 ? (
        <div className="relative z-10 grid grid-cols-3 gap-0 text-[0.35rem] text-muted-foreground p-0.5 w-full h-full">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i + 1} className="text-center leading-none font-medium flex items-center justify-center">
              {notes.includes(i + 1) ? i + 1 : ''}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
