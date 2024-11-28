import React, { useState } from "react";
import { Settings, Save, X, Palette, Layout, Sparkles } from "lucide-react";
import EffectListTab from "./effectStatus/EffectListTab";
import EffectCreatorTab from "./effectStatus/EffectCreatorTab";
import { Effect } from "./effectStatus/types/effectTypes";

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
  effectStatus: {
    enabled: boolean;
    displayMode: {
      showIcons: boolean;
      showCounters: boolean;
      showTooltips: boolean;
    };
    position: {
      top: boolean;
      right: boolean;
      bottom: boolean;
      left: boolean;
    };
    categories: {
      buffs: boolean;
      debuffs: boolean;
      combat: boolean;
      special: boolean;
      defense: boolean;
      health: boolean;
    };
  };
}

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
  const [activeTab, setActiveTab] = useState<
    "theme" | "defaults" | "display" | "effects"
  >("theme");
  const [activeEffectTab, setActiveEffectTab] = useState<
    "list" | "creator" | null
  >(null);
  const [editingEffect, setEditingEffect] = useState<Effect | undefined>(
    undefined
  );

  const handleEditEffect = (effect: Effect) => {
    setEditingEffect(effect);
    setActiveEffectTab("creator");
  };

  // Handler für das Schließen des Effect Managements
  const handleCloseEffectManagement = () => {
    setActiveEffectTab(null);
    setEditingEffect(undefined);
  };

  const tabs = [
    { id: "theme", label: "Design", icon: Palette },
    { id: "defaults", label: "Standardwerte", icon: Settings },
    { id: "display", label: "Anzeige", icon: Layout },
    { id: "effects", label: "Status Effekte", icon: Sparkles },
  ];

  const [localConfig, setLocalConfig] = useState<CharacterConfig>(config);

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
    const calculateExpForNextLevel = (level: number) =>
      level * POINTS_PER_LEVEL;

    const level = calculateLevel(currentExp);
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
            style={{
              width: `${(expInCurrentLevel / POINTS_PER_LEVEL) * 100}%`,
            }}
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
//                onClick={() => setActiveTab("theme")}
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
//                onClick={() => setActiveTab("display")}
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
              <button
                onClick={() => setActiveTab("effects")}
                className={`w-full px-3 py-2 rounded-lg flex items-center space-x-2
                  ${
                    activeTab === "effects"
                      ? "bg-indigo-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Status-Effekte</span>
              </button>
            </nav>
          </div>

          {/* Effects Tab Content */}
          {activeTab === "effects" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Status Effekte</h3>

              {/* Haupt-Toggle für Effect Status */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={localConfig.effectStatus?.enabled ?? true}
                      onChange={(e) =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          effectStatus: {
                            ...prev.effectStatus,
                            enabled: e.target.checked,
                          },
                        }))
                      }
                      className="rounded border-gray-300"
                    />
                    <span>Status Effekte aktivieren</span>
                  </label>
                </div>

                {localConfig.effectStatus?.enabled && (
                  <>
                    {/* Display Options */}
                    <div className="space-y-4 mt-6">
                      <h4 className="text-sm font-medium text-gray-700">
                        Anzeigeoptionen
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(
                          localConfig.effectStatus.displayMode || {}
                        ).map(([key, value]) => (
                          <label
                            key={key}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) =>
                                setLocalConfig((prev) => ({
                                  ...prev,
                                  effectStatus: {
                                    ...prev.effectStatus,
                                    displayMode: {
                                      ...prev.effectStatus.displayMode,
                                      [key]: e.target.checked,
                                    },
                                  },
                                }))
                              }
                              className="rounded border-gray-300"
                            />
                            <span>{key.replace(/([A-Z])/g, " $1").trim()}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700">
                        Kategorien
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(
                          localConfig.effectStatus.categories || {}
                        ).map(([key, value]) => (
                          <label
                            key={key}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) =>
                                setLocalConfig((prev) => ({
                                  ...prev,
                                  effectStatus: {
                                    ...prev.effectStatus,
                                    categories: {
                                      ...prev.effectStatus.categories,
                                      [key]: e.target.checked,
                                    },
                                  },
                                }))
                              }
                              className="rounded border-gray-300"
                            />
                            <span>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Effect Management */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700">
                        Effekt Verwaltung
                      </h4>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => setActiveEffectTab("list")}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          Effekt Liste
                        </button>
                        <button
                          onClick={() => setActiveEffectTab("creator")}
                          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                        >
                          Neuen Effekt erstellen
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Effect Management Modal */}
          {activeEffectTab && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
              <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-xl font-bold">
                    {activeEffectTab === "list"
                      ? "Effekt Liste"
                      : "Effekt erstellen"}
                  </h2>
                  <button
                    onClick={handleCloseEffectManagement}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-auto p-6">
                  {activeEffectTab === "list" ? (
                    <EffectListTab onEdit={handleEditEffect} />
                  ) : (
                    <EffectCreatorTab
                      editEffect={editingEffect}
                      onClose={handleCloseEffectManagement}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

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
