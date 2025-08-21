import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  BarChart3, 
  Settings, 
  Trophy,
  Clock,
  Zap,
  Save
} from "lucide-react";
import { StorageService } from "@/services/storage-service";

interface HomeScreenProps {
  onNewGame: (difficulty: string) => void;
  onContinueGame: () => void;
  onStats: () => void;
  onSettings: () => void;
}

export function HomeScreen({ onNewGame, onContinueGame, onStats, onSettings }: HomeScreenProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("medio");
  const storageService = new StorageService();
  
  const hasSavedGame = storageService.loadGameState() !== null;
  const stats = storageService.loadStats();

  const difficulties = [
    { key: "facil", name: "Fácil", description: "40+ pistas", color: "bg-green-500" },
    { key: "medio", name: "Médio", description: "30-35 pistas", color: "bg-yellow-500" },
    { key: "dificil", name: "Difícil", description: "24-29 pistas", color: "bg-red-500" }
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background p-3 sm:p-4 overflow-y-auto">
      <div className="max-w-sm sm:max-w-md mx-auto space-y-4 sm:space-y-6 pb-4">
        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
            Sudoku
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Desafie sua mente com o clássico jogo de números
          </p>
        </div>

        {/* Continue Game Card */}
        {hasSavedGame && (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Save className="h-5 w-5 text-primary" />
                Continuar Jogo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={onContinueGame} className="w-full" size="lg">
                <Play className="h-4 w-4 mr-2" />
                Continuar onde parou
              </Button>
            </CardContent>
          </Card>
        )}

        {/* New Game */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-accent" />
              Novo Jogo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Difficulty Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Escolha a dificuldade:
              </label>
               <div className="grid grid-cols-3 gap-2">
                {difficulties.map((diff) => (
                  <button
                    key={diff.key}
                    onClick={() => setSelectedDifficulty(diff.key)}
                    className={`p-2 rounded-lg border-2 transition-all text-center ${
                      selectedDifficulty === diff.key
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-sm">{diff.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {diff.description}
                      </div>
                      <div className={`w-2 h-2 rounded-full ${diff.color} mx-auto`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => onNewGame(selectedDifficulty)} 
              className="w-full" 
              size="lg"
            >
              <Play className="h-4 w-4 mr-2" />
              Iniciar Jogo
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Suas Estatísticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <Trophy className="h-4 w-4 text-accent" />
                  <span className="text-2xl font-bold">{stats.gamesCompleted}</span>
                </div>
                <p className="text-xs text-muted-foreground">Jogos Completos</p>
              </div>
              
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-2xl font-bold">
                    {storageService.formatTime(storageService.getAverageTime())}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Tempo Médio</p>
              </div>
            </div>

            {/* Best Times */}
            {(stats.bestTimes.facil || stats.bestTimes.medio || stats.bestTimes.dificil) && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-2">Melhores Tempos:</p>
                <div className="space-y-1">
                  {stats.bestTimes.facil && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fácil:</span>
                      <Badge variant="outline" className="text-xs">
                        {storageService.formatTime(stats.bestTimes.facil)}
                      </Badge>
                    </div>
                  )}
                  {stats.bestTimes.medio && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Médio:</span>
                      <Badge variant="outline" className="text-xs">
                        {storageService.formatTime(stats.bestTimes.medio)}
                      </Badge>
                    </div>
                  )}
                  {stats.bestTimes.dificil && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Difícil:</span>
                      <Badge variant="outline" className="text-xs">
                        {storageService.formatTime(stats.bestTimes.dificil)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={onStats} size="lg">
            <BarChart3 className="h-4 w-4 mr-2" />
            Estatísticas
          </Button>
          
          <Button variant="outline" onClick={onSettings} size="lg">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>
    </div>
  );
}