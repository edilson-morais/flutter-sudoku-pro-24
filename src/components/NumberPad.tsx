import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberPadProps {
  onNumberSelect: (number: number) => void;
  onErase: () => void;
  disabled?: boolean;
}

export function NumberPad({ onNumberSelect, onErase, disabled }: NumberPadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="max-w-sm mx-auto">
      <div className="grid grid-cols-5 gap-2">
        {numbers.map((number) => (
          <Button
            key={number}
            variant="outline"
            onClick={() => onNumberSelect(number)}
            disabled={disabled}
            className={cn(
              "h-12 text-lg font-bold aspect-square rounded-lg",
              "hover:bg-primary hover:text-primary-foreground",
              "active:scale-95 transition-all duration-150",
              "border-2"
            )}
          >
            {number}
          </Button>
        ))}
      </div>
    </div>
  );
}