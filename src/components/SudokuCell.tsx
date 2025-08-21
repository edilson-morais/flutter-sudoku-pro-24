
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
        "relative aspect-square flex items-center justify-center text-base font-semibold cursor-pointer transition-all duration-200 select-none",
        "border border-border/50",
        "hover:bg-primary/10",
        
        // State-based styling
        {
          // Selected cell
          "bg-primary/30 border-primary scale-105 z-20": isSelected,
          
          // Highlighted cells
          "bg-primary/10": isHighlighted && !isSelected,
          
          // Given numbers
          "bg-muted/70": isGiven,
          
          // Conflict state
          "bg-destructive/30 border-destructive": hasConflict,
          
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
