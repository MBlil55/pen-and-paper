export const characterInfoSchema = {
    type: 'object',
    properties: {
      basicInfo: {
        type: 'object',
        properties: {
          name: { type: 'string', required: true },
          gender: { type: 'string' },
          age: { type: 'string' },
          stature: { type: 'string' },
          religion: { type: 'string' },
          profession: { type: 'string' },
          familyStatus: { type: 'string' }
        }
      },
      portrait: { type: 'string' }
    }
  };
  
  export const characterStatusSchema = {
    type: 'object',
    properties: {
      health: {
        type: 'object',
        properties: {
          current: { type: 'number', required: true },
          max: { type: 'number', required: true },
          history: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', required: true },
                value: { type: 'number', required: true },
                timestamp: { type: 'string', required: true }
              }
            }
          }
        }
      },
      armor: {
        type: 'object',
        properties: {
          current: { type: 'number', required: true },
          max: { type: 'number', required: true }
        }
      },
      effects: {
        type: 'array',
        items: { type: 'string' }
      }
    }
  };
  
  // ... weitere Schema-Definitionen für andere Widget-Typen
  
  export const exportDataSchema = {
    type: 'object',
    properties: {
      metadata: {
        type: 'object',
        required: true,
        properties: {
          version: { type: 'string', required: true },
          exportDate: { type: 'string', required: true },
          exportId: { type: 'string', required: true },
          applicationVersion: { type: 'string', required: true },
          checksum: { type: 'string', required: true }
        }
      },
      data: {
        type: 'object',
        required: true,
        properties: {
          widgets: {
            type: 'object',
            properties: {
              characterInfo: characterInfoSchema,
              characterStatus: characterStatusSchema,
              // ... weitere Widget-Schemas
            }
          },
          settings: {
            type: 'object',
            properties: {
              theme: {
                type: 'object',
                properties: {
                  primary: { type: 'string' },
                  secondary: { type: 'string' },
                  background: { type: 'string' }
                }
              },
              display: {
                type: 'object',
                properties: {
                  showPortrait: { type: 'boolean' },
                  showEffects: { type: 'boolean' },
                  showCombatLog: { type: 'boolean' },
                  compactMode: { type: 'boolean' }
                }
              }
            }
          },
          layout: {
            type: 'object',
            properties: {
              widgets: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    i: { type: 'string', required: true },
                    x: { type: 'number', required: true },
                    y: { type: 'number', required: true },
                    w: { type: 'number', required: true },
                    h: { type: 'number', required: true },
                    type: { type: 'string', required: true },
                    config: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    }
  };