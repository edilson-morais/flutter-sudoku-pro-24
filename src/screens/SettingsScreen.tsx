import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Settings, 
  Download, 
  Upload, 
  Trash2,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Info
} from "lucide-react";
import { StorageService } from "@/services/storage-service";
import { useToast } from "@/hooks/use-toast";

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('sudoku_dark_mode') === 'true' || 
    (localStorage.getItem('sudoku_dark_mode') === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [soundEnabled, setSoundEnabled] = useState(
    localStorage.getItem('sudoku_sound_enabled') !== 'false'
  );
  const [autoSave, setAutoSave] = useState(
    localStorage.getItem('sudoku_auto_save') !== 'false'
  );
  const [showConflicts, setShowConflicts] = useState(
    localStorage.getItem('sudoku_show_conflicts') !== 'false'
  );
  
  const storageService = new StorageService();
  const { toast } = useToast();

  // Apply dark mode on mount and when changed
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('sudoku_dark_mode', isDarkMode.toString());
  }, [isDarkMode]);

  const handleDarkModeToggle = (enabled: boolean) => {
    setIsDarkMode(enabled);
  };

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem('sudoku_sound_enabled', enabled.toString());
  };

  const handleAutoSaveToggle = (enabled: boolean) => {
    setAutoSave(enabled);
    localStorage.setItem('sudoku_auto_save', enabled.toString());
  };

  const handleShowConflictsToggle = (enabled: boolean) => {
    setShowConflicts(enabled);
    localStorage.setItem('sudoku_show_conflicts', enabled.toString());
  };

  const handleExportData = () => {
    try {
      const data = storageService.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sudoku-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Dados exportados!",
        description: "Backup dos seus dados foi baixado com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível exportar os dados.",
        variant: "destructive"
      });
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            if (storageService.importData(content)) {
              toast({
                title: "Dados importados!",
                description: "Seus dados foram restaurados com sucesso."
              });
            } else {
              throw new Error('Invalid data format');
            }
          } catch (error) {
            toast({
              title: "Erro ao importar",
              description: "Arquivo inválido ou corrompido.",
              variant: "destructive"
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearData = () => {
    if (confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.clear();
      toast({
        title: "Dados apagados",
        description: "Todos os dados foram removidos com sucesso."
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">Personalize sua experiência</p>
          </div>
        </div>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isDarkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Modo Escuro</Label>
                <p className="text-sm text-muted-foreground">
                  Interface com cores escuras para reduzir o cansaço visual
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Game Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Jogo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-save">Salvamento Automático</Label>
                <p className="text-sm text-muted-foreground">
                  Salva o progresso automaticamente a cada 5 segundos
                </p>
              </div>
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={handleAutoSaveToggle}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-conflicts">Mostrar Conflitos</Label>
                <p className="text-sm text-muted-foreground">
                  Destaca células com números conflitantes
                </p>
              </div>
              <Switch
                id="show-conflicts"
                checked={showConflicts}
                onCheckedChange={handleShowConflictsToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Audio Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {soundEnabled ? <Volume2 className="h-5 w-5 text-primary" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
              Áudio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sound-enabled">Efeitos Sonoros</Label>
                <p className="text-sm text-muted-foreground">
                  Sons de feedback para ações do jogo
                </p>
              </div>
              <Switch
                id="sound-enabled"
                checked={soundEnabled}
                onCheckedChange={handleSoundToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleExportData} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              
              <Button variant="outline" onClick={handleImportData} size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
            </div>

            <div className="pt-2 border-t">
              <Button 
                variant="destructive" 
                onClick={handleClearData} 
                size="sm"
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Apagar Todos os Dados
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Remove todos os jogos salvos e estatísticas permanentemente
              </p>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Sobre
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Sudoku Mobile</strong> - Versão 1.0
            </p>
            <p>
              Um jogo de Sudoku otimizado para dispositivos móveis com interface limpa e intuitiva.
            </p>
            <p>
              Desenvolvido com React, TypeScript e Tailwind CSS.
            </p>
            <div className="pt-4 space-y-1">
              <p className="text-xs">
                <strong>Recursos:</strong>
              </p>
              <ul className="text-xs space-y-1 ml-4">
                <li>• 3 níveis de dificuldade</li>
                <li>• Sistema de dicas limitadas</li>
                <li>• Modo de anotações</li>
                <li>• Detecção de conflitos</li>
                <li>• Salvamento automático</li>
                <li>• Estatísticas detalhadas</li>
                <li>• Backup e restore de dados</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}