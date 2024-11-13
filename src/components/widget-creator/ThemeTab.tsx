import React from 'react';
import type { CustomWidget } from './types';

interface ThemeTabProps {
  theme: CustomWidget['theme'];
  onUpdateTheme: (updates: Partial<CustomWidget['theme']>) => void;
}

export const ThemeTab: React.FC<ThemeTabProps> = ({ theme, onUpdateTheme }) => {
  // Vordefinierte Farbpaletten
  const colorPalettes = {
    primary: [
      { color: '#6366f1', name: 'Indigo' },
      { color: '#3b82f6', name: 'Blue' },
      { color: '#10b981', name: 'Emerald' },
      { color: '#f59e0b', name: 'Amber' },
      { color: '#ef4444', name: 'Red' },
      { color: '#8b5cf6', name: 'Purple' }
    ],
    secondary: [
      { color: '#4f46e5', name: 'Indigo Dark' },
      { color: '#2563eb', name: 'Blue Dark' },
      { color: '#059669', name: 'Emerald Dark' },
      { color: '#d97706', name: 'Amber Dark' },
      { color: '#dc2626', name: 'Red Dark' },
      { color: '#7c3aed', name: 'Purple Dark' }
    ],
    background: [
      { color: '#ffffff', name: 'White' },
      { color: '#f3f4f6', name: 'Gray 100' },
      { color: '#f1f5f9', name: 'Slate 100' },
      { color: '#f5f3ff', name: 'Purple 50' },
      { color: '#eef2ff', name: 'Indigo 50' },
      { color: '#f0fdf4', name: 'Emerald 50' }
    ]
  };

  // Handler für Farbänderungen
  const handleColorChange = (key: keyof typeof theme, color: string) => {
    onUpdateTheme({ [key]: color });
  };

  // Komponente für Farbauswahl
  const ColorPicker: React.FC<{
    label: string;
    colors: typeof colorPalettes.primary;
    currentColor: string;
    onChange: (color: string) => void;
  }> = ({ label, colors, currentColor, onChange }) => (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="grid grid-cols-6 gap-2">
        {colors.map(({ color, name }) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-10 h-10 rounded-lg border-2 transition-all group relative
              ${currentColor === color 
                ? 'border-gray-900 scale-110 shadow-md' 
                : 'border-transparent hover:scale-105'}`}
            style={{ backgroundColor: color }}
          >
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full
                           opacity-0 group-hover:opacity-100 text-xs whitespace-nowrap
                           bg-gray-800 text-white px-2 py-1 rounded mt-2 pointer-events-none">
              {name}
            </span>
          </button>
        ))}
        <div className="relative group">
          <input
            type="color"
            value={currentColor}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border-2 border-dashed 
                     border-gray-300 hover:border-gray-400 transition-colors"
          />
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full
                         opacity-0 group-hover:opacity-100 text-xs whitespace-nowrap
                         bg-gray-800 text-white px-2 py-1 rounded mt-2 pointer-events-none">
            Custom Color
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Farbauswahl-Bereiche */}
      <ColorPicker
        label="Primärfarbe"
        colors={colorPalettes.primary}
        currentColor={theme.primary}
        onChange={(color) => handleColorChange('primary', color)}
      />
      
      <ColorPicker
        label="Sekundärfarbe"
        colors={colorPalettes.secondary}
        currentColor={theme.secondary}
        onChange={(color) => handleColorChange('secondary', color)}
      />
      
      <ColorPicker
        label="Hintergrundfarbe"
        colors={colorPalettes.background}
        currentColor={theme.background}
        onChange={(color) => handleColorChange('background', color)}
      />

      {/* Theme-Vorschau */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Vorschau</h3>
        <div 
          className="border rounded-lg p-6 space-y-4 transition-colors"
          style={{ backgroundColor: theme.background }}
        >
          <div className="space-y-4">
            <div className="space-x-4">
              <button
                className="px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: theme.primary }}
              >
                Primärer Button
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: theme.secondary }}
              >
                Sekundärer Button
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div
                className="p-4 rounded-lg"
                style={{ 
                  backgroundColor: theme.primary,
                  opacity: 0.1
                }}
              >
                Primärer Hintergrund
              </div>
              <div
                className="p-4 rounded-lg"
                style={{ 
                  backgroundColor: theme.secondary,
                  opacity: 0.1
                }}
              >
                Sekundärer Hintergrund
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 
                className="text-lg font-medium mb-2" 
                style={{ color: theme.primary }}
              >
                Überschrift
              </h4>
              <p className="text-gray-600">
                Beispieltext für die Vorschau des Themes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeTab;