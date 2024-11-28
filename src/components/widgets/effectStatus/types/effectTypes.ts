export type EffectCategory = 'buffs' | 'debuffs' | 'combat' | 'special' | 'defense' | 'health';

export type EffectPosition = 'top' | 'right' | 'bottom' | 'left';

export interface Effect {
  id: string;
  name: string;
  description: string;
  category: EffectCategory;
  icon: string;
  color: string;
  duration?: number;  // in Sekunden
  value?: number;     // Numerischer Wert des Effekts (z.B. +10%)
  isActive: boolean;
  position?: EffectPosition;
  createdAt: number;  // Timestamp
  updatedAt: number;  // Timestamp
}

export interface EffectTemplate {
  id: string;
  name: string;
  description: string;
  category: EffectCategory;
  icon: string;
  color: string;
  isCustom: boolean;  // Unterscheidung zwischen vordefinierten und benutzerdefinierten Templates
}

export interface EffectDisplayConfig {
  showIcons: boolean;
  showCounters: boolean;
  showTooltips: boolean;
  positions: Record<EffectPosition, boolean>;
  categories: Record<EffectCategory, boolean>;
}

// Event Types für Effect Management
export type EffectEvent = 
  | { type: 'CREATE_EFFECT'; effect: Effect }
  | { type: 'UPDATE_EFFECT'; effect: Effect }
  | { type: 'DELETE_EFFECT'; effectId: string }
  | { type: 'TOGGLE_EFFECT'; effectId: string }
  | { type: 'BULK_TOGGLE'; effectIds: string[]; active: boolean };