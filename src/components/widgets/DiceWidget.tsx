import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Minus,
} from "lucide-react";

interface DiceRoll {
  id: string;
  diceCount: number;
  diceType: number;
  modifier: number;
  results: number[];
  total: number;
  timestamp: number;
}

interface DiceConfig {
  count: number;
  type: number;
  modifier: number;
}

const DiceWidget: React.FC = () => {
  const [rollHistory, setRollHistory] = useState<DiceRoll[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<DiceConfig>({
    count: 1,
    type: 20,
    modifier: 0,
  });

  const [modifierInput, setModifierInput] = useState(
    currentConfig.modifier.toString()
  );

  // Effekt zum Synchronisieren des Eingabefelds mit dem currentConfig
  useEffect(() => {
    setModifierInput(currentConfig.modifier.toString());
  }, [currentConfig.modifier]);

  // Würfeltypen
  const diceTypes = [4, 6, 8, 10, 12, 20, 100];

  const adjustModifier = (amount: number) => {
    const newModifier = currentConfig.modifier + amount;
    setCurrentConfig((prev) => ({
      ...prev,
      modifier: newModifier,
    }));
  };

  // Neue Funktion zur Behandlung der direkten Modifikator-Eingabe
  const handleModifierInput = (value: string) => {
    // Erlaubt leere Eingabe, negative Zahlen und Ziffern
    if (value === "" || value === "-" || /^-?\d*$/.test(value)) {
      setModifierInput(value);

      // Aktualisiert den tatsächlichen Modifier nur bei gültigen Zahlen
      if (value !== "" && value !== "-") {
        const numValue = parseInt(value);
        setCurrentConfig((prev) => ({
          ...prev,
          modifier: numValue,
        }));
      }
    }
  };

  // Behandelt den Blur-Event des Eingabefelds
  const handleModifierBlur = () => {
    // Falls leer oder ungültig, setze auf 0
    if (modifierInput === "" || modifierInput === "-") {
      setModifierInput("0");
      setCurrentConfig((prev) => ({
        ...prev,
        modifier: 0,
      }));
    }
  };

  // Würfeln mit mehreren Würfeln und Modifikator
  const rollDice = useCallback(
    async (count: number, sides: number, modifier: number) => {
      if (isRolling) return;

      setIsRolling(true);

      // Würfelergebnisse generieren
      const results = Array.from(
        { length: count },
        () => Math.floor(Math.random() * sides) + 1
      );

      // Gesamtsumme berechnen
      const total = results.reduce((sum, result) => sum + result, 0) + modifier;

      // Neuen Wurf erstellen
      const newRoll: DiceRoll = {
        id: Date.now().toString(),
        diceCount: count,
        diceType: sides,
        modifier: modifier,
        results: results,
        total: total,
        timestamp: Date.now(),
      };

      // Kurze Verzögerung für Animation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setRollHistory((prev) => [newRoll, ...prev.slice(0, 9)]);
      setIsRolling(false);
    },
    [isRolling]
  );

  // Würfelanzahl ändern
  const adjustDiceCount = (amount: number) => {
    setCurrentConfig((prev) => ({
      ...prev,
      count: Math.max(1, Math.min(10, prev.count + amount)),
    }));
  };

  return (
    <div className="space-y-4">
      {/* Würfelkonfiguration */}
      <div className="p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-700">
              Würfeleinstellungen
            </h3>
            <div className="text-xs text-gray-500">
              {currentConfig.count}d{currentConfig.type}
              {currentConfig.modifier > 0 && `+${currentConfig.modifier}`}
              {currentConfig.modifier < 0 && currentConfig.modifier}
            </div>
          </div>
        </div>

        {/* Würfelanzahl */}
        <div className="space-y-2 mb-4">
          <label className="text-sm text-gray-600">Anzahl der Würfel</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => adjustDiceCount(-1)}
              className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
              disabled={currentConfig.count <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-medium">
              {currentConfig.count}
            </span>
            <button
              onClick={() => adjustDiceCount(1)}
              className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
              disabled={currentConfig.count >= 10}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Würfeltypen */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {diceTypes.map((type) => (
            <button
              key={type}
              onClick={() => setCurrentConfig((prev) => ({ ...prev, type }))}
              className={`p-2 rounded-lg text-sm font-medium transition-colors
                ${
                  currentConfig.type === type
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              d{type}
            </button>
          ))}
        </div>

        {/* Modifikator */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Modifikator</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => adjustModifier(-1)}
              className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={modifierInput}
              onChange={(e) => handleModifierInput(e.target.value)}
              onBlur={handleModifierBlur}
              className="w-16 text-center font-medium p-1 border rounded
                      focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0"
            />
            <button
              onClick={() => adjustModifier(1)}
              className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Würfelbutton */}
      <button
        onClick={() =>
          rollDice(
            currentConfig.count,
            currentConfig.type,
            currentConfig.modifier
          )
        }
        disabled={isRolling}
        className={`w-full py-3 rounded-lg text-white font-medium transition-colors
          ${
            isRolling
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}
      >
        {isRolling ? "Würfelt..." : "Würfeln"}
      </button>

      {/* Würfelhistorie */}
      {rollHistory.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Letzte Würfe</h3>
          <div className="space-y-2">
            {rollHistory.map((roll) => (
              <div
                key={roll.id}
                className="p-3 bg-white rounded-lg shadow-sm border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      {roll.diceCount}d{roll.diceType}
                      {roll.modifier > 0 && `+${roll.modifier}`}
                      {roll.modifier < 0 && roll.modifier}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Würfe: [{roll.results.join(", ")}]
                    </div>
                  </div>
                  <span className="text-lg font-bold text-indigo-600">
                    {roll.total}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(roll.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceWidget;
