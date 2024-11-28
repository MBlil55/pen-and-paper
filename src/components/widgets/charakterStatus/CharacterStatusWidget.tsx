import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  Shield,
  Heart,
  Brain,
  Footprints,
  Eye,
  Crown,
  Settings,
  Trophy,
  Swords,
  Zap,
  RefreshCw,
  BarChart2,
  Trash2,
  Plus,
} from "lucide-react";
import { type CharacterConfig } from "../ConfigPanel";
import ConfigPanel from "../ConfigPanel";
import EtherealHealthBar from "./EtherealHealthBar";
import EtherealArmorBar from "./EtherealArmorBar";
import DeathScreen from "./DeathScreen";
import "./PortraitEffects.css";
import EffectStatusWidget from "../effectStatus/EffectSatusWidget";
import AnimatedPortrait from "../AnimatedPortrait";
import DamageInput from "./DamageInput";
import { useGearStore } from "../gearWidget/store/useGearStore";
import { usePersistentState } from "../usePersistentState";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Tab Typ-Definitionen
type TabType = 'status' | 'stats';

interface TabConfig {
  id: TabType;
  label: string;
  icon: LucideIcon;
}

const TABS: TabConfig[] = [
  { id: 'status', label: 'Status', icon: Heart },
  { id: 'stats', label: 'Attribute', icon: BarChart2 }
];

interface CharacterStat {
  id: string;
  name: string;
  value: number;
  maxValue?: number;  // Optional für Stats mit Maximum
  icon: string;       // Name des Lucide-Icons
  color?: string;     // Optional für individuelle Farbgebung
  description?: string; // Optional für Tooltips/Beschreibungen
}

interface AddStatModalProps {
  onClose: () => void;
  onAdd: (stat: Omit<CharacterStat, 'id'>) => void;
  availableIcons: typeof AVAILABLE_ICONS;
  colors: typeof STAT_COLORS;
}

interface StatCardProps {
  stat: CharacterStat;
  onDelete: () => void;
  onUpdate: (updates: Partial<CharacterStat>) => void;
}

const AVAILABLE_ICONS = [
  { id: 'swords', icon: Swords, label: 'Kampf' },
  { id: 'shield', icon: Shield, label: 'Verteidigung' },
  { id: 'brain', icon: Brain, label: 'Intelligenz' },
  { id: 'footprints', icon: Footprints, label: 'Beweglichkeit' },
  { id: 'eye', icon: Eye, label: 'Wahrnehmung' },
  { id: 'crown', icon: Crown, label: 'Charisma' },
  { id: 'heart', icon: Heart, label: 'Konstitution' },
  { id: 'zap', icon: Zap, label: 'Geschwindigkeit' }
] as const;

// Vordefinierte Farben
const STAT_COLORS = {
  red: 'rgb(239, 68, 68)',
  blue: 'rgb(59, 130, 246)',
  green: 'rgb(34, 197, 94)',
  purple: 'rgb(168, 85, 247)',
  yellow: 'rgb(234, 179, 8)',
  indigo: 'rgb(99, 102, 241)',
} as const;

const INITIAL_STATUS: CharacterStatus = {
  currentHealth: 100,
  maxHealth: 100,
  currentArmor: 50,
  maxArmor: 50,
  portrait: null,
  effects: ["Gesegnet", "Erschöpft"],
};

const INITIAL_CONFIG: CharacterConfig = {
  theme: {
    primary: "#6366f1",
    secondary: "#4f46e5",
    healthBar: {
      high: "#22c55e",
      medium: "#eab308",
      low: "#ef4444",
    },
    armorBar: "#3b82f6",
  },
  defaults: {
    maxHealth: 100,
    maxArmor: 50,
    currentExp: 0,
  },
  display: {
    showPortrait: true,
    showEffects: true,
    showCombatLog: true,
    compactMode: false,
  },
  character: {
    race: "Mensch",
    class: "Magier",
    path: "Wanderer",
  },
  effectStatus: {
    enabled: true,
    displayMode: {
      showIcons: true,
      showCounters: true,
      showTooltips: true,
    },
    position: {
      top: true,
      right: true,
      bottom: true,
      left: true,
    },
    categories: {
      buffs: true,
      debuffs: true,
      combat: true,
      special: true,
      defense: true,
      health: true,
    },
  },
};

interface CharacterStatus {
  currentHealth: number;
  maxHealth: number;
  currentArmor: number;
  maxArmor: number;
  portrait: string | null;
  effects: string[];
}

interface CombatEvent {
  id: string;
  type: "damage" | "heal" | "block" | "recharge" | "directDamage";
  value: number;
  timestamp: number;
  reduction?: {
    amount: number;
    sources: Array<{
      name: string;
      value: number;
    }>;
  };
}

const CombatLog: React.FC<{ events: CombatEvent[]; maxEvents?: number }> = ({
  events,
  maxEvents = 5,
}) => {
  if (events.length === 0) return null;

  const getEventIcon = (type: CombatEvent["type"]) => {
    switch (type) {
      case "damage":
        return <Swords className="w-4 h-4" />;
      case "directDamage":
        return <Zap className="w-4 h-4" />;
      case "heal":
        return <Heart className="w-4 h-4" />;
      case "block":
        return <Shield className="w-4 h-4" />;
      case "recharge":
        return <RefreshCw className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: CombatEvent["type"]) => {
    switch (type) {
      case "damage":
        return "text-rose-600 bg-rose-50";
      case "directDamage":
        return "text-purple-600 bg-purple-50";
      case "heal":
        return "text-emerald-600 bg-emerald-50";
      case "block":
        return "text-sky-600 bg-sky-50";
      case "recharge":
        return "text-indigo-600 bg-indigo-50";
    }
  };

  const getEventText = (type: CombatEvent["type"]) => {
    switch (type) {
      case "damage":
        return "Schaden";
      case "directDamage":
        return "Direkter Schaden";
      case "heal":
        return "Heilung";
      case "block":
        return "Blockiert";
      case "recharge":
        return "Rüstung aufgeladen";
    }
  };

  const getValueColor = (type: CombatEvent["type"]) => {
    switch (type) {
      case "damage":
        return "text-rose-600";
      case "directDamage":
        return "text-purple-600";
      case "heal":
        return "text-emerald-600";
      case "block":
        return "text-sky-600";
      case "recharge":
        return "text-indigo-600";
    }
  };

  return (
    <div className="bg-white/50 rounded-xl shadow-sm p-4 mt-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">Kampflog</h3>
        <span className="text-xs text-gray-500">
          Letzte {Math.min(events.length, maxEvents)} Ereignisse
        </span>
      </div>

      {/* Event List */}
      <div className="space-y-2">
        {events.slice(0, maxEvents).map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg border border-gray-100 p-3 
                       transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Event Icon */}
                <div
                  className={`p-2 rounded-lg ${getEventColor(event.type)} 
                             transition-colors duration-200`}
                >
                  {getEventIcon(event.type)}
                </div>

                {/* Event Details */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-medium ${getValueColor(event.type)}`}
                    >
                      {(event.type === "damage" ||
                        event.type === "directDamage") &&
                        "-"}
                      {event.type === "heal" && "+"}
                      {event.value}
                    </span>
                    <span className="text-sm text-gray-600">
                      {getEventText(event.type)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {/* Schadenreduktions-Info */}
                {event.reduction && (
                  <div className="mt-1 text-sm">
                    <span className="text-emerald-600">
                      {event.reduction.amount}% Reduktion
                    </span>
                    <div className="text-xs text-gray-500">
                      {event.reduction.sources.map((source, index) => (
                        <span key={index}>
                          {source.name} ({source.value}%)
                          {index < event.reduction.sources.length - 1
                            ? ", "
                            : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-400">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const generateEventId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const AddStatModal: React.FC<AddStatModalProps> = ({
  onClose,
  onAdd,
  availableIcons,
  colors
}) => {
  const [newStat, setNewStat] = useState<Omit<CharacterStat, 'id'>>({
    name: '',
    value: 0,
    icon: 'swords',
    color: STAT_COLORS.blue,
    description: '',
  });

  const [hasMaxValue, setHasMaxValue] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStat.name) return;

    onAdd(newStat);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold mb-4">Neues Attribut erstellen</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={newStat.name}
              onChange={(e) => setNewStat(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="z.B. Stärke"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Beschreibung</label>
            <textarea
              value={newStat.description}
              onChange={(e) => setNewStat(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg resize-none h-20"
              placeholder="Beschreibe das Attribut..."
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <div className="grid grid-cols-4 gap-2">
              {availableIcons.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setNewStat(prev => ({ ...prev, icon: id }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    newStat.icon === id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                  title={label}
                >
                  <Icon className="w-6 h-6 mx-auto" />
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Farbe</label>
            <div className="grid grid-cols-6 gap-2">
              {Object.entries(colors).map(([key, color]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setNewStat(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-lg transition-transform ${
                    newStat.color === color
                      ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Value Configuration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Startwert</label>
              <div className="flex items-center gap-2">
                <label className="text-sm">
                  <input
                    type="checkbox"
                    checked={hasMaxValue}
                    onChange={(e) => {
                      setHasMaxValue(e.target.checked);
                      if (!e.target.checked) {
                        setNewStat(prev => ({ ...prev, maxValue: undefined }));
                      } else {
                        setNewStat(prev => ({ ...prev, maxValue: 100 }));
                      }
                    }}
                    className="mr-2"
                  />
                  Maximum festlegen
                </label>
              </div>
            </div>
            <div className="flex gap-4">
              <input
                type="number"
                value={newStat.value}
                onChange={(e) => setNewStat(prev => ({ 
                  ...prev, 
                  value: Math.min(
                    Number(e.target.value), 
                    hasMaxValue ? (newStat.maxValue || 100) : Infinity
                  )
                }))}
                className="w-full px-3 py-2 border rounded-lg"
                min="0"
                max={hasMaxValue ? newStat.maxValue : undefined}
              />
              {hasMaxValue && (
                <input
                  type="number"
                  value={newStat.maxValue}
                  onChange={(e) => setNewStat(prev => ({ 
                    ...prev, 
                    maxValue: Number(e.target.value),
                    value: Math.min(prev.value, Number(e.target.value))
                  }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="0"
                  placeholder="Maximum"
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              disabled={!newStat.name}
            >
              Attribut erstellen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StatsTabContent: React.FC = () => {
  const [stats, setStats] = usePersistentState<CharacterStat[]>('character-stats', []);
  const [isAddingStats, setIsAddingStats] = useState(false);

  const handleAddStat = () => {
    setIsAddingStats(true);
  };

  const handleStatDelete = (statId: string) => {
    setStats(stats.filter(stat => stat.id !== statId));
  };

  const handleStatUpdate = (statId: string, updates: Partial<CharacterStat>) => {
    setStats(stats.map(stat => 
      stat.id === statId ? { ...stat, ...updates } : stat
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header mit Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Charakter Attribute</h3>
        <button
          onClick={handleAddStat}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg 
                   hover:bg-indigo-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Attribut hinzufügen
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(stat => (
          <StatCard
            key={stat.id}
            stat={stat}
            onDelete={() => handleStatDelete(stat.id)}
            onUpdate={(updates) => handleStatUpdate(stat.id, updates)}
          />
        ))}
      </div>

      {/* Add Stat Modal */}
      {isAddingStats && (
        <AddStatModal
          onClose={() => setIsAddingStats(false)}
          onAdd={(newStat) => {
            setStats([...stats, { ...newStat, id: crypto.randomUUID() }]);
            setIsAddingStats(false);
          }}
          availableIcons={AVAILABLE_ICONS}
          colors={STAT_COLORS}
        />
      )}
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = ({ stat, onDelete, onUpdate }) => {
  const Icon = AVAILABLE_ICONS.find(i => i.id === stat.icon)?.icon || Swords;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 
                  hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium">{stat.name}</h4>
            {stat.description && (
              <p className="text-sm text-gray-500">{stat.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-red-500 
                   rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Wert</span>
          {stat.maxValue !== undefined && (
            <span>{stat.value} / {stat.maxValue}</span>
          )}
        </div>
        <input
          type="range"
          value={stat.value}
          max={stat.maxValue || 100}
          onChange={(e) => onUpdate({ value: Number(e.target.value) })}
          className="w-full"
          style={{ accentColor: stat.color }}
        />
      </div>
    </div>
  );
};

// Main Component
function CharacterStatusWidget() {
  // Fügen Sie diesen State zu den bestehenden States hinzu
  const [activeTab, setActiveTab] = usePersistentState<TabType>('activeStatusTab', 'status');

  const [status, setStatus] = usePersistentState<CharacterStatus>(
    "characterStatus",
    INITIAL_STATUS
  );

  const [config, setConfig] = usePersistentState<CharacterConfig>(
    "characterConfig",
    INITIAL_CONFIG
  );

  const [events, setEvents] = usePersistentState<CombatEvent[]>(
    "combatEvents",
    []
  );


  const [damageInput, setDamageInput] = usePersistentState<string>(
    "damageInput",
    ""
  );

  const [directDamageInput, setDirectDamageInput] = usePersistentState<string>(
    "directDamageInput",
    ""
  );

  const [healInput, setHealInput] = usePersistentState<string>("healInput", "");

  const [characterImage, setCharacterImage] = usePersistentState<string | null>(
    "characterImage",
    null
  );

  const calculateDamageWithReduction = useGearStore(
    (state) => state.calculateDamageWithReduction
  );

  const items = useGearStore((state) => state.items);
  const calculateTotalStats = useGearStore(
    (state) => state.calculateTotalStats
  );
  const totalStats = useMemo(
    () => calculateTotalStats(),
    [calculateTotalStats, items]
  );

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Berechnete Werte
  const calculateLevel = (exp: number) => Math.floor(exp / 25) + 1;
  const calculateExpProgress = (exp: number) => exp % 25;
  const level = calculateLevel(config.defaults.currentExp);
  const expProgress = calculateExpProgress(config.defaults.currentExp);

  //Debuglogg für die Console, Prüfung der Werte u. Initialisierung desser.
  useEffect(() => {
    const totalStats = calculateTotalStats();
    console.log("Gear Total Stats:", totalStats);
    console.log("Current Status:", status);
    console.log("Config Defaults:", config.defaults);
  }, [calculateTotalStats]);

  // Effects
  useEffect(() => {
    localStorage.setItem("characterStatus", JSON.stringify(status));
  }, [status]);

  useEffect(() => {
    localStorage.setItem("characterStatusConfig", JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    console.log("Items or stats changed, updating character status");

    setStatus((prev) => {
      // Berechne neue Maximalwerte
      const newMaxHealth =
        config.defaults.maxHealth + totalStats.totalHealthBonus;
      const newMaxArmor = config.defaults.maxArmor + totalStats.totalArmorBonus;

      // Für Lebenspunkte:
      // 1. Behalte aktuelle LP bei, wenn sie unter dem neuen Maximum liegen
      // 2. Reduziere auf das neue Maximum, falls aktuelle LP darüber liegen
      const newCurrentHealth = Math.min(prev.currentHealth, newMaxHealth);

      // Für Rüstung:
      // Behalte 0 wenn vorher 0, sonst berechne proportional
      const newCurrentArmor =
        prev.currentArmor === 0 && prev.maxArmor === 0
          ? 0
          : Math.min(prev.currentArmor, newMaxArmor);

      console.log("Status Update:", {
        prevStatus: prev,
        newMaxHealth,
        newCurrentHealth,
        newMaxArmor,
        newCurrentArmor,
      });

      return {
        ...prev,
        maxHealth: newMaxHealth,
        maxArmor: newMaxArmor,
        currentHealth: newCurrentHealth,
        currentArmor: newCurrentArmor,
      };
    });
  }, [totalStats, config.defaults.maxHealth, config.defaults.maxArmor, items]);

  const [dominantColors, setDominantColors] = useState<{
    primary: string;
    secondary: string;
    ambient: string;
  }>({
    primary: "rgba(124, 58, 237, 0.15)",
    secondary: "rgba(59, 130, 246, 0.2)",
    ambient: "rgba(109, 40, 217, 0.1)",
  });

  // Funktion zur Extraktion der dominanten Farben
  const extractDominantColors = (imageUrl: string) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    return new Promise<void>((resolve) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        // Reduzierte Canvas-Größe für bessere Performance
        canvas.width = 50;
        canvas.height = 50;
        ctx?.drawImage(img, 0, 0, 50, 50);

        if (!ctx) return;

        // Sampling nur vom Bildrand für den Glow-Effekt
        const edgePixels: number[][] = [];

        // Oberer und unterer Rand
        for (let x = 0; x < 50; x++) {
          const topData = ctx.getImageData(x, 0, 1, 1).data;
          const bottomData = ctx.getImageData(x, 49, 1, 1).data;
          edgePixels.push([topData[0], topData[1], topData[2]]);
          edgePixels.push([bottomData[0], bottomData[1], bottomData[2]]);
        }

        // Linker und rechter Rand
        for (let y = 0; y < 50; y++) {
          const leftData = ctx.getImageData(0, y, 1, 1).data;
          const rightData = ctx.getImageData(49, y, 1, 1).data;
          edgePixels.push([leftData[0], leftData[1], leftData[2]]);
          edgePixels.push([rightData[0], rightData[1], rightData[2]]);
        }

        // Durchschnittliche Randfarbe berechnen
        const avgColor = edgePixels
          .reduce(
            (acc, [r, g, b]) => [acc[0] + r, acc[1] + g, acc[2] + b],
            [0, 0, 0]
          )
          .map((v) => Math.round(v / edgePixels.length));

        setDominantColors({
          primary: `rgba(${avgColor[0]}, ${avgColor[1]}, ${avgColor[2]}, 0.3)`,
          secondary: `rgba(${avgColor[0]}, ${avgColor[1]}, ${avgColor[2]}, 0.2)`,
          ambient: `rgba(${avgColor[0]}, ${avgColor[1]}, ${avgColor[2]}, 0.1)`,
        });

        resolve();
      };
      img.src = imageUrl;
    });
  };

  // Aktualisierte handlePortraitUpload Funktion
  const handlePortraitUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageUrl = reader.result as string;
      setCharacterImage(imageUrl);
      await extractDominantColors(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  // Portrait-Render-Komponente
  const renderPortrait = () => (
    <div className="relative w-full h-full">
      <AnimatedPortrait
        image={characterImage}
        onUpload={handlePortraitUpload}
        glowColor={dominantColors.primary}
      />

      {/* Effect Status Overlay */}
      {config.effectStatus?.enabled && (
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            <EffectStatusWidget />
            <div className="absolute inset-10 pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );

  const handleDamage = useCallback(() => {
    const damage = parseInt(damageInput);
    if (!isNaN(damage) && damage > 0) {
      // Berechne reduzierten Schaden
      const { finalDamage, reduction } = calculateDamageWithReduction(damage, false);
      let remainingDamage = finalDamage;
      let newArmor = status.currentArmor;
      let newHealth = status.currentHealth;
      const newEvents: CombatEvent[] = [];

      // Wenn Reduktion vorhanden, Event erstellen
      if (reduction.total > 0) {
        newEvents.push({
          id: generateEventId(),
          type: "block",
          value: damage - finalDamage,
          timestamp: Date.now(),
          reduction: {
            amount: reduction.total,
            sources: reduction.sources
          }
        });
      }

      // Rüstungsberechnung
      if (newArmor > 0) {
        const blockedDamage = Math.min(remainingDamage, newArmor);
        if (blockedDamage > 0) {
          newArmor -= blockedDamage;
          remainingDamage -= blockedDamage;
          newEvents.push({
            id: generateEventId(),
            type: "block" as const,
            value: blockedDamage,
            timestamp: Date.now(),
          });
        }
      }

      // Verbleibender Schaden an Lebenspunkten
      if (remainingDamage > 0) {
        newHealth = Math.max(0, newHealth - remainingDamage);
        newEvents.push({
          id: generateEventId(),
          type: "damage" as const,
          value: remainingDamage,
          timestamp: Date.now(),
        });
      }

      // Status Update
      setStatus((prev) => ({
        ...prev,
        currentArmor: newArmor,
        currentHealth: newHealth,
      }));

      // Events Update
      if (newEvents.length > 0) {
        setEvents((prev) => [...newEvents, ...prev].slice(0, 5));
      }

      // Reset Input
      setDamageInput("");
    }
  }, [damageInput, status, setStatus, setEvents, calculateDamageWithReduction]);

  // Handler für direkten Schaden
  const handleDirectDamage = useCallback(() => {
    const directDamage = parseInt(directDamageInput);
    if (!isNaN(directDamage) && directDamage > 0) {
      // Direkter Schaden ohne Reduktion
      const { finalDamage } = calculateDamageWithReduction(directDamage, true);

      // Reduziere Lebenspunkte direkt
      const newHealth = Math.max(0, status.currentHealth - finalDamage);

      // Status Update
      setStatus((prev) => ({
        ...prev,
        currentHealth: newHealth,
      }));

      // Event erstellen
      const newEvent = {
        id: generateEventId(),
        type: "directDamage" as const,
        value: finalDamage,
        timestamp: Date.now(),
      };

      // Events Update
      setEvents((prev) => [newEvent, ...prev].slice(0, 5));

      // Reset Input
      setDirectDamageInput("");
    }
  }, [
    directDamageInput,
    status,
    setStatus,
    setEvents,
    calculateDamageWithReduction,
  ]);

  // Handler für Heilung
  const handleHeal = useCallback(() => {
    const heal = parseInt(healInput);
    if (!isNaN(heal) && heal > 0) {
      // Berechne tatsächliche Heilung (nicht über Maximum)
      const actualHeal = Math.min(
        heal,
        status.maxHealth - status.currentHealth
      );

      if (actualHeal > 0) {
        // Status Update
        setStatus((prev) => ({
          ...prev,
          currentHealth: prev.currentHealth + actualHeal,
        }));

        // Event erstellen
        const newEvent = {
          id: generateEventId(),
          type: "heal",
          value: actualHeal,
          timestamp: Date.now(),
        };

        // Events Update
        setEvents((prev) => [newEvent, ...prev].slice(0, 5));
      }

      // Reset Input
      setHealInput("");
    }
  }, [healInput, status, setStatus, setEvents]);

  const handleArmorRecharge = useCallback(() => {
    const rechargeAmount = status.maxArmor - status.currentArmor;

    if (rechargeAmount > 0) {
      // Update status with persistent state
      setStatus((prev) => ({
        ...prev,
        currentArmor: prev.maxArmor,
      }));

      // Add recharge event with persistent state
      setEvents((prev) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          type: "recharge",
          value: rechargeAmount,
          timestamp: Date.now(),
        },
        ...prev.slice(0, 4), // Keep only last 5 events including the new one
      ]);
    }
  }, [status.maxArmor, status.currentArmor, setStatus, setEvents]);

  // Optional: Hook zum Speichern der Events im localStorage
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("combat-events", JSON.stringify(events));
    }
  }, [events]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("characterStatus", JSON.stringify(status));
  }, [status]);

  const handleConfigSave = (newConfig: CharacterConfig) => {
    setConfig({
      ...config,
      ...newConfig,
    });
    setIsConfigOpen(false);

    // Optional: Aktualisiere auch die Status-Werte basierend auf den neuen Defaults
    setStatus((prev) => ({
      ...prev,
      maxHealth: newConfig.defaults.maxHealth,
      maxArmor: newConfig.defaults.maxArmor,
      // Stelle sicher, dass aktuelle Werte nicht größer als neue Maximalwerte sind
      currentHealth: Math.min(prev.currentHealth, newConfig.defaults.maxHealth),
      currentArmor: Math.min(prev.currentArmor, newConfig.defaults.maxArmor),
    }));
  };

  const [isDead, setIsDead] = useState(false);

  // Fügen Sie einen Effect hinzu, der den Death-Status überwacht
  useEffect(() => {
    if (status.currentHealth <= 0 && !isDead) {
      setIsDead(true);
    }
  }, [status.currentHealth]);

  // Wiederbelebungs-Handler
  const handleRevive = () => {
    // Setze 10% der maximalen Gesundheit und Rüstung
    setStatus((prev) => ({
      ...prev,
      currentHealth: Math.ceil(prev.maxHealth * 0.1),
    }));
    setIsDead(false);
  };

  // Handler und Effects vom originalen Widget beibehalten
  useEffect(() => {
    localStorage.setItem("characterStatus", JSON.stringify(status));
  }, [status]);

  useEffect(() => {
    localStorage.setItem("characterStatusConfig", JSON.stringify(config));
  }, [config]);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 lg:p-6 rounded-xl">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">Status</h2>
          <div className="flex flex-wrap items-center gap-2 text-gray-500 mt-1"></div>
        </div>
        <button
          onClick={() => setIsConfigOpen(true)}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span>Status</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4" />
            <span>Attribute</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-6">
          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Portrait Section */}
            <div className="md:col-span-1 lg:col-span-2">
              <div className="w-32 h-32 mx-auto md:w-auto md:h-80">
                {renderPortrait()}
              </div>
            </div>

            {/* Status Section */}
            <div className="md:col-span-1 lg:col-span-3 space-y-6">
              {/* Level & Experience */}
              <div className="bg-white/50 p-4 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg text-white font-bold text-xl">
                      {level}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Level</div>
                      <div className="text-xs text-gray-400">
                        {config.defaults.currentExp} EXP
                      </div>
                    </div>
                  </div>
                  <Trophy className="w-6 h-6 text-yellow-400" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Nächstes Level</span>
                    <span>{expProgress}/25 EXP</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
                      style={{ width: `${(expProgress / 25) * 100}%` }}
                    >
                      <div className="w-full h-full animate-pulse bg-white/20" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Bars */}
              <div className="space-y-4">
                <EtherealHealthBar
                  currentHealth={status.currentHealth}
                  maxHealth={status.maxHealth}
                  showEffects={true}
                  className="mb-4"
                />

                <EtherealArmorBar
                  currentArmor={status.currentArmor}
                  maxArmor={status.maxArmor}
                  showEffects={true}
                  onRecharge={handleArmorRecharge}
                  className="bg-white/50 rounded-xl shadow-sm"
                />
              </div>

              {/* Action Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <DamageInput
                  value={damageInput}
                  onChange={setDamageInput}
                  onSubmit={handleDamage}
                  placeholder="Schaden"
                  icon={<Shield className="w-4 h-4" />}
                  iconColor="bg-rose-100 text-rose-600 hover:bg-rose-200"
                />

                <DamageInput
                  value={directDamageInput}
                  onChange={setDirectDamageInput}
                  onSubmit={handleDirectDamage}
                  placeholder="Direkter Schaden"
                  icon={<Zap className="w-4 h-4" />}
                  iconColor="bg-purple-100 text-purple-600 hover:bg-purple-200"
                />

                <DamageInput
                  value={healInput}
                  onChange={setHealInput}
                  onSubmit={handleHeal}
                  placeholder="Heilung"
                  icon={<Heart className="w-4 h-4" />}
                  iconColor="bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                />
              </div>
            </div>

            {/* Combat Log */}
            <div className="col-span-full">
              <CombatLog events={events} maxEvents={5} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats">
        <StatsTabContent />
        </TabsContent>
      </Tabs>

      {/* Config Panel */}
      {isConfigOpen && (
        <ConfigPanel
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
          config={config}
          onSave={handleConfigSave}
        />
      )}
      
      {/* Death Screen */}
      <DeathScreen isVisible={isDead} onRevive={handleRevive} />
    </div>
  );
}

export default CharacterStatusWidget;
