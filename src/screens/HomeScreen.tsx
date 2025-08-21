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
  Save,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { StorageService } from "@/services/storage-service";
import { cn } from "@/lib/utils";

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
    { 
      key: "facil", 
      name: "Fácil", 
      description: "40+ pistas", 
      color: "from-green-500 to-emerald-600",
      icon: "🌱",
      stats: "Perfeito para começar"
    },
    { 
      key: "medio", 
      name: "Médio", 
      description: "30-35 pistas", 
      color: "from-yellow-500 to-orange-500",
      icon: "⚡",
      stats: "Equilibrio ideal"
    },
    { 
      key: "dificil", 
      name: "Difícil", 
      description: "24-29 pistas", 
      color: "from-red-500 to-rose-600",
      icon: "🔥",
      stats: "Para especialistas"
    }
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-background via-background to-muted/20 p-3 sm:p-4 overflow-y-auto relative">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      
      <div className="relative max-w-sm sm:max-w-md mx-auto space-y-4 sm:space-y-6 pb-4">
        {/* Header with modern design */}
        <div className="text-center space-y-3 pt-6 animate-fade-in">
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
              Sudoku
            </h1>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-6 w-6 text-accent animate-pulse" />
            </div>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Desafie sua mente com o clássico jogo de números em uma experiência moderna
          </p>
        </div>

        {/* Continue Game Card - Modern glassmorphism */}
        {hasSavedGame && (
          <div className="modern-card animate-scale-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Save className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="gradient-text">Continuar Jogo</span>
                  <p className="text-sm text-muted-foreground font-normal">Retome de onde parou</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={onContinueGame} className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40" size="lg">
                <Play className="h-4 w-4 mr-2" />
                Continuar Partida
              </Button>
            </CardContent>
          </div>
        )}

        {/* New Game - Enhanced with better UX */}
        <div className="modern-card animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/10">
                <Play className="h-5 w-5 text-accent" />
              </div>
              <span className="gradient-text">Novo Jogo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enhanced Difficulty Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">
                Escolha seu desafio:
              </label>
              <div className="grid gap-3">
                {difficulties.map((diff) => (
                  <button
                    key={diff.key}
                    onClick={() => setSelectedDifficulty(diff.key)}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group",
                      selectedDifficulty === diff.key
                        ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg shadow-primary/20"
                        : "border-border/50 hover:border-border bg-card/50 hover:bg-card/80"
                    )}
                  >
                    {/* Background gradient */}
                    <div className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                      `bg-gradient-to-br ${diff.color}`
                    )} />
                    
                    <div className="relative flex items-center gap-3">
                      <div className="text-2xl">{diff.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base">{diff.name}</span>
                          {selectedDifficulty === diff.key && (
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {diff.description}
                        </div>
                        <div className="text-xs text-accent font-medium mt-1">
                          {diff.stats}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => onNewGame(selectedDifficulty)} 
              className="w-full h-12 rounded-xl bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 shadow-lg shadow-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent/40" 
              size="lg"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Iniciar Aventura
            </Button>
          </CardContent>
        </div>

        {/* Enhanced Stats Card */}
        <div className="modern-card animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/10">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <span className="gradient-text">Suas Conquistas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center space-y-2 p-3 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold gradient-text">{stats.gamesCompleted}</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">Jogos Completos</p>
              </div>
              
              <div className="text-center space-y-2 p-3 rounded-xl bg-gradient-to-br from-accent/5 to-accent/10">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <span className="text-2xl font-bold gradient-text">
                    {storageService.formatTime(storageService.getAverageTime())}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">Tempo Médio</p>
              </div>
            </div>

            {/* Best Times */}
            {(stats.bestTimes.facil || stats.bestTimes.medio || stats.bestTimes.dificil) && (
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Melhores Tempos:
                </p>
                <div className="space-y-2">
                  {stats.bestTimes.facil && (
                    <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                      <span className="text-sm text-muted-foreground">🌱 Fácil:</span>
                      <Badge variant="outline" className="text-xs bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300">
                        {storageService.formatTime(stats.bestTimes.facil)}
                      </Badge>
                    </div>
                  )}
                  {stats.bestTimes.medio && (
                    <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                      <span className="text-sm text-muted-foreground">⚡ Médio:</span>
                      <Badge variant="outline" className="text-xs bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                        {storageService.formatTime(stats.bestTimes.medio)}
                      </Badge>
                    </div>
                  )}
                  {stats.bestTimes.dificil && (
                    <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                      <span className="text-sm text-muted-foreground">🔥 Difícil:</span>
                      <Badge variant="outline" className="text-xs bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300">
                        {storageService.formatTime(stats.bestTimes.dificil)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </div>

        {/* Enhanced Navigation */}
        <div className="grid grid-cols-2 gap-4 animate-slide-up">
          <Button 
            variant="outline" 
            onClick={onStats} 
            size="lg"
            className="h-14 rounded-2xl border-2 border-primary/20 hover:border-primary/50 bg-gradient-to-br from-card to-card/80 hover:from-primary/5 hover:to-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex flex-col items-center gap-1">
              <BarChart3 className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-200" />
              <span className="text-xs font-medium">Estatísticas</span>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onSettings} 
            size="lg"
            className="h-14 rounded-2xl border-2 border-accent/20 hover:border-accent/50 bg-gradient-to-br from-card to-card/80 hover:from-accent/5 hover:to-accent/10 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex flex-col items-center gap-1">
              <Settings className="h-5 w-5 text-accent group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-xs font-medium">Configurações</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
