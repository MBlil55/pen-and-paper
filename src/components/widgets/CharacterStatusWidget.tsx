import React, { useState, useEffect, useCallback, useRef } from "react";
import { type CharacterConfig } from "./ConfigPanel";
import ConfigPanel from "./ConfigPanel";
import {
  Shield,
  Heart,
  Settings,
  Camera,
  Trophy,
  Users,
  Swords,
  BookOpen,
  RefreshCw,
  Trash2
} from "lucide-react";
import { usePersistentState } from './usePersistentState';

const POINTS_PER_LEVEL = 25;

const INITIAL_STATUS: CharacterStatus = {
    currentHealth: 100,
    maxHealth: 100,
    currentArmor: 50,
    maxArmor: 50,
    portrait: null,
    effects: ["Gesegnet", "Erschöpft"]
  };
  
  const INITIAL_CONFIG: CharacterConfig = {
    theme: {
      primary: "#6366f1",
      secondary: "#4f46e5",
      healthBar: {
        high: "#22c55e",
        medium: "#eab308",
        low: "#ef4444"
      },
      armorBar: "#3b82f6"
    },
    defaults: {
      maxHealth: 100,
      maxArmor: 50,
      currentExp: 0
    },
    display: {
      showPortrait: true,
      showEffects: true,
      showCombatLog: true,
      compactMode: false
    },
    character: {
      race: "Mensch",
      class: "Magier",
      path: "Wanderer"
    }
  };

interface Config {
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
  };
}

interface LevelSystemProps {
  currentExp: number;
  onExpChange: (exp: number) => void;
}

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
  type: "damage" | "heal" | "block" | "recharge";
  value: number;
  timestamp: number;
}

interface StatusEvent {
  id: string;
  type: "damage" | "heal" | "block" | "recharge";
  value: number;
  timestamp: number;
}

const LevelSystem: React.FC<LevelSystemProps> = ({
  currentExp,
  onExpChange,
}) => {
  const calculateLevel = (exp: number) =>
    Math.floor(exp / POINTS_PER_LEVEL) + 1;
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

const CombatLog: React.FC<{ events: CombatEvent[]; maxEvents?: number }> = ({
    events,
    maxEvents = 5
  }) => {
    if (events.length === 0) return null;
  
    const getEventIcon = (type: CombatEvent["type"]) => {
      switch (type) {
        case "damage":
          return <Swords className="w-4 h-4" />;
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
          <h3 className="font-medium text-gray-700">Kampflog</h3>
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
                      <span className={`font-medium ${getValueColor(event.type)}`}>
                        {event.type === "damage" && "-"}
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
                </div>
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

// Main Component
function CharacterStatusWidget() {
    const [status, setStatus] = usePersistentState<CharacterStatus>(
        'characterStatus',
        INITIAL_STATUS
      );
      
      const [config, setConfig] = usePersistentState<CharacterConfig>(
        'characterConfig',
        INITIAL_CONFIG
      );
      
      const [events, setEvents] = usePersistentState<CombatEvent[]>(
        'combatEvents',
        []
      );
      
      const [damageInput, setDamageInput] = usePersistentState<string>(
        'damageInput',
        ''
      );
      
      const [healInput, setHealInput] = usePersistentState<string>(
        'healInput',
        ''
      );
      
      const [characterImage, setCharacterImage] = usePersistentState<string | null>(
        'characterImage',
        null
      );
    
      const [isConfigOpen, setIsConfigOpen] = useState(false);
      const fileInputRef = useRef<HTMLInputElement>(null);
    
      // Berechnete Werte
      const calculateLevel = (exp: number) => Math.floor(exp / 25) + 1;
      const calculateExpProgress = (exp: number) => exp % 25;
      const level = calculateLevel(config.defaults.currentExp);
      const expProgress = calculateExpProgress(config.defaults.currentExp);
    

  // Effects
  useEffect(() => {
    localStorage.setItem("characterStatus", JSON.stringify(status));
  }, [status]);

  useEffect(() => {
    localStorage.setItem("characterStatusConfig", JSON.stringify(config));
  }, [config]);

  // Handlers
  const handlePortraitUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setCharacterImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDamage = useCallback(() => {
    const damage = parseInt(damageInput);
    if (!isNaN(damage) && damage > 0) {
      // Temporäre Variablen für die Berechnung
      let remainingDamage = damage;
      let newArmor = status.currentArmor;
      let newHealth = status.currentHealth;
      const newEvents = [];

      // Berechne Rüstungsblock
      if (newArmor > 0) {
        const blockedDamage = Math.min(remainingDamage, newArmor);
        if (blockedDamage > 0) {
          newArmor -= blockedDamage;
          remainingDamage -= blockedDamage;
          newEvents.push({
            id: generateEventId(),
            type: "block",
            value: blockedDamage,
            timestamp: Date.now(),
          });
        }
      }

      // Berechne verbleibenden Schaden
      if (remainingDamage > 0) {
        newHealth = Math.max(0, newHealth - remainingDamage);
        newEvents.push({
          id: generateEventId(),
          type: "damage",
          value: remainingDamage,
          timestamp: Date.now(),
        });
      }

      // Aktualisiere Status und Events in separaten Aufrufen
      setStatus((prev) => ({
        ...prev,
        currentArmor: newArmor,
        currentHealth: newHealth,
      }));

      // Füge neue Events hinzu
      if (newEvents.length > 0) {
        setEvents((prev) => [...newEvents, ...prev].slice(0, 5));
      }

      setDamageInput("");
    }
  }, [damageInput, status.currentArmor, status.currentHealth]);

  const handleHeal = useCallback(() => {
    const heal = parseInt(healInput);
    if (!isNaN(heal) && heal > 0) {
      const actualHeal = Math.min(
        heal,
        status.maxHealth - status.currentHealth
      );

      if (actualHeal > 0) {
        // Aktualisiere Status
        setStatus((prev) => ({
          ...prev,
          currentHealth: prev.currentHealth + actualHeal,
        }));

        // Füge Heal-Event hinzu
        setEvents((prev) =>
          [
            {
              id: generateEventId(),
              type: "heal",
              value: actualHeal,
              timestamp: Date.now(),
            },
            ...prev,
          ].slice(0, 5)
        );
      }

      setHealInput("");
    }
  }, [healInput, status.currentHealth, status.maxHealth]);

  const handleArmorRecharge = useCallback(() => {
    const rechargeAmount = status.maxArmor - status.currentArmor;
    
    if (rechargeAmount > 0) {
      // Update status with persistent state
      setStatus(prev => ({
        ...prev,
        currentArmor: prev.maxArmor
      }));
  
      // Add recharge event with persistent state
      setEvents(prev => [
        {
          id: `${Date.now()}-${Math.random()}`,
          type: "recharge",
          value: rechargeAmount,
          timestamp: Date.now()
        },
        ...prev.slice(0, 4) // Keep only last 5 events including the new one
      ]);
    }
  }, [status.maxArmor, status.currentArmor, setStatus, setEvents]);

  // Optional: Hook zum Speichern der Events im localStorage
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("combat-events", JSON.stringify(events));
    }
  }, [events]);

  // 2. Responsiveness Check
  const [isWindowTooSmall, setIsWindowTooSmall] = useState(false);

  useEffect(() => {
    const checkWindowSize = () => {
      setIsWindowTooSmall(window.innerWidth < 768 || window.innerHeight < 600);
    };

    checkWindowSize();
    window.addEventListener("resize", checkWindowSize);
    return () => window.removeEventListener("resize", checkWindowSize);
  }, []);

  const getHealthColor = (percentage: number) => {
    if (percentage > 66) return config.theme.healthBar.high;
    if (percentage > 33) return config.theme.healthBar.medium;
    return config.theme.healthBar.low;
  };

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

  const addEvent = useCallback(
    (eventType: "damage" | "heal" | "block", value: number) => {
      const event = {
        id: `${Date.now()}-${Math.random()}`,
        type: eventType,
        value: Math.abs(Math.round(value)), // Sicherstellen, dass Werte positiv und gerundet sind
        timestamp: Date.now(),
      };

      setEvents((prev) => [event, ...prev].slice(0, 5));
    },
    []
  );

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
          <div className="flex flex-wrap items-center gap-2 text-gray-500 mt-1">
          </div>
        </div>
        <button
          onClick={() => setIsConfigOpen(true)}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Portrait Section */}
        <div className="md:col-span-1 lg:col-span-2">
          <div
            className="relative w-32 h-32 mx-auto md:w-auto md:h-80 rounded-xl overflow-hidden 
                            border-2 border-indigo-100 group bg-white"
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) =>
                e.target.files?.[0] && handlePortraitUpload(e.target.files[0])
              }
              className="hidden"
              accept="image/*"
            />
            {characterImage ? (
              <img
                src={characterImage}
                alt="Character Portrait"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Camera className="w-8 h-8 text-indigo-200" />
                <span className="text-xs text-indigo-300 mt-2">Portrait</span>
              </div>
            )}
            <div
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                              flex items-center justify-center transition-opacity"
            >
              <Camera
                className="w-6 h-6 text-white cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              />
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="md:col-span-1 lg:col-span-3 space-y-6">
          {/* Level & Experience */}
          <div className="bg-white/50 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl
                                  bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg
                                  text-white font-bold text-xl"
                >
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
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500
                                transition-all duration-300"
                  style={{ width: `${expProgress}%` }}
                >
                  <div className="w-full h-full animate-pulse bg-white/20" />
                </div>
              </div>
            </div>
          </div>

          {/* Status Bars */}
          <div className="space-y-4">
            {/* Health Bar */}
            <div className="p-4 bg-white/50 rounded-xl shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-rose-600">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Lebenspunkte</span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {status.currentHealth}/{status.maxHealth}
                </span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-rose-400
                                transition-all duration-300 relative"
                  style={{
                    width: `${
                      (status.currentHealth / status.maxHealth) * 100
                    }%`,
                  }}
                >
                  <div
                    className="absolute inset-0 bg-[length:20px_20px]
                                  bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,
                                  transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,
                                  transparent_75%,transparent)] animate-[move-stripes_1s_linear_infinite]"
                  />
                </div>
              </div>
            </div>

            {/* Armor Bar */}
            <div className="p-4 bg-white/50 rounded-xl shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sky-600">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Rüstung</span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {status.currentArmor}/{status.maxArmor}
                </span>
                <button
        onClick={handleArmorRecharge}
        className={`p-1.5 rounded-lg transition-colors duration-200 
          ${status.currentArmor < status.maxArmor 
            ? 'bg-sky-100 text-sky-600 hover:bg-sky-200 cursor-pointer' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        disabled={status.currentArmor >= status.maxArmor}
        title={status.currentArmor < status.maxArmor ? "Rüstung wiederherstellen" : "Rüstung ist bereits voll"}
      >
        <RefreshCw className="w-4 h-4" />
      </button>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-sky-400
                                transition-all duration-300 relative"
                  style={{
                    width: `${(status.currentArmor / status.maxArmor) * 100}%`,
                  }}
                >
                  <div
                    className="absolute inset-0 bg-[length:20px_20px]
                                  bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,
                                  transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,
                                  transparent_75%,transparent)] animate-[move-stripes_1s_linear_infinite]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Damage Input */}
            <div className="relative">
              <input
                type="number"
                value={damageInput}
                onChange={(e) => setDamageInput(e.target.value)}
                placeholder="Schaden"
                className="w-full pl-3 pr-10 py-2 bg-white border border-gray-200 
                             rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
              <button
                onClick={handleDamage}
                className="absolute right-2 top-1/2 -translate-y-1/2
                                   p-1 rounded bg-rose-100 text-rose-600 hover:bg-rose-200"
              >
                <Shield className="w-4 h-4" />
              </button>
            </div>

            {/* Heal Input */}
            <div className="relative">
              <input
                type="number"
                value={healInput}
                onChange={(e) => setHealInput(e.target.value)}
                placeholder="Heilung"
                className="w-full pl-3 pr-10 py-2 bg-white border border-gray-200 
                             rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                onClick={handleHeal}
                className="absolute right-2 top-1/2 -translate-y-1/2
                                   p-1 rounded bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        {/* Kampflog */}
        <div className="col-span-full">
        <CombatLog events={events} maxEvents={5} />
        </div>
      </div>

      {/* Config Panel */}
      {isConfigOpen && (
        <ConfigPanel
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
          config={config}
          onSave={handleConfigSave}
        />
      )}
    </div>
  );
}

export default CharacterStatusWidget;
