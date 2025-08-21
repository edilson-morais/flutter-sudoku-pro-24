import { useState, useEffect, useCallback } from "react";
import { SudokuBoard } from "@/components/SudokuBoard";
import { NumberPad } from "@/components/NumberPad";
import { SudokuService, GameState } from "@/services/sudoku-service";
import { StorageService } from "@/services/storage-service";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Home, RotateCcw, Save, Undo, Edit, Lightbulb, Eraser } from "lucide-react";

interface GameScreenProps {
  difficulty: string;
  onHome: () => void;
  loadSavedGame?: boolean;
}

export function GameScreen({ difficulty, onHome, loadSavedGame = false }: GameScreenProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [conflicts, setConflicts] = useState<[number, number][]>([]);
  const [timer, setTimer] = useState<string>("00:00");
  const [isCompleted, setIsCompleted] = useState(false);
  
  const sudokuService = new SudokuService();
  const storageService = new StorageService();
  const { toast } = useToast();

  // Initialize game
  useEffect(() => {
    if (loadSavedGame) {
      const saved = storageService.loadGameState();
      if (saved) {
        setGameState(saved);
        return;
      }
    }
    
    const newGame = sudokuService.createGameState(difficulty);
    setGameState(newGame);
    storageService.updateStatsOnStart();
  }, [difficulty, loadSavedGame]);

  // Timer update
  useEffect(() => {
    if (!gameState || isCompleted) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - gameState.startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setTimer(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState?.startTime, isCompleted]);

  // Auto-save
  useEffect(() => {
    if (gameState && !isCompleted) {
      const saveInterval = setInterval(() => {
        storageService.saveGameState(gameState);
      }, 5000);

      return () => clearInterval(saveInterval);
    }
  }, [gameState, isCompleted]);

  // Check for conflicts and completion
  useEffect(() => {
    if (!gameState) return;

    // Find all conflicts
    const allConflicts: [number, number][] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cellConflicts = sudokuService.getConflicts(gameState.board, row, col);
        if (cellConflicts.length > 0) {
          allConflicts.push([row, col], ...cellConflicts);
        }
      }
    }
    
    // Remove duplicates
    const uniqueConflicts = allConflicts.filter((conflict, index, array) => 
      index === array.findIndex(c => c[0] === conflict[0] && c[1] === conflict[1])
    );
    
    setConflicts(uniqueConflicts);

    // Check completion
    if (sudokuService.isCompleted(gameState.board) && uniqueConflicts.length === 0) {
      setIsCompleted(true);
      gameState.endTime = Date.now();
      
      const completionTime = Math.floor((gameState.endTime - gameState.startTime) / 1000);
      storageService.updateStatsOnCompletion(difficulty, completionTime, gameState.hintsUsed);
      storageService.clearGameState();
      
      toast({
        title: "Parabéns! 🎉",
        description: `Você completou o Sudoku em ${timer}!`,
      });
    }
  }, [gameState, timer]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (!gameState || isCompleted) return;
    
    setGameState(prev => prev ? {
      ...prev,
      selectedCell: [row, col]
    } : null);
  }, [gameState, isCompleted]);

  const handleNumberInput = useCallback((number: number) => {
    if (!gameState || !gameState.selectedCell || isCompleted) return;
    
    const [row, col] = gameState.selectedCell;
    
    // Can't modify given cells (only initial numbers)
    if (gameState.initialBoard[row][col] !== 0) return;

    setGameState(prev => {
      if (!prev) return null;
      
      const newBoard = prev.board.map(r => [...r]);
      const newNotes = prev.notes.map(r => r.map(c => [...c]));
      const newHistory = [...prev.history, newBoard.map(r => [...r])];

      if (prev.isNotesMode) {
        // Toggle note
        const cellNotes = newNotes[row][col];
        if (cellNotes.includes(number)) {
          newNotes[row][col] = cellNotes.filter(n => n !== number);
        } else {
          newNotes[row][col] = [...cellNotes, number].sort();
        }
      } else {
        // Set number and clear notes
        newBoard[row][col] = number;
        newNotes[row][col] = [];
      }

      return {
        ...prev,
        board: newBoard,
        notes: newNotes,
        history: newHistory.slice(-10) // Keep last 10 moves
      };
    });
  }, [gameState, isCompleted]);

  const handleErase = useCallback(() => {
    if (!gameState || !gameState.selectedCell || isCompleted) return;
    
    const [row, col] = gameState.selectedCell;
    
    // Can't modify given cells (only initial numbers)
    if (gameState.initialBoard[row][col] !== 0) return;

    setGameState(prev => {
      if (!prev) return null;
      
      const newBoard = prev.board.map(r => [...r]);
      const newNotes = prev.notes.map(r => r.map(c => [...c]));
      const newHistory = [...prev.history, newBoard.map(r => [...r])];

      newBoard[row][col] = 0;
      newNotes[row][col] = [];

      return {
        ...prev,
        board: newBoard,
        notes: newNotes,
        history: newHistory.slice(-10)
      };
    });
  }, [gameState, isCompleted]);

  const handleToggleNotes = useCallback(() => {
    setGameState(prev => prev ? { ...prev, isNotesMode: !prev.isNotesMode } : null);
  }, []);

  const handleUndo = useCallback(() => {
    if (!gameState || gameState.history.length <= 1) return;

    setGameState(prev => {
      if (!prev || prev.history.length <= 1) return prev;
      
      const newHistory = prev.history.slice(0, -1);
      const previousBoard = newHistory[newHistory.length - 1];

      return {
        ...prev,
        board: previousBoard.map(r => [...r]),
        history: newHistory
      };
    });
  }, [gameState]);

  const handleRestart = useCallback(() => {
    if (!gameState) return;
    
    setGameState(prev => prev ? {
      ...prev,
      board: prev.initialBoard.map(r => [...r]),
      notes: Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])),
      history: [prev.initialBoard.map(r => [...r])],
      selectedCell: null,
      startTime: Date.now(),
      hintsUsed: 0
    } : null);
    
    setIsCompleted(false);
    toast({
      title: "Jogo reiniciado",
      description: "O tabuleiro foi resetado para o estado inicial."
    });
  }, [gameState]);

  const handleHint = useCallback(() => {
    if (!gameState || gameState.hintsUsed >= gameState.maxHints) return;

    const hint = sudokuService.getHint(gameState.board);
    if (!hint) return;

    const [row, col, value] = hint;
    
    setGameState(prev => {
      if (!prev) return null;
      
      const newBoard = prev.board.map(r => [...r]);
      const newNotes = prev.notes.map(r => r.map(c => [...c]));
      const newHistory = [...prev.history, newBoard.map(r => [...r])];

      newBoard[row][col] = value;
      newNotes[row][col] = [];

      return {
        ...prev,
        board: newBoard,
        notes: newNotes,
        history: newHistory.slice(-10),
        selectedCell: [row, col],
        hintsUsed: prev.hintsUsed + 1
      };
    });

    toast({
      title: "Dica utilizada!",
      description: `Célula linha ${row + 1}, coluna ${col + 1} preenchida.`
    });
  }, [gameState]);

  const handleSave = useCallback(() => {
    if (!gameState) return;
    
    storageService.saveGameState(gameState);
    toast({
      title: "Jogo salvo!",
      description: "Seu progresso foi salvo automaticamente."
    });
  }, [gameState]);

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando jogo...</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const completionTime = gameState.endTime ? 
      Math.floor((gameState.endTime - gameState.startTime) / 1000) : 0;
    const formattedTime = storageService.formatTime(completionTime);

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Parabéns!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div>
              <p className="text-muted-foreground">Você completou o Sudoku!</p>
              <p className="text-2xl font-bold text-primary">{formattedTime}</p>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>Dificuldade: {difficulty}</span>
              </div>
              <div>
                <span>Dicas: {gameState.hintsUsed}/{gameState.maxHints}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                const newGame = sudokuService.createGameState(difficulty);
                setGameState(newGame);
                setIsCompleted(false);
                storageService.updateStatsOnStart();
              }}>
                Jogar Novamente
              </Button>
              <Button onClick={onHome}>
                Menu Principal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col overflow-hidden">
      {/* Header with Stats */}
      <div className="bg-card border-b border-border px-3 py-2 flex-shrink-0">
        <div className="max-w-sm mx-auto">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Dificuldade</p>
              <p className="text-sm font-medium capitalize">{difficulty}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Erros</p>
              <p className="text-sm font-medium">0/3</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tempo</p>
              <p className="text-sm font-medium font-mono">{timer}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 flex flex-col justify-between p-2">
        <div className="max-w-sm mx-auto w-full space-y-2">
          {/* Game Board */}
          <div className="flex-shrink-0">
            <SudokuBoard
              gameState={gameState}
              conflicts={conflicts}
              onCellClick={handleCellClick}
            />
          </div>

          {/* Simplified Game Controls */}
          <div className="flex-shrink-0">
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onHome}
                className="h-8 px-2"
              >
                <Home className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestart}
                className="h-8 px-2"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="h-8 px-2"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="max-w-sm mx-auto w-full space-y-2">
          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={gameState.history.length <= 1}
              className="h-10 flex flex-col items-center justify-center text-xs"
            >
              <Undo className="h-4 w-4 mb-1" />
              Desfazer
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleErase}
              disabled={!gameState.selectedCell || gameState.initialBoard[gameState.selectedCell[0]][gameState.selectedCell[1]] !== 0}
              className="h-10 flex flex-col items-center justify-center text-xs"
            >
              <Eraser className="h-4 w-4 mb-1" />
              Apagar
            </Button>
            
            <Button
              variant={gameState.isNotesMode ? "default" : "outline"}
              size="sm"
              onClick={handleToggleNotes}
              className="h-10 flex flex-col items-center justify-center text-xs"
            >
              <Edit className="h-4 w-4 mb-1" />
              Anotações
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleHint}
              disabled={gameState.hintsUsed >= gameState.maxHints}
              className="h-10 flex flex-col items-center justify-center text-xs"
            >
              <Lightbulb className="h-4 w-4 mb-1" />
              Dica ({gameState.hintsUsed}/{gameState.maxHints})
            </Button>
          </div>

          {/* Number Pad */}
          <div className="pb-2">
            <NumberPad
              onNumberSelect={handleNumberInput}
              onErase={handleErase}
              disabled={!gameState.selectedCell || gameState.initialBoard[gameState.selectedCell[0]][gameState.selectedCell[1]] !== 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}