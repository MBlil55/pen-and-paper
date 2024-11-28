import { ExportData } from './DataManagementService';

interface MigrationStep {
  fromVersion: string;
  toVersion: string;
  migrate: (data: any) => Promise<any>;
}

export class MigrationService {
  private migrationSteps: MigrationStep[] = [];

  constructor() {
    // Registriere alle Migrations-Schritte
    this.registerMigrations();
  }

  private registerMigrations() {
    // Migration von 1.0.0 zu 1.1.0
    this.migrationSteps.push({
      fromVersion: '1.0.0',
      toVersion: '1.1.0',
      migrate: async (data: any) => {
        // Beispiel für eine Migration
        if (data.data?.widgets?.characterInfo) {
          // Füge neue Felder mit Standardwerten hinzu
          data.data.widgets.characterInfo = {
            ...data.data.widgets.characterInfo,
            playerName: null,  // Neues Feld
            campaign: null     // Neues Feld
          };
        }
        return data;
      }
    });

    // Migration von 1.1.0 zu 1.2.0
    this.migrationSteps.push({
      fromVersion: '1.1.0',
      toVersion: '1.2.0',
      migrate: async (data: any) => {
        if (data.data?.widgets?.characterStatus) {
          // Konvertiere alte Status-Struktur in neue
          const oldStatus = data.data.widgets.characterStatus;
          data.data.widgets.characterStatus = {
            ...oldStatus,
            conditions: [],  // Neues Feature
            statusEffects: oldStatus.effects || [] // Umbenanntes Feld
          };
          delete data.data.widgets.characterStatus.effects; // Altes Feld entfernen
        }
        return data;
      }
    });
  }

  /**
   * Führt alle notwendigen Migrationen durch
   */
  public async migrateData(data: ExportData): Promise<ExportData> {
    let currentData = { ...data };
    const sourceVersion = data.metadata.version;
    const targetVersion = process.env.REACT_APP_CURRENT_VERSION || '1.0.0';

    try {
      // Finde alle notwendigen Migrations-Schritte
      const steps = this.findMigrationPath(sourceVersion, targetVersion);

      // Führe Migrationen sequentiell durch
      for (const step of steps) {
        console.log(`Migriere von ${step.fromVersion} nach ${step.toVersion}`);
        currentData = await step.migrate(currentData);
        currentData.metadata.version = step.toVersion;
      }

      return currentData;
    } catch (error) {
      console.error('Fehler während der Migration:', error);
      throw new Error('Migration fehlgeschlagen');
    }
  }

  /**
   * Findet den optimalen Migrationspfad
   */
  private findMigrationPath(fromVersion: string, toVersion: string): MigrationStep[] {
    const path: MigrationStep[] = [];
    let currentVersion = fromVersion;

    while (currentVersion !== toVersion) {
      const nextStep = this.migrationSteps.find(
        step => step.fromVersion === currentVersion
      );

      if (!nextStep) {
        throw new Error(`Kein Migrationspfad gefunden von ${currentVersion} nach ${toVersion}`);
      }

      path.push(nextStep);
      currentVersion = nextStep.toVersion;
    }

    return path;
  }

  /**
   * Prüft ob eine Migration notwendig ist
   */
  public needsMigration(data: ExportData): boolean {
    return data.metadata.version !== process.env.REACT_APP_CURRENT_VERSION;
  }

  /**
   * Gibt verfügbare Versionen zurück
   */
  public getAvailableVersions(): string[] {
    const versions = new Set<string>();
    this.migrationSteps.forEach(step => {
      versions.add(step.fromVersion);
      versions.add(step.toVersion);
    });
    return Array.from(versions).sort();
  }
}

export default MigrationService;