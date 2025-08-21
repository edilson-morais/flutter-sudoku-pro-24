import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Trophy, 
  Clock, 
  Zap, 
  BarChart3,
  TrendingUp,
  Target
} from "lucide-react";
import { StorageService } from "@/services/storage-service";

interface StatsScreenProps {
  onBack: () => void;
}

export function StatsScreen({ onBack }: StatsScreenProps) {
  const storageService = new StorageService();
  const stats = storageService.loadStats();

  const completionRate = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesCompleted / stats.gamesPlayed) * 100) 
    : 0;

  const averageTime = storageService.getAverageTime();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Estatísticas</h1>
            <p className="text-muted-foreground">Seu progresso no Sudoku</p>
          </div>
        </div>

        {/* Overall Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Visão Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-1">
                  <Target className="h-5 w-5 text-accent" />
                  <span className="text-3xl font-bold">{stats.gamesPlayed}</span>
                </div>
                <p className="text-sm text-muted-foreground">Jogos Iniciados</p>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-1">
                  <Trophy className="h-5 w-5 text-accent" />
                  <span className="text-3xl font-bold">{stats.gamesCompleted}</span>
                </div>
                <p className="text-sm text-muted-foreground">Jogos Completos</p>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="text-3xl font-bold">{completionRate}%</span>
                </div>
                <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-3xl font-bold">
                    {storageService.formatTime(averageTime)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Tempo Médio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Times by Difficulty */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Melhores Tempos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Easy */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div>
                    <p className="font-semibold">Fácil</p>
                    <p className="text-sm text-muted-foreground">40+ pistas</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-background">
                  {stats.bestTimes.facil 
                    ? storageService.formatTime(stats.bestTimes.facil)
                    : "--:--"
                  }
                </Badge>
              </div>

              {/* Medium */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div>
                    <p className="font-semibold">Médio</p>
                    <p className="text-sm text-muted-foreground">30-35 pistas</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-background">
                  {stats.bestTimes.medio 
                    ? storageService.formatTime(stats.bestTimes.medio)
                    : "--:--"
                  }
                </Badge>
              </div>

              {/* Hard */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div>
                    <p className="font-semibold">Difícil</p>
                    <p className="text-sm text-muted-foreground">24-29 pistas</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-background">
                  {stats.bestTimes.dificil 
                    ? storageService.formatTime(stats.bestTimes.dificil)
                    : "--:--"
                  }
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-warning" />
              Estatísticas Extras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-warning" />
                  <span className="text-sm">Total de dicas usadas</span>
                </div>
                <Badge variant="outline">{stats.hintsUsed}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm">Tempo total jogado</span>
                </div>
                <Badge variant="outline">
                  {storageService.formatTime(stats.totalTime)}
                </Badge>
              </div>

              {stats.gamesCompleted > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-warning" />
                    <span className="text-sm">Dicas por jogo (média)</span>
                  </div>
                  <Badge variant="outline">
                    {(stats.hintsUsed / stats.gamesCompleted).toFixed(1)}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Achievements placeholder */}
        {stats.gamesCompleted >= 5 && (
          <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" />
                Conquista Desbloqueada!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-2xl">🏆</div>
                <p className="font-semibold">Mestre Sudoku</p>
                <p className="text-sm text-muted-foreground">
                  Complete 5 jogos para desbloquear esta conquista
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}