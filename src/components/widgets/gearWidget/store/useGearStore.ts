// store/useGearStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Dice {
  count: number;
  sides: number;
}

interface Effect {
  id: string;
  name: string;
  value: number;
  type: "percentage" | "flat" | "damage_reduction"; // Erweiterte Type-Definition
  description?: string;
}

export interface GearItem {
  id: string;
  name: string;
  type: "weapon" | "armor" | "accessory";
  damage?: {
    dice: Array<{
      count: number;
      sides: number;
    }>;
    modifier: number;
  } | null;
  stats?: {
    health: number;
    armor: number;
  };
  effects: Array<{
    id: string;
    name: string;
    value: number;
    type: "percentage" | "flat" | "damage_reduction";
    description?: string;
  }>;
  isActive: boolean;
  imageUrl?: string;
}

export interface Ability {
  id: string;
  name: string;
  damage?: {
    dice: Dice[];
    modifier: number;
  };
  effects: Effect[];
  isActive: boolean;
  cost?: number;
  cooldown?: number;
}

interface TemporaryBonus {
  percentage: number;
  description?: string;
}

type EffectType = "percentage" | "flat" | "damage_reduction";
type CalculationStepType = "base" | "modifier" | "effect";

interface CalculationStep {
  description: string;
  value: number;
  type: CalculationStepType;
  source: string;
}

interface DamageCalculation {
  diceFormula: string;
  averageDamage: number;
  minimumDamage: number;
  maximumDamage: number;
  modifiers: Array<{
    source: string;
    value: number;
    type: EffectType;
  }>;
  calculationSteps: CalculationStep[];
}

interface GearStore {
  // Bestehende Properties
  items: GearItem[];
  abilities: Ability[];
  temporaryBonus: TemporaryBonus | null;
  lastRollResults: {
    sourceId: string;
    rolls: {
      dice: number[];
      sum: number;
      modifier: number;
      total: number;
      percentageBonus?: {
        value: number;
        total: number;
      };
    finalDamage: number;
    };
    timestamp: number;
  }[];

  // Bestehende Methoden
  addItem: (item: Omit<GearItem, "id">) => string;
  updateItem: (id: string, updates: Partial<GearItem>) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  rollDice: () => void;
  getLastRollTotal: () => number;
  clearRollHistory: () => void;

  // Neue Damage Calculation Methoden
  calculateDamageWithReduction: (
    damage: number,
    isDirect: boolean
  ) => {
    finalDamage: number;
    reduction: {
      total: number;
      sources: Array<{
        name: string;
        value: number;
      }>;
    };
  };

  // Neue Methode hinzufügen
  calculateTotalStats: () => {
    totalHealthBonus: number;
    totalArmorBonus: number;
  };

  // Ability Management
  addAbility: (ability: Omit<Ability, "id">) => string;
  updateAbility: (id: string, updates: Partial<Ability>) => void;
  removeAbility: (id: string) => void;
  toggleAbility: (id: string) => void;

  // Bonus Management
  setTemporaryBonus: (bonus: TemporaryBonus | null) => void;

  calculateTotalDamage: () => DamageCalculation;
}

export const useGearStore = create<GearStore>()(
  persist(
    (set, get) => ({
      items: [],
      abilities: [],
      temporaryBonus: null,
      lastRollResults: [],

      addItem: (item) => {
        const id = crypto.randomUUID();
        set((state) => ({
          items: [...state.items, { ...item, id }],
        }));
        return id;
      },

      updateItem: (id: string, updates: Partial<GearItem>) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      toggleItem: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, isActive: !item.isActive } : item
          ),
        }));
      },

      addAbility: (ability) => {
        const id = crypto.randomUUID();
        set((state) => ({
          abilities: [...state.abilities, { ...ability, id }],
        }));
        return id;
      },

      updateAbility: (id, updates) => {
        set((state) => ({
          abilities: state.abilities.map((ability) =>
            ability.id === id ? { ...ability, ...updates } : ability
          ),
        }));
      },

      removeAbility: (id) => {
        set((state) => ({
          abilities: state.abilities.filter((ability) => ability.id !== id),
        }));
      },

      toggleAbility: (id) => {
        set((state) => ({
          abilities: state.abilities.map((ability) =>
            ability.id === id
              ? { ...ability, isActive: !ability.isActive }
              : ability
          ),
        }));
      },

      setTemporaryBonus: (bonus) => {
        set({ temporaryBonus: bonus });
      },

      calculateTotalStats: () => {
        const state = get();
        // Nur aktive Items berücksichtigen
        const activeItems = state.items.filter((item) => item.isActive);

        return activeItems.reduce(
          (totals, item) => {
            // Nur wenn stats vorhanden sind addieren
            if (item.stats) {
              return {
                totalHealthBonus:
                  totals.totalHealthBonus + (item.stats.health || 0),
                totalArmorBonus:
                  totals.totalArmorBonus + (item.stats.armor || 0),
              };
            }
            return totals;
          },
          { totalHealthBonus: 0, totalArmorBonus: 0 }
        );
      },

      calculateDamageWithReduction: (damage: number, isDirect: boolean) => {
        const state = get();

        // Debug-Log für die aktiven Items und ihre Effekte
        console.log(
          "Active Items:",
          state.items.filter((item) => item.isActive)
        );

        if (isDirect) {
          return {
            finalDamage: damage,
            reduction: {
              total: 0,
              sources: [],
            },
          };
        }

        // Sammle alle aktiven Reduktionseffekte
        const reductionEffects = state.items
          .filter((item) => item.isActive)
          .flatMap((item) => {
            // Debug-Log für jeden Item-Effekt
            console.log(`Checking effects for ${item.name}:`, item.effects);

            return item.effects
              .filter((effect) => {
                // Debug-Log für jeden Effekt
                console.log(`Effect type for ${item.name}:`, effect.type);
                return effect.type === "damage_reduction";
              })
              .map((effect) => ({
                name: item.name,
                value: effect.value,
              }));
          });

        // Debug-Log für gefundene Reduktionseffekte
        console.log("Found reduction effects:", reductionEffects);

        // Berechne Gesamtreduktion (additiv)
        const totalReduction = reductionEffects.reduce(
          (sum, effect) => sum + effect.value,
          0
        );

        // Debug-Log für die Schadensberechnung
        console.log("Original damage:", damage);
        console.log("Total reduction:", totalReduction);

        const finalDamage = Math.round(damage * (1 - totalReduction / 100));

        console.log("Final damage:", finalDamage);

        return {
          finalDamage,
          reduction: {
            total: totalReduction,
            sources: reductionEffects,
          },
        };
      },

      calculateTotalDamage: () => {
        const state = get();
        const activeWeapons = state.items.filter(
          (item) => item.isActive && item.type === "weapon"
        );

        const calculationSteps: CalculationStep[] = [];
        let minDamage = 0;
        let maxDamage = 0;
        let avgDamage = 0;

        // Berechne für jede aktive Waffe
        for (const weapon of activeWeapons) {
          if (weapon.damage) {
            // Berechne Würfelwerte
            const diceValues = weapon.damage.dice.reduce(
              (acc, die) => {
                // Minimum: Anzahl der Würfel × 1
                acc.min += die.count * 1;
                // Maximum: Anzahl der Würfel × Seitenzahl
                acc.max += die.count * die.sides;
                // Durchschnitt: Anzahl der Würfel × ((Seitenzahl + 1) / 2)
                acc.avg += die.count * ((die.sides + 1) / 2);
                return acc;
              },
              { min: 0, max: 0, avg: 0 }
            );

            // Addiere Modifikator zu allen Werten
            const modifier = weapon.damage.modifier || 0;
            minDamage += diceValues.min + modifier;
            maxDamage += diceValues.max + modifier;
            avgDamage += diceValues.avg + modifier;

            // Effekte anwenden
            for (const effect of weapon.effects) {
              if (effect.type === "percentage") {
                const multiplier = effect.value / 100;
                minDamage += Math.round(minDamage * multiplier);
                maxDamage += Math.round(maxDamage * multiplier);
                avgDamage += Math.round(avgDamage * multiplier);
              } else if (effect.type === "flat") {
                minDamage += effect.value;
                maxDamage += effect.value;
                avgDamage += effect.value;
              }
            }
          }
        }

        // Würfelformel erstellen (bleibt unverändert)
        const diceFormula = activeWeapons
          .map((weapon) => {
            if (!weapon.damage) return "";
            const dice = weapon.damage.dice
              .map((die) => `${die.count}d${die.sides}`)
              .join(" + ");
            return weapon.damage.modifier
              ? `(${dice} + ${weapon.damage.modifier})`
              : dice;
          })
          .filter(Boolean)
          .join(" + ");

        return {
          diceFormula,
          averageDamage: Math.round(avgDamage),
          minimumDamage: Math.round(minDamage),
          maximumDamage: Math.round(maxDamage),
          modifiers: activeWeapons.flatMap((weapon) =>
            weapon.effects.map((effect) => ({
              source: weapon.name,
              value: effect.value,
              type: effect.type,
            }))
          ),
          calculationSteps,
        };
      },

      rollDice: () => {
        const state = get();
        const activeItems = state.items.filter((item) => item.isActive);
        
        const results = activeItems.map((source) => {
          if (!source.damage) return null;
          
          // Würfeln und Basisschaden berechnen
          const diceRolls = source.damage.dice.flatMap((die) =>
            Array(die.count)
              .fill(0)
              .map(() => Math.floor(Math.random() * die.sides) + 1)
          );
      
          const diceSum = diceRolls.reduce((sum, roll) => sum + roll, 0);
          const modifier = source.damage.modifier || 0;
          const subtotal = diceSum + modifier;
      
          // Berechne den prozentualen Bonus dieser Waffe
          const weaponPercentageBonus = source.effects
            .filter(effect => effect.type === 'percentage')
            .reduce((total, effect) => total + effect.value, 0);
      
          // Berechne den finalen Schaden für diese Waffe
          const finalWeaponDamage = weaponPercentageBonus > 0 
            ? Math.round(subtotal * (1 + weaponPercentageBonus / 100))
            : subtotal;
      
          return {
            sourceId: source.id,
            rolls: {
              dice: diceRolls,
              sum: diceSum,
              modifier: modifier,
              total: subtotal,
              percentageBonus: weaponPercentageBonus > 0 ? {
                value: weaponPercentageBonus,
                total: finalWeaponDamage
              } : undefined,
              finalDamage: finalWeaponDamage
            },
            timestamp: Date.now()
          };
        }).filter((result): result is NonNullable<typeof result> => result !== null);
      
        set({ lastRollResults: results });
      },
      
      // Helper zum Berechnen des Gesamtschadens (kann im UI verwendet werden)
      getLastRollTotal: () => {
        const state = get();
        if (!state.lastRollResults.length) return 0;
        
        return state.lastRollResults.reduce((total, result) => 
          total + result.rolls.finalDamage, 0);
      },

      clearRollHistory: () => {
        set({ lastRollResults: [] });
      },
    }),
    {
      name: "gear-storage",
      onRehydrateStorage: (state) => {
        return (nextState, partialState) => {
          return shallow(nextState, partialState);
        };
      },
    }
  )
);
