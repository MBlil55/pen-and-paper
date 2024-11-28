// src/services/DataManagementService.ts

// Definieren wir zuerst die spezifischen Typen für unsere Datenstruktur
interface SkillTree {
  id: string;
  title: string;
  skills: Array<{
    id: string;
    name: string;
    value: number;
    bonus: number;
    finalValue: number;
  }>;
  treeBonus: number;
  manualBonus: number;
}

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  lastModified: string;
}

interface CharacterStatus {
  currentHealth: number;
  maxHealth: number;
  currentArmor: number;
  maxArmor: number;
  portrait: string | null;
  effects: string[];
}

interface CharacterInfo {
  basicInfo: {
    name: string;
    gender: string;
    age: string;
    stature: string;
    religion: string;
    profession: string;
    familyStatus: string;
  };
  portrait: string | null;
}

interface LayoutWidget {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: string;
  config?: Record<string, any>;
}

interface ExportData {
  metadata: {
    version: string;
    exportDate: string;
    exportId: string;
    applicationVersion: string;
    checksum: string;
  };
  data: {
    widgets: {
      characterInfo: CharacterInfo | null;
      characterStatus: CharacterStatus | null;
      skillTrees: Record<string, SkillTree> | null;
      notes: {
        items: Note[];
        categories: Array<{
          id: string;
          name: string;
          color: string;
        }>;
      } | null;
      dice: {
        history: Array<{
          id: string;
          type: string;
          result: number;
          timestamp: string;
        }>;
      } | null;
    };
    settings: {
      theme?: {
        primary: string;
        secondary: string;
        background: string;
      };
      display?: {
        showPortrait: boolean;
        showEffects: boolean;
        showCombatLog: boolean;
        compactMode: boolean;
      };
    };
    layout: {
      widgets: LayoutWidget[];
    };
  };
}

class DataManagementService {
  private static instance: DataManagementService;

  private readonly STORAGE_KEYS = {
    CHARACTER_INFO: "characterInfo",
    CHARACTER_STATUS: "characterStatus",
    SKILL_TREES_PREFIX: "skillTree-",
    NOTES: "notes",
    NOTES_CATEGORIES: "character-notes",
    DICE_HISTORY: "diceHistory",
    SETTINGS: "settings",
    LAYOUT: "layout",
  };

  private constructor() {}

  public static getInstance(): DataManagementService {
    if (!DataManagementService.instance) {
      DataManagementService.instance = new DataManagementService();
    }
    return DataManagementService.instance;
  }

  /**
   * Sicheres Lesen von Daten aus dem localStorage
   * @param key Der Storage-Key
   * @param defaultValue Der Standardwert, falls keine Daten gefunden wurden
   * @returns Die gelesenen Daten oder den Standardwert
   */
  private safeGetItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;

      const parsedItem = JSON.parse(item);
      return parsedItem as T;
    } catch (error) {
      console.warn(`Fehler beim Lesen von ${key} aus localStorage:`, error);
      return defaultValue;
    }
  }

  /**
   * Sicheres Speichern von Daten im localStorage
   * @param key Der Storage-Key
   * @param value Die zu speichernden Daten
   * @returns true wenn erfolgreich, false wenn fehlgeschlagen
   */
  private safeSaveItem<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Fehler beim Speichern von ${key} in localStorage:`, error);
      return false;
    }
  }

  private getAllSkillTrees(): Record<string, SkillTree> {
    const skillTrees: Record<string, SkillTree> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.STORAGE_KEYS.SKILL_TREES_PREFIX)) {
        try {
          const treeData = JSON.parse(localStorage.getItem(key) || "");
          const treeId = key.replace(this.STORAGE_KEYS.SKILL_TREES_PREFIX, "");
          skillTrees[treeId] = {
            id: treeId,
            title: treeData.title || "Untitled",
            skills: treeData.skills || [],
            treeBonus: treeData.treeBonus || 0,
            manualBonus: treeData.manualBonus || 0,
          };
        } catch (e) {
          console.warn(`Fehler beim Laden des Skill Trees ${key}:`, e);
        }
      }
    }

    return skillTrees;
  }

  private getNotes() {
    const defaultNotes = {
      items: [],
      categories: [],
    };

    try {
      const notesData = this.safeGetItem(
        this.STORAGE_KEYS.NOTES_DATA,
        defaultNotes
      );
      console.log("Gelesene Notizen:", notesData); // Debug Log
      return notesData;
    } catch (error) {
      console.error("Fehler beim Lesen der Notizen:", error);
      return defaultNotes;
    }
  }

  /**
   * Speichert die Notizen im Storage
   */
  private saveNotes(notes: { items: any[]; categories: any[] }) {
    try {
      return this.safeSaveItem(this.STORAGE_KEYS.NOTES_DATA, notes);
    } catch (error) {
      console.error("Fehler beim Speichern der Notizen:", error);
      return false;
    }
  }

  public async exportData(): Promise<ExportData> {
    try {
      const skillTrees = this.getAllSkillTrees();
      const notes = this.getNotes();
      const characterStatus = this.safeGetItem(
        this.STORAGE_KEYS.CHARACTER_STATUS,
        null
      );
      const characterInfo = this.safeGetItem(
        this.STORAGE_KEYS.CHARACTER_INFO,
        null
      );
      const settings = this.safeGetItem(this.STORAGE_KEYS.SETTINGS, {});
      const layout = this.safeGetItem(this.STORAGE_KEYS.LAYOUT, {
        widgets: [],
      });

      console.log("Exportiere Notizen:", notes); // Debug Log

      const exportData: ExportData = {
        metadata: {
          version: "1.0.0",
          exportDate: new Date().toISOString(),
          exportId: this.generateId(),
          applicationVersion: "1.0.0",
          checksum: this.generateChecksum({
            characterInfo,
            characterStatus,
            skillTrees,
            notes,
            settings,
            layout,
          }),
        },
        data: {
          widgets: {
            characterInfo,
            characterStatus,
            skillTrees,
            notes, // Komplette Notizen-Struktur
            dice: { history: [] }, // Vereinfacht
          },
          settings,
          layout,
        },
      };

      return exportData;
    } catch (error) {
      console.error("Fehler beim Exportieren der Daten:", error);
      throw new Error("Daten konnten nicht exportiert werden");
    }
  }

  public async importData(importData: ExportData): Promise<void> {
    try {
      const processedData = await this.migrateIfNeeded(importData);

      // Character Info
      if (processedData.data.widgets.characterInfo) {
        this.safeSaveItem(
          this.STORAGE_KEYS.CHARACTER_INFO,
          processedData.data.widgets.characterInfo
        );
      }

      // Character Status
      if (processedData.data.widgets.characterStatus) {
        this.safeSaveItem(
          this.STORAGE_KEYS.CHARACTER_STATUS,
          processedData.data.widgets.characterStatus
        );
      }

      // Skill Trees
      if (processedData.data.widgets.skillTrees) {
        Object.entries(processedData.data.widgets.skillTrees).forEach(
          ([id, tree]) => {
            this.safeSaveItem(
              `${this.STORAGE_KEYS.SKILL_TREES_PREFIX}${id}`,
              tree
            );
          }
        );
      }

      // Notes
      if (processedData.data.widgets.notes) {
        console.log('Importiere Notizen:', processedData.data.widgets.notes); // Debug Log
        this.saveNotes(processedData.data.widgets.notes);
      }

      // Dice History
      if (processedData.data.widgets.dice) {
        this.safeSaveItem(
          this.STORAGE_KEYS.DICE_HISTORY,
          processedData.data.widgets.dice
        );
      }

      // Settings
      this.safeSaveItem(
        this.STORAGE_KEYS.SETTINGS,
        processedData.data.settings
      );

      // Layout
      this.safeSaveItem(this.STORAGE_KEYS.LAYOUT, processedData.data.layout);
    } catch (error) {
      console.error("Fehler beim Importieren der Daten:", error);
      throw new Error("Daten konnten nicht importiert werden");
    }
  }

  // Hilfsmethoden...
  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomStr}`;
  }

  private generateChecksum(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  /**
   * Löscht alle Daten aus dem LocalStorage
   * @returns Promise<void>
   */
  public deleteAllData(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Optional: Backup erstellen vor dem Löschen
        const backup = this.exportData();

        // Alle Daten löschen
        Object.values(this.STORAGE_KEYS).forEach((key) => {
          if (typeof key === "string" && !key.includes("PREFIX")) {
            localStorage.removeItem(key);
          }
        });

        // Skill Trees separat behandeln wegen Prefix
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(this.STORAGE_KEYS.SKILL_TREES_PREFIX)) {
            localStorage.removeItem(key);
          }
        }

        // Optional: Event auslösen für UI-Update
        window.dispatchEvent(new Event("storage"));

        resolve();
      } catch (error) {
        console.error("Fehler beim Löschen der Daten:", error);
        reject(new Error("Daten konnten nicht gelöscht werden"));
      }
    });
  }

  /**
   * Löscht spezifische Daten aus dem LocalStorage
   * @param keys Array von Storage-Keys die gelöscht werden sollen
   * @returns Promise<void>
   */
  public deleteSpecificData(keys: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        keys.forEach((key) => {
          localStorage.removeItem(key);
        });
        resolve();
      } catch (error) {
        console.error("Fehler beim Löschen spezifischer Daten:", error);
        reject(new Error("Spezifische Daten konnten nicht gelöscht werden"));
      }
    });
  }

  private validateImportData(data: any): boolean {
    if (!data || !data.metadata || !data.data) return false;
    if (!data.metadata.version) return false;
    if (!data.data.widgets || !data.data.settings || !data.data.layout)
      return false;
    return true;
  }

  private async migrateIfNeeded(data: ExportData): Promise<ExportData> {
    return data; // TODO: Implement migration logic if needed
  }
}

export default DataManagementService;
