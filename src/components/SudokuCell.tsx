
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
        "relative aspect-square flex items-center justify-center text-lg font-semibold cursor-pointer transition-all duration-150 select-none w-full h-full",
        "hover:bg-primary/5",
        
        // State-based styling
        {
          // Selected cell with 20% opacity
          "bg-white/20 ring-2 ring-primary/50 z-20": isSelected,
          
          // Highlighted cells
          "bg-white/5": isHighlighted && !isSelected,
          
          // Conflict state
          "bg-destructive/20": hasConflict,
          
          // Default state - sem fundo cinza para números dados
          "bg-background": !isSelected && !isHighlighted && !hasConflict,
        }
      )}
      onClick={onClick}
    >
      {/* Cell content */}
      {value > 0 ? (
        <span className={cn(
          "relative z-10 text-center text-lg font-bold",
          {
            // Números dados (brancos e em negrito no tema escuro)
            "text-white": isGiven && !hasConflict,
            // Números inseridos pelo usuário (azul claro)
            "text-blue-400": !isGiven && !hasConflict,
            // Números em conflito (vermelhos)
            "text-red-500": hasConflict,
          }
        )}>
          {value}
        </span>
      ) : notes.length > 0 ? (
        <div className="relative z-10 grid grid-cols-3 gap-0 text-[0.35rem] text-gray-400 p-0.5 w-full h-full">
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
