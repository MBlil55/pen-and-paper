// src/config/appConfig.ts

export const APP_VERSION = '1.0.0';

export const STORAGE_KEYS = {
  WIDGETS: 'widgets',
  LAYOUT: 'layout',
  SETTINGS: 'settings',
  CHARACTER_INFO: 'characterInfo',
  CHARACTER_STATUS: 'characterStatus',
  SKILL_TREES: 'skillTrees',
  NOTES: 'notes',
  DICE_HISTORY: 'diceHistory'
} as const;

export const DEFAULT_SETTINGS = {
  theme: {
    primary: '#6366f1',
    secondary: '#4f46e5',
    background: '#ffffff'
  },
  display: {
    showPortrait: true,
    showEffects: true,
    showCombatLog: true,
    compactMode: false
  }
} as const;

// Für Type-Sicherheit
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
export type AppSettings = typeof DEFAULT_SETTINGS;

// Helper Functions
export const getStorageItem = <T>(key: StorageKey, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const setStorageItem = <T>(key: StorageKey, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.clear();
    // Optional: Behalte bestimmte Einstellungen
    setStorageItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};