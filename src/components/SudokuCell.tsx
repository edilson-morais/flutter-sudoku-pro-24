
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
        // Base styles with modern design
        "relative aspect-square flex items-center justify-center text-lg font-semibold cursor-pointer transition-all duration-200 select-none group",
        "border border-grid-thin backdrop-blur-sm",
        "hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-95",
        
        // Border effects for 3x3 grids
        {
          "border-r-2 border-r-grid-thick": isThickBorderRight,
          "border-b-2 border-b-grid-thick": isThickBorderBottom,
        },
        
        // State-based styling with modern effects
        {
          // Selected cell with glow effect
          "bg-gradient-to-br from-cell-selected to-cell-selected/80 border-primary shadow-lg shadow-primary/20 scale-105 z-10": isSelected,
          
          // Highlighted cells with subtle glow
          "bg-gradient-to-br from-cell-highlighted to-cell-highlighted/60": isHighlighted && !isSelected,
          
          // Given numbers with distinct styling
          "bg-gradient-to-br from-cell-given to-cell-given/80 shadow-inner": isGiven,
          
          // Conflict state with pulsing animation
          "bg-gradient-to-br from-cell-conflict to-destructive/20 animate-pulse border-destructive/50": hasConflict,
          
          // Default state with glass effect
          "bg-gradient-to-br from-cell-background/80 to-cell-background/60 glass": !isSelected && !isHighlighted && !isGiven && !hasConflict,
          
          // Text styling
          "text-foreground font-bold": isGiven,
          "text-primary font-semibold": !isGiven && value > 0,
          
          // Hover effects
          "hover:bg-gradient-to-br hover:from-cell-highlighted hover:to-cell-highlighted/80": !isSelected && !hasConflict,
        }
      )}
      onClick={onClick}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-sm" />
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 rounded-sm border-2 border-primary/50 animate-pulse" />
      )}
      
      {/* Cell content */}
      {value > 0 ? (
        <span className="relative z-10 text-center drop-shadow-sm">
          {value}
        </span>
      ) : notes.length > 0 ? (
        <div className="relative z-10 grid grid-cols-3 gap-0 text-[0.4rem] sm:text-[0.45rem] text-cell-notes p-0.5 sm:p-1">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i + 1} className="text-center leading-none font-medium opacity-70">
              {notes.includes(i + 1) ? i + 1 : ''}
            </div>
          ))}
        </div>
      ) : null}
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-sm pointer-events-none" />
    </div>
  );
}
