import React, { useState } from 'react';

const DamageWidget = () => {
  const [currentHealth, setCurrentHealth] = useState(100);
  const [maxHealth, setMaxHealth] = useState(100);
  const [damage, setDamage] = useState('');
  const [damageHistory, setDamageHistory] = useState<Array<{value: number, type: 'damage' | 'heal'}>>([]);

  const applyDamage = () => {
    const damageValue = parseInt(damage);
    if (!isNaN(damageValue)) {
      const newHealth = Math.max(0, currentHealth - damageValue);
      setCurrentHealth(newHealth);
      setDamageHistory(prev => [...prev, { value: damageValue, type: 'damage' }].slice(-5));
      setDamage('');
    }
  };

  const applyHeal = () => {
    const healValue = parseInt(damage);
    if (!isNaN(healValue)) {
      const newHealth = Math.min(maxHealth, currentHealth + healValue);
      setCurrentHealth(newHealth);
      setDamageHistory(prev => [...prev, { value: healValue, type: 'heal' }].slice(-5));
      setDamage('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-500">Max. Leben</label>
          <input
            type="number"
            value={maxHealth}
            onChange={(e) => setMaxHealth(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-500">Aktuelles Leben</label>
          <div className="text-2xl font-bold text-indigo-600 text-center">
            {currentHealth}/{maxHealth}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-500">Schadenswert</label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={damage}
            onChange={(e) => setDamage(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
            placeholder="Wert eingeben"
          />
          <button
            onClick={applyDamage}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Schaden
          </button>
          <button
            onClick={applyHeal}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
          >
            Heilen
          </button>
        </div>
      </div>

      {damageHistory.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Verlauf:</h4>
          <div className="space-y-1">
            {damageHistory.map((entry, index) => (
              <div
                key={index}
                className={`text-sm ${
                  entry.type === 'damage' ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {entry.type === 'damage' ? '-' : '+'}{entry.value}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DamageWidget;