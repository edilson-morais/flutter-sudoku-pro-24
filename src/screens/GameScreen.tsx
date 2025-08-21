import { useState, useEffect, useCallback } from "react";
import { SudokuBoard } from "@/components/SudokuBoard";
import { NumberPad } from "@/components/NumberPad";
import { SudokuService, GameState } from "@/services/sudoku-service";
import { StorageService } from "@/services/storage-service";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Home, RotateCcw, Save, Undo, Edit, Lightbulb, Eraser, Clock, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Card className="modern-card">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary/20 border-t-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando jogo...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCompleted) {
    const completionTime = gameState.endTime ? 
      Math.floor((gameState.endTime - gameState.startTime) / 1000) : 0;
    const formattedTime = storageService.formatTime(completionTime);

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md modern-card animate-scale-in">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-accent via-primary to-accent rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 animate-pulse">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl gradient-text font-bold">Parabéns!</CardTitle>
            <p className="text-lg text-muted-foreground mt-2">Sudoku completado!</p>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-4xl font-bold text-primary">{formattedTime}</p>
              <p className="text-sm text-muted-foreground">Seu tempo final</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="modern-card p-4 space-y-1">
                <div className="flex items-center justify-center gap-1 text-accent">
                  <Star className="h-4 w-4" />
                </div>
                <p className="text-xs text-muted-foreground">Dificuldade</p>
                <p className="font-semibold capitalize">{difficulty}</p>
              </div>
              <div className="modern-card p-4 space-y-1">
                <div className="flex items-center justify-center gap-1 text-warning">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <p className="text-xs text-muted-foreground">Dicas usadas</p>
                <p className="font-semibold">{gameState.hintsUsed}/{gameState.maxHints}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  const newGame = sudokuService.createGameState(difficulty);
                  setGameState(newGame);
                  setIsCompleted(false);
                  storageService.updateStatsOnStart();
                }}
                className="neo-btn"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Jogar Novamente
              </Button>
              <Button onClick={onHome} className="neo-btn bg-primary hover:bg-primary/90">
                <Home className="h-4 w-4 mr-2" />
                Menu Principal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col overflow-hidden">
      {/* Header moderno e compacto */}
      <div className="modern-card rounded-none border-x-0 border-t-0 px-4 py-3 flex-shrink-0">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onHome}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <Home className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Timer className="h-3 w-3 text-primary" />
                <span className="font-mono font-semibold">{timer}</span>
              </div>
              <div className="flex items-center gap-1">
                <Lightbulb className="h-3 w-3 text-warning" />
                <span className="font-semibold">{gameState.hintsUsed}/{gameState.maxHints}</span>
              </div>
            </div>

            <div className="text-xs font-medium capitalize text-muted-foreground">
              {difficulty}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal em grid compacto */}
      <div className="flex-1 p-3 flex flex-col justify-between max-h-[calc(100vh-4rem)]">
        <div className="max-w-sm mx-auto w-full space-y-3">
          {/* Tabuleiro do jogo */}
          <div className="flex-shrink-0">
            <SudokuBoard
              gameState={gameState}
              conflicts={conflicts}
              onCellClick={handleCellClick}
            />
          </div>

          {/* Controles de ação em grid compacto */}
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant={gameState.isNotesMode ? "default" : "outline"}
              size="sm"
              onClick={handleToggleNotes}
              className={cn(
                "h-8 text-xs neo-btn",
                gameState.isNotesMode && "bg-accent text-accent-foreground"
              )}
            >
              <Edit className="h-3 w-3" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={gameState.history.length <= 1}
              className="h-8 text-xs neo-btn"
            >
              <Undo className="h-3 w-3" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRestart}
              className="h-8 text-xs neo-btn"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="h-8 text-xs neo-btn"
            >
              <Save className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* NumberPad compacto na parte inferior */}
        <div className="max-w-sm mx-auto w-full">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <Button
                key={number}
                variant="outline"
                onClick={() => handleNumberInput(number)}
                disabled={!gameState.selectedCell || gameState.initialBoard[gameState.selectedCell[0]][gameState.selectedCell[1]] !== 0}
                className={cn(
                  "h-10 text-lg font-bold neo-btn",
                  "modern-card border-2 border-primary/20",
                  "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20",
                  "active:scale-95 transition-all duration-200",
                  "bg-gradient-to-br from-card to-card/80",
                  "hover:from-primary/5 hover:to-primary/10"
                )}
              >
                {number}
              </Button>
            ))}
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleHint}
              disabled={gameState.hintsUsed >= gameState.maxHints}
              className="flex-1 h-10 neo-btn"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Dica
            </Button>
            
            <Button
              variant="outline"
              onClick={handleErase}
              disabled={!gameState.selectedCell || gameState.initialBoard[gameState.selectedCell[0]][gameState.selectedCell[1]] !== 0}
              className="flex-1 h-10 neo-btn"
            >
              <Eraser className="h-4 w-4 mr-2" />
              Apagar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
