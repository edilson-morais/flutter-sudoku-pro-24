import { useState } from "react";
import { HomeScreen } from "@/screens/HomeScreen";
import { GameScreen } from "@/screens/GameScreen";
import { StatsScreen } from "@/screens/StatsScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";

type Screen = 'home' | 'game' | 'stats' | 'settings';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [gameDifficulty, setGameDifficulty] = useState<string>('medio');
  const [loadSavedGame, setLoadSavedGame] = useState(false);

  const handleNewGame = (difficulty: string) => {
    setGameDifficulty(difficulty);
    setLoadSavedGame(false);
    setCurrentScreen('game');
  };

  const handleContinueGame = () => {
    setLoadSavedGame(true);
    setCurrentScreen('game');
  };

  const handleHomeNavigation = () => {
    setCurrentScreen('home');
    setLoadSavedGame(false);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background safe-area-padding">
      {currentScreen === 'home' && (
        <HomeScreen
          onNewGame={handleNewGame}
          onContinueGame={handleContinueGame}
          onStats={() => setCurrentScreen('stats')}
          onSettings={() => setCurrentScreen('settings')}
        />
      )}

      {currentScreen === 'game' && (
        <GameScreen
          difficulty={gameDifficulty}
          onHome={handleHomeNavigation}
          loadSavedGame={loadSavedGame}
        />
      )}

      {currentScreen === 'stats' && (
        <StatsScreen onBack={handleHomeNavigation} />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen onBack={handleHomeNavigation} />
      )}
    </div>
  );
};

export default Index;
