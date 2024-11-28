import React from "react";
import {
  Sparkles,
  Skull,
  Swords,
  Crown,
  Shield,
  HeartPulse,
  Clock,
} from "lucide-react";
import { Effect, EffectPosition, EffectCategory } from "./types/effectTypes";
import useEffectStore from "./hooks/useEffectStore";

interface StatusIconProps {
  icon: React.ElementType;
  effects: Effect[];
  position: string;
  color?: string;
  title: string;
  category: EffectCategory;
  showTooltip?: boolean;
  showCounter?: boolean;
}

// Tooltip Komponente
const EffectTooltip: React.FC<{
  effects: Effect[];
  position: "top" | "right" | "bottom" | "left";
  title: string;
}> = ({ effects, position, title }) => {
  const positionClasses = {
    top: "-translate-y-full -top-2",
    right: "left-full ml-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "--:--";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`fixed z-[9999] min-w-[260px] bg-slate-800/95 backdrop-blur-sm 
      rounded-lg shadow-xl border border-slate-600/50 text-white p-3
      animate-in slide-in-from-right-5 duration-200`}
      style={{
        top: window.event ? (window.event as MouseEvent).clientY : 0,
        left: window.event ? (window.event as MouseEvent).clientX + 20 : 0,
        zIndex: 9999, 
      }}
    >
<div className="font-medium mb-2">{title}</div>
      <div className="space-y-2">
        {effects.map(effect => (
          <div key={effect.id} 
               className="border-t border-slate-600/50 pt-2 first:border-0 first:pt-0">
            <div className="flex justify-between items-start">
              <span className="font-medium">{effect.name}</span>
              {effect.value && (
                <span className={effect.value > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {effect.value > 0 ? '+' : ''}{effect.value}%
                </span>
              )}
            </div>
            <p className="text-sm text-slate-300 mt-0.5">{effect.description}</p>
            {effect.duration && (
              <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                <Clock className="w-3 h-3" />
                {formatDuration(effect.duration)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Hauptkomponente
const EffectStatusWidget: React.FC = () => {
  const getEffectsByCategory = useEffectStore(
    (state) => state.getEffectsByCategory
  );

  const getActiveEffectsByCategory = (category: EffectCategory): Effect[] => {
    return getEffectsByCategory(category).filter(effect => effect.isActive);
  };


  return (
    <div className="relative w-full h-full">
      {/* Status Icons - nur anzeigen wenn Effekte vorhanden oder aktiv */}
      {getActiveEffectsByCategory("buffs").length > 0 && (
        <StatusIcon
          icon={Sparkles}
          effects={getActiveEffectsByCategory("buffs")}
          position="-top-3 left-1/2 -translate-x-1/2"
          title="Aktive Buffs"
          category="buffs"
        />
      )}

      {getActiveEffectsByCategory("debuffs").length > 0 && (
        <StatusIcon
          icon={Skull}
          effects={getActiveEffectsByCategory("debuffs")}
          position="top-1/3 -right-3"
          title="Negative Effekte"
          category="debuffs"
        />
      )}

      {getActiveEffectsByCategory("combat").length > 0 && (
        <StatusIcon
          icon={Swords}
          effects={getActiveEffectsByCategory("combat")}
          position="bottom-1/3 -right-3"
          title="Kampfeffekte"
          category="combat"
        />
      )}

      {getActiveEffectsByCategory("special").length > 0 && (
        <StatusIcon
          icon={Crown}
          effects={getActiveEffectsByCategory("special")}
          position="top-1/3 -left-3"
          title="Spezialeffekte"
          category="special"
        />
      )}

      {getActiveEffectsByCategory("defense").length > 0 && (
        <StatusIcon
          icon={Shield}
          effects={getActiveEffectsByCategory("defense")}
          position="bottom-1/3 -left-3"
          title="Verteidigungseffekte"
          category="defense"
        />
      )}

      {getActiveEffectsByCategory("health").length > 0 && (
        <StatusIcon
          icon={HeartPulse}
          effects={getActiveEffectsByCategory("health")}
          position="-bottom-3 left-1/2 -translate-x-1/2"
          title="Gesundheitseffekte"
          category="health"
        />
      )}
    </div>
  );
};

// Hilfsfunktion für Farbberechnung
const calculateAggregateColor = (effects: Effect[]): string => {
  if (!effects.length) return "rgba(156, 163, 175, 0.9)"; // Fallback Farbe

  // Wenn es nur einen Effekt gibt, verwende dessen Farbe
  if (effects.length === 1) return effects[0].color;

  // Bei mehreren Effekten, nehme die dominanteste Farbe
  // Sortiere nach Erstellungsdatum, neuester zuerst
  const sortedEffects = [...effects].sort(
    (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
  );

  return sortedEffects[0].color;
};

// Anpassung der StatusIcon Komponente für bessere Hover-Effekte
const StatusIcon: React.FC<StatusIconProps> = ({
  icon: Icon,
  effects,
  position,
  title,
  showTooltip = true,
  showCounter = true,
}) => {
  const [showEffects, setShowEffects] = React.useState(false);

  if (effects.length === 0) return null;

  // Berechne die Farbe basierend auf den Effekten
  const effectColor = calculateAggregateColor(effects);

  // Erstelle einen helleren Farbton für den Glow-Effekt
  const glowColor = effectColor.replace(")", ", 0.3)").replace("rgb", "rgba");

  return (
    <div className={`absolute ${position} z-20`}>
      <button
        className="group relative cursor-pointer"
        onMouseEnter={() => setShowEffects(true)}
        onMouseLeave={() => setShowEffects(false)}
      >
        {/* Glow Effect mit dynamischer Farbe */}
        <div
          className="absolute inset-0 blur-lg transform effect-icon-glow 
                       group-hover:scale-150 transition-all duration-300"
          style={{
            backgroundColor: glowColor,
            opacity: 0.3,
          }}
        />

        {/* Icon Container mit dynamischer Farbe */}
        <div
          className={`relative w-12 h-12 rounded-lg flex items-center justify-center
                      effect-icon transition-all duration-300 group-hover:scale-110 
                      backdrop-blur-sm border border-white/20 shadow-lg
                      ${effects.length > 0 ? "effect-icon active" : ""}`}
          style={{ backgroundColor: effectColor }}
        >
          <Icon className="w-6 h-6 text-white effect-icon-inner" />

          {showCounter && effects.length > 0 && (
            <div
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full 
                         text-white text-xs flex items-center justify-center 
                         shadow-lg border border-white/20 backdrop-blur-sm"
              style={{ backgroundColor: effectColor }}
            >
              {effects.length}
            </div>
          )}
        </div>

        {/* Tooltip */}
        {showTooltip && showEffects && (
          <EffectTooltip effects={effects} position="right" title={title} />
        )}
      </button>
    </div>
  );
};

export default EffectStatusWidget;
