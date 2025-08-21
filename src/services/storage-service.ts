import { GameState } from './sudoku-service';

export interface GameStats {
  gamesPlayed: number;
  gamesCompleted: number;
  bestTimes: {
    facil: number | null;
    medio: number | null;
    dificil: number | null;
  };
  totalTime: number;
  hintsUsed: number;
}

export class StorageService {
  private static readonly GAME_STATE_KEY = 'sudoku_game_state';
  private static readonly STATS_KEY = 'sudoku_stats';

  // Save current game state
  saveGameState(gameState: GameState): void {
    try {
      localStorage.setItem(StorageService.GAME_STATE_KEY, JSON.stringify(gameState));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }

  // Load saved game state
  loadGameState(): GameState | null {
    try {
      const saved = localStorage.getItem(StorageService.GAME_STATE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load game state:', error);
      return null;
    }
  }

  // Clear saved game state
  clearGameState(): void {
    try {
      localStorage.removeItem(StorageService.GAME_STATE_KEY);
    } catch (error) {
      console.error('Failed to clear game state:', error);
    }
  }

  // Save game statistics
  saveStats(stats: GameStats): void {
    try {
      localStorage.setItem(StorageService.STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to save stats:', error);
    }
  }

  // Load game statistics
  loadStats(): GameStats {
    try {
      const saved = localStorage.getItem(StorageService.STATS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }

    // Return default stats
    return {
      gamesPlayed: 0,
      gamesCompleted: 0,
      bestTimes: {
        facil: null,
        medio: null,
        dificil: null
      },
      totalTime: 0,
      hintsUsed: 0
    };
  }

  // Update stats after game completion
  updateStatsOnCompletion(difficulty: string, timeInSeconds: number, hintsUsed: number): void {
    const stats = this.loadStats();
    
    stats.gamesCompleted++;
    stats.totalTime += timeInSeconds;
    stats.hintsUsed += hintsUsed;

    // Update best time for difficulty
    const diffKey = difficulty as keyof typeof stats.bestTimes;
    if (!stats.bestTimes[diffKey] || timeInSeconds < stats.bestTimes[diffKey]!) {
      stats.bestTimes[diffKey] = timeInSeconds;
    }

    this.saveStats(stats);
  }

  // Update stats when starting a new game
  updateStatsOnStart(): void {
    const stats = this.loadStats();
    stats.gamesPlayed++;
    this.saveStats(stats);
  }

  // Format time in MM:SS format
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Get average completion time
  getAverageTime(): number {
    const stats = this.loadStats();
    return stats.gamesCompleted > 0 ? Math.floor(stats.totalTime / stats.gamesCompleted) : 0;
  }

  // Export game data for backup
  exportData(): string {
    const gameState = this.loadGameState();
    const stats = this.loadStats();
    
    return JSON.stringify({
      gameState,
      stats,
      exportDate: new Date().toISOString()
    });
  }

  // Import game data from backup
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.gameState) {
        this.saveGameState(data.gameState);
      }
      
      if (data.stats) {
        this.saveStats(data.stats);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}