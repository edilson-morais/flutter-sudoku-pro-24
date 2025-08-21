
import { Button } from "@/components/ui/button";
import { Eraser, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberPadProps {
  onNumberSelect: (number: number) => void;
  onErase: () => void;
  onHint?: () => void;
  disabled?: boolean;
  className?: string;
}

export function NumberPad({ 
  onNumberSelect, 
  onErase, 
  onHint, 
  disabled, 
  className 
}: NumberPadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className={cn("w-full max-w-sm mx-auto animate-slide-up", className)}>
      {/* Number grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {numbers.map((number) => (
          <Button
            key={number}
            variant="outline"
            onClick={() => onNumberSelect(number)}
            disabled={disabled}
            className={cn(
              "h-14 w-full text-xl font-bold rounded-2xl",
              "modern-card border-2 border-primary/20",
              "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20",
              "active:scale-95 transition-all duration-200",
              "bg-gradient-to-br from-card to-card/80",
              "hover:from-primary/5 hover:to-primary/10",
              "group relative overflow-hidden"
            )}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl" />
            
            <span className="relative z-10">{number}</span>
          </Button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center">
        {/* Hint button */}
        {onHint && (
          <Button
            variant="outline"
            onClick={onHint}
            disabled={disabled}
            className={cn(
              "flex-1 h-12 rounded-xl",
              "modern-card border-2 border-accent/20",
              "hover:border-accent/50 hover:shadow-lg hover:shadow-accent/20",
              "active:scale-95 transition-all duration-200",
              "bg-gradient-to-br from-card to-card/80",
              "hover:from-accent/5 hover:to-accent/10",
              "group relative overflow-hidden"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
            <Lightbulb className="h-4 w-4 mr-2 relative z-10" />
            <span className="relative z-10">Dica</span>
          </Button>
        )}

        {/* Erase button */}
        <Button
          variant="outline"
          onClick={onErase}
          disabled={disabled}
          className={cn(
            "flex-1 h-12 rounded-xl",
            "modern-card border-2 border-destructive/20",
            "hover:border-destructive/50 hover:shadow-lg hover:shadow-destructive/20",
            "active:scale-95 transition-all duration-200",
            "bg-gradient-to-br from-card to-card/80",
            "hover:from-destructive/5 hover:to-destructive/10",
            "group relative overflow-hidden"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
          <Eraser className="h-4 w-4 mr-2 relative z-10" />
          <span className="relative z-10">Apagar</span>
        </Button>
      </div>
    </div>
  );
}
