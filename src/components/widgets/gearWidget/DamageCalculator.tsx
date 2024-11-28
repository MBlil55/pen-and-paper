import React, { useState, useCallback, useMemo } from "react";
import { Dices, RefreshCw, Info } from "lucide-react";
import { useGearStore } from "./store/useGearStore";

export const DamageCalculator: React.FC = () => {
  const allItems = useGearStore((state) => state.items);
  const abilities = useGearStore((state) => state.abilities);
  const rollDice = useGearStore((state) => state.rollDice);
  const lastRollResults = useGearStore((state) => state.lastRollResults);
  const getLastRollTotal = useGearStore((state) => state.getLastRollTotal);
  const calculateTotalDamage = useGearStore(
    (state) => state.calculateTotalDamage
  );

  const items = useMemo(() => {
    return allItems.filter((item) => item.isActive && item.type === "weapon");
  }, [allItems]);

  // Local State
  const [showDetails, setShowDetails] = useState(false);
  const [temporaryBonus, setTemporaryBonus] = useState(0);
  const [isRolling, setIsRolling] = useState(false);

  // Store access with stable selector
  // Store Zugriff mit korrekter shallow Anwendung

  // Event Handlers
  const handleRoll = useCallback(async () => {
    if (isRolling || !items.length) return;

    setIsRolling(true);
    try {
      rollDice();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsRolling(false);
    }
  }, [isRolling, items.length, rollDice]);

  const handleTemporaryBonusChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTemporaryBonus(Number(e.target.value) || 0);
    },
    []
  );

  // Calculate damage stats once
  const damageStats = calculateTotalDamage();

  return (
    <div className="space-y-6">
      {/* Calculator Section */}
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-700">
            Combat Calculator
          </h3>
          <button
            onClick={() => setShowDetails((prev) => !prev)}
            className="p-2 bg-white border rounded-lg text-gray-600 hover:bg-gray-50"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Active Sources */}
        <div className="space-y-3 mb-4">
          <div className="text-xs font-medium text-gray-500 uppercase">
            Aktive Waffen ({items.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="px-2 py-1 bg-white border rounded-lg text-sm flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {item.name}
              </div>
            ))}
          </div>
        </div>

        {/* Temporary Bonus */}
        <div className="space-y-2 mb-4">
          <label className="block text-xs font-medium text-gray-500">
            Temporärer Bonus (%)
          </label>
          <input
            type="number"
            value={temporaryBonus}
            onChange={handleTemporaryBonusChange}
            className="w-full px-3 py-2 bg-white border rounded-lg"
            placeholder="z.B. 25"
          />
        </div>

        {/* Damage Stats */}
        <div className="space-y-2">
          <div className="bg-white border rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Würfelformel</span>
              <span className="font-medium">{damageStats.diceFormula}</span>
            </div>
          </div>

          {showDetails && (
            <>
              <div className="bg-white/50 border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Minimum</span>
                  <span className="font-medium">
                    {Math.floor(damageStats.minimumDamage)}
                  </span>
                </div>
              </div>
              <div className="bg-white/50 border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Durchschnitt</span>
                  <span className="font-medium">
                    {Math.floor(damageStats.averageDamage)}
                  </span>
                </div>
              </div>
              <div className="bg-white/50 border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Maximum</span>
                  <span className="font-medium">
                    {Math.floor(damageStats.maximumDamage)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dice Rolling Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-700">Würfelhelfer</h3>
          <button
            onClick={handleRoll}
            disabled={isRolling || items.length === 0}
            className={`
              px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all
              ${
                isRolling
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }
            `}
          >
            {isRolling ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Würfelt...</span>
              </>
            ) : (
              <>
                <Dices className="w-4 h-4" />
                <span>Würfeln</span>
              </>
            )}
          </button>
        </div>

        {/* Roll Results */}
        {lastRollResults.length > 0 && (
          <div className="space-y-3">
            {lastRollResults.map((result, index) => {
              const source = [...items, ...abilities].find(
                (s) => s.id === result.sourceId
              );
              if (!source) return null;

              return (
                <div key={index} className="bg-white/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">{source.name}</span>
                    <span className="text-xs text-gray-400">
                      {result.rolls.dice.length} Würfel
                    </span>
                  </div>

                  {/* Würfelergebnisse */}
                  <div className="flex flex-wrap gap-2">
                    {result.rolls.dice.map((roll, i) => (
                      <div
                        key={i}
                        className={`
                  w-10 h-10 rounded bg-white flex items-center justify-center 
                  font-medium ${
                    roll === 20
                      ? "text-green-600"
                      : roll === 1
                        ? "text-red-600"
                        : "text-indigo-600"
                  }
                `}
                      >
                        {roll}
                      </div>
                    ))}
                  </div>

                  {/* Neue Berechnungsdetails */}
                  <div className="mt-2 text-sm text-gray-600">
                    <div className="flex justify-between items-center">
                      <span>Würfelsumme:</span>
                      <span>{result.rolls.sum}</span>
                    </div>
                    {result.rolls.modifier !== 0 && (
                      <div className="flex justify-between items-center">
                        <span>Modifikator:</span>
                        <span>
                          {result.rolls.modifier >= 0 ? "+" : ""}
                          {result.rolls.modifier}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center font-medium">
                      <span>Zwischensumme:</span>
                      <span>{result.rolls.total}</span>
                    </div>
                    {/* Neu: Prozentualer Bonus */}
                    {result.rolls.percentageBonus && (
                      <>
                        <div className="flex justify-between items-center text-indigo-600">
                          <span>Schadenbonus:</span>
                          <span>+{result.rolls.percentageBonus.value}%</span>
                        </div>
                        <div className="flex justify-between items-center font-medium">
                          <span>Finaler Schaden:</span>
                          <span>{result.rolls.percentageBonus.total}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Total Result */}
            <div className="bg-white rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Gesamtschaden</span>
                <div className="text-right">
                  <span className="font-medium text-xl text-indigo-600">
                    {getLastRollTotal()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-6 text-sm text-gray-500">
            Keine aktiven Gegenstände oder Fähigkeiten.
          </div>
        )}
      </div>
    </div>
  );
};

export default DamageCalculator;
