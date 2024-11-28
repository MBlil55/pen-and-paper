import React, { useState, useEffect } from 'react';
import { 
  Save,
  Sparkles,
  Skull,
  Swords,
  Crown,
  Shield,
  HeartPulse,
  Search,
  Clock
} from 'lucide-react';
import useEffectStore from './hooks/useEffectStore';
import { Effect, EffectCategory } from './types/effectTypes';

// Verfügbare Icons für die Auswahl
const availableIcons = {
  'Sparkles': Sparkles,
  'Skull': Skull,
  'Swords': Swords,
  'Crown': Crown,
  'Shield': Shield,
  'HeartPulse': HeartPulse
};

// Color Presets für verschiedene Kategorien
const categoryColors = {
  buffs: '#10B981',    // emerald-500
  debuffs: '#EF4444',  // rose-500
  combat: '#F59E0B',   // amber-500
  special: '#6366F1',  // indigo-500
  defense: '#3B82F6',  // blue-500
  health: '#8B5CF6'    // purple-500
};

// Icon Picker Component
const IconPicker: React.FC<{
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}> = ({ selectedIcon, onSelectIcon }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredIcons = Object.entries(availableIcons).filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Icon suchen..."
          className="w-full pl-9 pr-3 py-2 border rounded-lg"
        />
      </div>
      <div className="grid grid-cols-6 gap-2">
        {filteredIcons.map(([name, Icon]) => (
          <button
            key={name}
            onClick={() => onSelectIcon(name)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedIcon === name
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-transparent hover:bg-gray-50'
            }`}
          >
            <Icon className="w-6 h-6 mx-auto" />
          </button>
        ))}
      </div>
    </div>
  );
};

// Color Picker Component
const ColorPicker: React.FC<{
  selectedColor: string;
  onSelectColor: (color: string) => void;
  category: EffectCategory;
}> = ({ selectedColor, onSelectColor, category }) => {
  const categoryColor = categoryColors[category];
  
  // Generate color shades
  const colorShades = [
    categoryColor,
    adjustColorBrightness(categoryColor, 20),
    adjustColorBrightness(categoryColor, -20)
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {colorShades.map((color, index) => (
          <button
            key={index}
            onClick={() => onSelectColor(color)}
            className={`w-8 h-8 rounded-lg transition-transform ${
              selectedColor === color
                ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110'
                : 'hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <input
        type="color"
        value={selectedColor}
        onChange={(e) => onSelectColor(e.target.value)}
        className="w-full h-10 rounded-lg cursor-pointer"
      />
    </div>
  );
};

// Effect Preview Component
const EffectPreview: React.FC<{
  effect: Partial<Effect>;
}> = ({ effect }) => {
  const Icon = availableIcons[effect.icon as keyof typeof availableIcons];

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-700 
                    rounded-lg opacity-50" />
      <div className="relative p-4 flex items-start gap-4">
        {Icon && (
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: effect.color }}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-medium text-white">{effect.name || 'Effekt Name'}</h3>
          <p className="text-sm text-slate-300 mt-1">
            {effect.description || 'Effekt Beschreibung'}
          </p>
          {effect.value && (
            <span className={`text-sm font-medium mt-2 inline-block
                          ${Number(effect.value) > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {Number(effect.value) > 0 ? '+' : ''}{effect.value}%
            </span>
          )}
          {effect.duration && (
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
              <Clock className="w-3 h-3" />
              {formatDuration(effect.duration)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Utility function for color adjustment
function adjustColorBrightness(hex: string, percent: number) {
  let R = parseInt(hex.substring(1,3),16);
  let G = parseInt(hex.substring(3,5),16);
  let B = parseInt(hex.substring(5,7),16);

  R = Math.max(0, Math.min(255, R + (R * percent / 100)));
  G = Math.max(0, Math.min(255, G + (G * percent / 100)));
  B = Math.max(0, Math.min(255, B + (B * percent / 100)));

  const RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  const GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  const BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

  return "#"+RR+GG+BB;
}

// Utility function for duration formatting
function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Main Component
const EffectCreatorTab: React.FC<{
  editEffect?: Effect;
  onClose: () => void;
}> = ({ editEffect, onClose }) => {
  const createEffect = useEffectStore(state => state.createEffect);
  const updateEffect = useEffectStore(state => state.updateEffect);

  const [effect, setEffect] = useState<Partial<Effect>>({
    name: '',
    description: '',
    category: 'buffs',
    icon: 'Sparkles',
    color: categoryColors.buffs,
    value: undefined,
    duration: undefined,
    ...editEffect
  });

  // Laden der Daten beim Bearbeiten
  useEffect(() => {
    if (editEffect) {
      setEffect(editEffect);
    }
  }, [editEffect]);

  const handleSave = () => {
    if (!effect.name || !effect.description) {
      alert('Bitte fülle alle Pflichtfelder aus.');
      return;
    }

    if (editEffect) {
      updateEffect(effect as Effect);
    } else {
      createEffect(effect);
    }
    onClose();
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left Column - Form */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">
          {editEffect ? 'Effekt bearbeiten' : 'Neuen Effekt erstellen'}
        </h3>

        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              value={effect.name}
              onChange={(e) => setEffect(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Effekt Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Beschreibung *</label>
            <textarea
              value={effect.description}
              onChange={(e) => setEffect(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg h-24 resize-none"
              placeholder="Beschreibe den Effekt..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kategorie</label>
            <select
              value={effect.category}
              onChange={(e) => setEffect(prev => ({
                ...prev,
                category: e.target.value as EffectCategory,
                color: categoryColors[e.target.value as EffectCategory]
              }))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {Object.keys(categoryColors).map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Wert (%)</label>
              <input
                type="number"
                value={effect.value}
                onChange={(e) => setEffect(prev => ({
                  ...prev,
                  value: e.target.value ? Number(e.target.value) : undefined
                }))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="z.B. 15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Dauer (Sekunden)</label>
              <input
                type="number"
                value={effect.duration}
                onChange={(e) => setEffect(prev => ({
                  ...prev,
                  duration: e.target.value ? Number(e.target.value) : undefined
                }))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="z.B. 300"
              />
            </div>
          </div>
        </div>

        {/* Icon Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Icon</label>
          <IconPicker
            selectedIcon={effect.icon || 'Sparkles'}
            onSelectIcon={(icon) => setEffect(prev => ({ ...prev, icon }))}
          />
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Farbe</label>
          <ColorPicker
            selectedColor={effect.color || categoryColors[effect.category || 'buffs']}
            onSelectColor={(color) => setEffect(prev => ({ ...prev, color }))}
            category={effect.category as EffectCategory || 'buffs'}
          />
        </div>
      </div>

      {/* Right Column - Preview */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Vorschau</h3>
        
        {/* Live Preview */}
        <EffectPreview effect={effect} />

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600
                   flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{editEffect ? 'Aktualisieren' : 'Erstellen'}</span>
        </button>
      </div>
    </div>
  );
};

export default EffectCreatorTab;