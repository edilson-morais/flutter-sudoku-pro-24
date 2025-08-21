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
        "aspect-square flex items-center justify-center text-lg font-semibold cursor-pointer transition-all duration-150 select-none",
        "border border-grid-thin",
        {
          "border-r-2 border-r-grid-thick": isThickBorderRight,
          "border-b-2 border-b-grid-thick": isThickBorderBottom,
          "bg-cell-selected border-primary": isSelected,
          "bg-cell-highlighted": isHighlighted && !isSelected,
          "bg-cell-given": isGiven,
          "bg-cell-conflict": hasConflict,
          "bg-cell-background": !isSelected && !isHighlighted && !isGiven && !hasConflict,
          "text-foreground font-bold": isGiven,
          "text-primary": !isGiven && value > 0,
          "hover:bg-cell-highlighted": !isSelected,
          "active:scale-95": true
        }
      )}
      onClick={onClick}
    >
      {value > 0 ? (
        <span className="text-center">{value}</span>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-3 gap-0 text-[0.45rem] sm:text-[0.5rem] text-cell-notes p-0.5 sm:p-1">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i + 1} className="text-center leading-none">
              {notes.includes(i + 1) ? i + 1 : ''}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}