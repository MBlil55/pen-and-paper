import React, { useState } from "react";
import {
  Settings,
  Save,
  X,
  Palette,
  Layout,
  Shield,
  Heart,
} from "lucide-react";

export interface CharacterConfig {
  theme: {
    primary: string;
    secondary: string;
    healthBar: {
      high: string;
      medium: string;
      low: string;
    };
    armorBar: string;
  };
  defaults: {
    maxHealth: number;
    maxArmor: number;
    currentExp: number;
  };
  display: {
    showPortrait: boolean;
    showEffects: boolean;
    showCombatLog: boolean;
    compactMode: boolean;
    showLevelSystem: boolean;
  };
  character: {
    race: string;
    class: string;
    path: string;
  };
}

interface LevelSystemProps {
  currentExp: number;
  onExpChange: (exp: number) => void;
}

const POINTS_PER_LEVEL = 25;

const LevelSystem: React.FC<LevelSystemProps> = ({
  currentExp,
  onExpChange,
}) => {
  const calculateLevel = (exp: number) =>
    Math.floor(exp / POINTS_PER_LEVEL) + 1;
  const calculateExpForNextLevel = (level: number) => level * POINTS_PER_LEVEL;

  const level = calculateLevel(currentExp);
  const expForNextLevel = calculateExpForNextLevel(level);
  const expInCurrentLevel = currentExp % POINTS_PER_LEVEL;

  return (
    <div className="space-y-1 mb-4">
      {/* Level Badge und EXP Input */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium">Level {level}</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={currentExp}
            onChange={(e) => {
              const newExp = Math.max(0, parseInt(e.target.value) || 0);
              onExpChange(newExp);
            }}
            className="w-20 px-2 py-0.5 text-sm border rounded-md focus:ring-1 
                     focus:ring-yellow-400 focus:outline-none"
          />
          <span className="text-xs text-gray-500">Punkte</span>
        </div>
      </div>

      {/* EXP Bar */}
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-gradient-to-r from-yellow-400 to-yellow-500
                   transition-all duration-300"
          style={{ width: `${(expInCurrentLevel / POINTS_PER_LEVEL) * 100}%` }}
        >
          <div className="absolute inset-0 animate-pulse bg-white/20" />
        </div>
      </div>

      {/* EXP Info */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>
          {expInCurrentLevel} / {POINTS_PER_LEVEL} Punkte
        </span>
        <span>
          {POINTS_PER_LEVEL - expInCurrentLevel} bis Level {level + 1}
        </span>
      </div>
    </div>
  );
};

const CharacterTab: React.FC<{
  config: CharacterConfig;
  onUpdateConfig: (updates: Partial<CharacterConfig>) => void;
}> = ({ config, onUpdateConfig }) => {
  // Predefined options
  const CHARACTER_OPTIONS = {
    races: ['Mensch', 'Elf', 'Zwerg', 'Ork', 'Halbling'],
    classes: ['Magier', 'Krieger', 'Schurke', 'Kleriker', 'Druide'],
    paths: ['Wanderer', 'Gelehrter', 'Söldner', 'Händler', 'Adliger']
  };

  const updateCharacter = (key: keyof CharacterConfig['character'], value: string) => {
    onUpdateConfig({
      character: {
        ...config.character,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Charakter Einstellungen</h3>

      {/* Rasse */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Rasse</label>
        <select
          value={config.character.race}
          onChange={(e) => updateCharacter('race', e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
        >
          {CHARACTER_OPTIONS.races.map(race => (
            <option key={race} value={race}>{race}</option>
          ))}
        </select>
      </div>

      {/* Klasse */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Klasse</label>
        <select
          value={config.character.class}
          onChange={(e) => updateCharacter('class', e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
        >
          {CHARACTER_OPTIONS.classes.map(characterClass => (
            <option key={characterClass} value={characterClass}>{characterClass}</option>
          ))}
        </select>
      </div>

      {/* Pfad */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Pfad</label>
        <select
          value={config.character.path}
          onChange={(e) => updateCharacter('path', e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
        >
          {CHARACTER_OPTIONS.paths.map(path => (
            <option key={path} value={path}>{path}</option>
          ))}
        </select>
      </div>
    </div>
  );
};


interface ConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: CharacterConfig;
  onSave: (config: CharacterConfig) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<"theme" | "defaults" | "display" | "character">(
    "theme"
  );
  const [localConfig, setLocalConfig] = useState<CharacterConfig>(config);

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Widget Einstellungen</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <div className="w-48 border-r bg-gray-50 p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("theme")}
                className={`w-full px-3 py-2 rounded-lg flex items-center space-x-2
                  ${
                    activeTab === "theme"
                      ? "bg-indigo-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Palette className="w-4 h-4" />
                <span>Design</span>
              </button>
              <button
                onClick={() => setActiveTab("defaults")}
                className={`w-full px-3 py-2 rounded-lg flex items-center space-x-2
                  ${
                    activeTab === "defaults"
                      ? "bg-indigo-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Settings className="w-4 h-4" />
                <span>Standardwerte</span>
              </button>
              <button
                onClick={() => setActiveTab("display")}
                className={`w-full px-3 py-2 rounded-lg flex items-center space-x-2
                  ${
                    activeTab === "display"
                      ? "bg-indigo-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Layout className="w-4 h-4" />
                <span>Anzeige</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "theme" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Farbschema</h3>

                {/* Primary Color */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Primärfarbe
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={localConfig.theme.primary}
                      onChange={(e) =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, primary: e.target.value },
                        }))
                      }
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localConfig.theme.primary}
                      onChange={(e) =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, primary: e.target.value },
                        }))
                      }
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                {/* Health Bar Colors */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium">
                    Lebensbalken Farben
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Hohe Gesundheit
                      </label>
                      <input
                        type="color"
                        value={localConfig.theme.healthBar.high}
                        onChange={(e) =>
                          setLocalConfig((prev) => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              healthBar: {
                                ...prev.theme.healthBar,
                                high: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full h-8 rounded cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Mittlere Gesundheit
                      </label>
                      <input
                        type="color"
                        value={localConfig.theme.healthBar.medium}
                        onChange={(e) =>
                          setLocalConfig((prev) => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              healthBar: {
                                ...prev.theme.healthBar,
                                medium: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full h-8 rounded cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Niedrige Gesundheit
                      </label>
                      <input
                        type="color"
                        value={localConfig.theme.healthBar.low}
                        onChange={(e) =>
                          setLocalConfig((prev) => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              healthBar: {
                                ...prev.theme.healthBar,
                                low: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full h-8 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-4">
                    Vorschau
                  </h4>
                  <div className="space-y-3">
                    <div
                      className="h-6 rounded-lg"
                      style={{
                        backgroundColor: localConfig.theme.healthBar.high,
                      }}
                    />
                    <div
                      className="h-6 rounded-lg"
                      style={{
                        backgroundColor: localConfig.theme.healthBar.medium,
                      }}
                    />
                    <div
                      className="h-6 rounded-lg"
                      style={{
                        backgroundColor: localConfig.theme.healthBar.low,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "defaults" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Standardwerte</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Maximale Gesundheit
                    </label>
                    <input
                      type="number"
                      value={localConfig.defaults.maxHealth}
                      onChange={(e) =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          defaults: {
                            ...prev.defaults,
                            maxHealth: parseInt(e.target.value),
                          },
                        }))
                      }
                      min="1"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Maximale Rüstung
                    </label>
                    <input
                      type="number"
                      value={localConfig.defaults.maxArmor}
                      onChange={(e) =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          defaults: {
                            ...prev.defaults,
                            maxArmor: parseInt(e.target.value),
                          },
                        }))
                      }
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>

                  {/* Neues Feld für EXP */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Aktuelle Punkte
                      </label>
                      <span className="text-xs text-gray-500">
                        Level{" "}
                        {Math.floor(
                          localConfig.defaults.currentExp / POINTS_PER_LEVEL
                        ) + 1}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={localConfig.defaults.currentExp}
                      onChange={(e) =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          defaults: {
                            ...prev.defaults,
                            currentExp: Math.max(
                              0,
                              parseInt(e.target.value) || 0
                            ),
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500">
                      Alle {POINTS_PER_LEVEL} Punkte wird ein neues Level
                      erreicht
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "display" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Anzeigeoptionen</h3>

                <div className="space-y-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={localConfig.display.showPortrait}
                      onChange={(e) =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          display: {
                            ...prev.display,
                            showPortrait: e.target.checked,
                          },
                        }))
                      }
                      className="rounded border-gray-300 text-indigo-600 
                               focus:ring-indigo-500"
                    />
                    <span>Portrait anzeigen</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={localConfig.display.showEffects}
                      onChange={(e) =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          display: {
                            ...prev.display,
                            showEffects: e.target.checked,
                          },
                        }))
                      }
                      className="rounded border-gray-300 text-indigo-600 
                               focus:ring-indigo-500"
                    />
                    <span>Effekte anzeigen</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={localConfig.display.showCombatLog}
                      onChange={(e) =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          display: {
                            ...prev.display,
                            showCombatLog: e.target.checked,
                          },
                        }))
                      }
                      className="rounded border-gray-300 text-indigo-600 
                               focus:ring-indigo-500"
                    />
                    <span>Kampflog anzeigen</span>
                  </label>

                  {/* Bestehende Checkboxen */}
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={localConfig.display.showPortrait}
                      onChange={(e) =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          display: {
                            ...prev.display,
                            showPortrait: e.target.checked,
                          },
                        }))
                      }
                      className="rounded border-gray-300"
                    />
                    <span>Portrait anzeigen</span>
                  </label>

                  {/* Neue Checkbox für Level-System */}
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={localConfig.display.showLevelSystem}
                      onChange={(e) =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          display: {
                            ...prev.display,
                            showLevelSystem: e.target.checked,
                          },
                        }))
                      }
                      className="rounded border-gray-300"
                    />
                    <span>Level-System anzeigen</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={localConfig.display.compactMode}
                      onChange={(e) =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          display: {
                            ...prev.display,
                            compactMode: e.target.checked,
                          },
                        }))
                      }
                      className="rounded border-gray-300 text-indigo-600 
                               focus:ring-indigo-500"
                    />
                    <span>Kompakter Modus</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600
                     flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Speichern</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
