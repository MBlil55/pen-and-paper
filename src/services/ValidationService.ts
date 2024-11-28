export interface ValidationError {
    field: string;
    message: string;
    code: string;
  }
  
  export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
  }
  
  export class ValidationService {
    /**
     * Validiert Import-Daten mit Toleranz für fehlende/zusätzliche Felder
     */
    public validateWithTolerance(data: any, schema: any): ValidationResult {
      const result: ValidationResult = {
        isValid: true,
        errors: [],
        warnings: []
      };
  
      try {
        this.validateStructure(data, schema, '', result);
      } catch (error) {
        result.isValid = false;
        result.errors.push({
          field: 'root',
          message: 'Kritischer Validierungsfehler',
          code: 'CRITICAL_ERROR'
        });
      }
  
      // Daten sind gültig, wenn keine kritischen Fehler vorliegen
      result.isValid = result.errors.length === 0;
  
      return result;
    }
  
    /**
     * Rekursive Struktur-Validierung
     */
    private validateStructure(
      data: any,
      schema: any,
      path: string,
      result: ValidationResult
    ): void {
      // Überspringe null/undefined Werte
      if (data === null || data === undefined) {
        if (schema.required) {
          result.errors.push({
            field: path,
            message: 'Pflichtfeld fehlt',
            code: 'REQUIRED_FIELD_MISSING'
          });
        }
        return;
      }
  
      // Validiere Typ
      if (schema.type && typeof data !== schema.type) {
        result.errors.push({
          field: path,
          message: `Ungültiger Typ. Erwartet: ${schema.type}, Erhalten: ${typeof data}`,
          code: 'INVALID_TYPE'
        });
        return;
      }
  
      // Für Objekte: Rekursive Validierung
      if (schema.type === 'object' && schema.properties) {
        // Prüfe bekannte Properties
        Object.keys(schema.properties).forEach(key => {
          const newPath = path ? `${path}.${key}` : key;
          if (data.hasOwnProperty(key)) {
            this.validateStructure(
              data[key],
              schema.properties[key],
              newPath,
              result
            );
          } else if (schema.properties[key].required) {
            result.errors.push({
              field: newPath,
              message: 'Pflichtfeld fehlt',
              code: 'REQUIRED_FIELD_MISSING'
            });
          }
        });
  
        // Prüfe auf zusätzliche Properties
        Object.keys(data).forEach(key => {
          if (!schema.properties.hasOwnProperty(key)) {
            result.warnings.push({
              field: path ? `${path}.${key}` : key,
              message: 'Unbekanntes Feld wird ignoriert',
              code: 'UNKNOWN_FIELD'
            });
          }
        });
      }
  
      // Für Arrays: Validiere Elemente
      if (schema.type === 'array' && schema.items) {
        data.forEach((item: any, index: number) => {
          this.validateStructure(
            item,
            schema.items,
            `${path}[${index}]`,
            result
          );
        });
      }
    }
  }
  
  export default ValidationService;