// components/gear/AddItemModal.tsx
import React, { useState } from "react";
import { X, Plus, Trash, Sword, Shield, Crown } from "lucide-react";
import {
  useGearStore,
  type Dice,
  type Effect,
  type GearItem,
} from "./store/useGearStore";

interface AddItemModalProps {
  onClose: () => void;
  editItem?: GearItem;
}

const EFFECT_TYPES = [
  { value: "percentage", label: "Prozentualer Bonus" },
  { value: "flat", label: "Fester Bonus" },
  { value: "damage_reduction", label: "Schadenreduktion" },
] as const;

const ITEM_TYPES = [
  { id: "weapon", label: "Waffe", icon: Sword },
  { id: "armor", label: "Rüstung", icon: Shield },
  { id: "accessory", label: "Accessoire", icon: Crown },
] as const;

const DEFAULT_DICE: Dice = { count: 1, sides: 6 };

export const AddItemModal: React.FC<AddItemModalProps> = ({
  onClose,
  editItem,
}) => {
  console.log("AddItemModal rendered with editItem:", editItem); // Debug-Log
  const addItem = useGearStore((state) => state.addItem);
  const updateItem = useGearStore((state) => state.updateItem);

  const [formData, setFormData] = useState(() => {
    if (editItem) {
      return {
        name: editItem.name,
        type: editItem.type,
        damage: editItem.damage || {
          dice: [],
          modifier: 0,
        },
        stats: editItem.stats || {
          health: 0,
          armor: 0,
        },
        effects: editItem.effects || [],
        isActive: editItem.isActive,
      };
    }
    return {
      name: "",
      type: "weapon" as const,
      damage: {
        dice: [],
        modifier: 0,
      },
      stats: {
        health: 0,
        armor: 0,
      },
      effects: [],
      isActive: true,
    };
  });

  // Form Handlers
  const handleAddDice = () => {
    setFormData((prev) => ({
      ...prev,
      damage: {
        ...prev.damage,
        dice: [...prev.damage.dice, { ...DEFAULT_DICE }],
      },
    }));
  };

  const handleRemoveDice = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      damage: {
        ...prev.damage,
        dice: prev.damage.dice.filter((_, i) => i !== index),
      },
    }));
  };

  const handleDiceChange = (
    index: number,
    field: keyof Dice,
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      damage: {
        ...prev.damage,
        dice: prev.damage.dice.map((dice, i) =>
          i === index ? { ...dice, [field]: value } : dice
        ),
      },
    }));
  };

  const handleAddEffect = () => {
    const newEffect: Effect = {
      id: crypto.randomUUID(),
      name: "",
      value: 0,
      type: "percentage",
    };

    setFormData((prev) => ({
      ...prev,
      effects: [...prev.effects, newEffect],
    }));
  };

  const handleRemoveEffect = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      effects: prev.effects.filter((effect) => effect.id !== id),
    }));
  };

  const handleEffectChange = (id: string, updates: Partial<Effect>) => {
    setFormData((prev) => ({
      ...prev,
      effects: prev.effects.map((effect) =>
        effect.id === id ? { ...effect, ...updates } : effect
      ),
    }));
  };

  // Submit Handler
  const handleSubmit = () => {
    if (editItem) {
      // Update existierendes Item
      updateItem(editItem.id, {
        ...formData,
        // Wenn kein Weapon, dann damage auf null setzen
        damage: formData.type === "weapon" ? formData.damage : null,
        // Wenn Weapon, dann stats auf undefined setzen
        stats: formData.type === "weapon" ? undefined : formData.stats,
      });
    } else {
      // Neues Item erstellen
      addItem({
        ...formData,
        damage: formData.type === "weapon" ? formData.damage : null,
        stats: formData.type === "weapon" ? undefined : formData.stats,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl">
        {/* Header anpassen */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {editItem ? "Ausrüstung bearbeiten" : "Neue Ausrüstung hinzufügen"}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Name der Ausrüstung"
              />
            </div>

            {/* Item Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Typ</label>
              <div className="grid grid-cols-3 gap-3">
                {ITEM_TYPES.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, type: id }))
                    }
                    className={`
                      p-3 rounded-lg border-2 flex flex-col items-center gap-2
                      ${
                        formData.type === id
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Configuration für Rüstung und Accessoires */}
          {(formData.type === "armor" || formData.type === "accessory") && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Statusboni</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Lebenspunkte Bonus
                  </label>
                  <input
                    type="number"
                    value={formData.stats.health}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stats: {
                          ...prev.stats,
                          health: parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="z.B. 50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Rüstung Bonus
                  </label>
                  <input
                    type="number"
                    value={formData.stats.armor}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stats: {
                          ...prev.stats,
                          armor: parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="z.B. 10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Damage Configuration für Waffen */}
          {formData.type === "weapon" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Schaden</h3>
                <button
                  onClick={handleAddDice}
                  className="text-sm text-indigo-600 hover:text-indigo-700 
                         flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Würfel hinzufügen
                </button>
              </div>

              {formData.damage.dice.map((dice, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Anzahl
                      </label>
                      <input
                        type="number"
                        value={dice.count}
                        onChange={(e) =>
                          handleDiceChange(
                            index,
                            "count",
                            parseInt(e.target.value)
                          )
                        }
                        min="1"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Seitenzahl
                      </label>
                      <select
                        value={dice.sides}
                        onChange={(e) =>
                          handleDiceChange(
                            index,
                            "sides",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        {[4, 6, 8, 10, 12, 20, 100].map((sides) => (
                          <option key={sides} value={sides}>
                            W{sides}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveDice(index)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Damage Modifier */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Schadensmodifikator
                </label>
                <input
                  type="number"
                  value={formData.damage.modifier}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      damage: {
                        ...prev.damage,
                        modifier: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Effects */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Effekte</h3>
              <button
                onClick={handleAddEffect}
                className="text-sm text-indigo-600 hover:text-indigo-700 
                         flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Effekt hinzufügen
              </button>
            </div>

            {formData.effects.map((effect) => (
              <div key={effect.id} className="flex gap-4 items-start">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={effect.name}
                      onChange={(e) =>
                        handleEffectChange(effect.id, { name: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Wert
                      </label>
                      <input
                        type="number"
                        value={effect.value}
                        onChange={(e) =>
                          handleEffectChange(effect.id, {
                            value: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Typ
                      </label>
                      <select
                        value={effect.type}
                        onChange={(e) =>
                          handleEffectChange(effect.id, {
                            type: e.target.value as EffectType,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        {EFFECT_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveEffect(effect.id)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg 
                     hover:bg-indigo-600"
          >
            {editItem ? "Speichern" : "Hinzufügen"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
