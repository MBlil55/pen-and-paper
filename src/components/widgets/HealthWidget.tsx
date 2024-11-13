import React, { useState, useEffect } from 'react';

interface HealthBarProps {
  current: number;
  max: number;
}

const HealthBar: React.FC<HealthBarProps> = ({ current, max }) => {
  const percentage = (current / max) * 100;
  const getHealthColor = () => {
    if (percentage > 66) return 'from-green-500 to-green-600';
    if (percentage > 33) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`absolute h-full bg-gradient-to-r ${getHealthColor()} transition-all duration-500 ease-in-out`}
        style={{ width: `${percentage}%` }}
      >
        <div className="absolute inset-0 bg-[length:20px_20px] bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] animate-[health-stripe_1s_linear_infinite]" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold shadow-sm">
        {current} / {max}
      </div>
    </div>
  );
};

const HealthWidget = () => {
  const [health, setHealth] = useState(100);
  const [maxHealth, setMaxHealth] = useState(100);
  const [tempHealth, setTempHealth] = useState(0);

  const adjustHealth = (amount: number) => {
    setHealth(prev => Math.min(maxHealth, Math.max(0, prev + amount)));
  };

  return (
    <div className="space-y-4">
      <HealthBar current={health + tempHealth} max={maxHealth} />
      
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => adjustHealth(-10)}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
        >
          -10
        </button>
        <button
          onClick={() => adjustHealth(10)}
          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
        >
          +10
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-500">Temporäre Lebenspunkte</label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={tempHealth}
            onChange={(e) => setTempHealth(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-500">Maximum Leben</label>
        <input
          type="number"
          value={maxHealth}
          onChange={(e) => {
            const newMax = Math.max(1, parseInt(e.target.value) || 0);
            setMaxHealth(newMax);
            setHealth(prev => Math.min(prev, newMax));
          }}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
        />
      </div>
    </div>
  );
};

export default HealthWidget;