import React, { useState } from 'react';
import { Plus, X, Move, ChevronDown } from 'lucide-react';
import type { WidgetElement } from './types';

// 1. Interfaces
interface ElementsTabProps {
  elements: WidgetElement[];
  selectedElement: string | null;
  onAddElement: (type: WidgetElement['type']) => void;
  onUpdateElement: (id: string, updates: Partial<WidgetElement>) => void;
  onRemoveElement: (id: string) => void;
  onSelectElement: (id: string | null) => void;
}

interface ElementListItemProps {
  element: WidgetElement;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

// 2. Konstanten
const ELEMENT_TYPES = [
  { type: 'input', label: 'Textfeld', icon: '🔤' },
  { type: 'number', label: 'Zahlenfeld', icon: '🔢' },
  { type: 'slider', label: 'Schieberegler', icon: '📊' },
  { type: 'select', label: 'Auswahlfeld', icon: '📝' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { type: 'label', label: 'Text Label', icon: '📄' },
] as const;

// 3. ElementListItem Komponente
const ElementListItem: React.FC<ElementListItemProps> = ({
  element,
  isSelected,
  onSelect,
  onRemove,
}) => {
  // Icon basierend auf Element-Typ
  const getElementIcon = () => {
    const type = ELEMENT_TYPES.find(t => t.type === element.type);
    return type?.icon || '📎';
  };

  return (
    <div
      className={`group p-3 border rounded-lg cursor-pointer transition-all hover:border-indigo-200
        ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'}`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-gray-400 group-hover:text-gray-600">
            <Move className="w-4 h-4" />
          </div>
          <span className="text-lg" role="img" aria-label={element.type}>
            {getElementIcon()}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {element.label || `${element.type} Element`}
            </span>
            <span className="text-xs text-gray-500">
              x: {element.position.x}%, y: {element.position.y}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isSelected && (
            <div className="px-2 py-1 text-xs bg-indigo-100 text-indigo-600 rounded">
              Ausgewählt
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Element Details */}
      <div className="mt-2 pl-10 text-xs text-gray-500">
        {element.type === 'input' && element.placeholder && (
          <div>Placeholder: {element.placeholder}</div>
        )}
        {(element.type === 'number' || element.type === 'slider') && (
          <div>
            Bereich: {element.min || 0} - {element.max || 100}
            {element.step && `, Schritte: ${element.step}`}
          </div>
        )}
        {element.type === 'select' && element.options && (
          <div>Optionen: {element.options.length}</div>
        )}
        {element.type === 'label' && (
          <div>Text: {element.text}</div>
        )}
      </div>
    </div>
  );
};

// 4. Haupt-ElementsTab Komponente
export const ElementsTab: React.FC<ElementsTabProps> = ({
  elements,
  selectedElement,
  onAddElement,
  onUpdateElement,
  onRemoveElement,
  onSelectElement,
}) => {
  const [showElementMenu, setShowElementMenu] = useState(false);

  return (
    <div className="flex h-full">
      {/* Element Liste und Hinzufügen-Button */}
      <div className="w-1/2 pr-4 border-r">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Elemente</h3>
          <div className="relative">
            <button
              onClick={() => setShowElementMenu(!showElementMenu)}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 
                         flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Element hinzufügen</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Element-Typ Auswahlmenü */}
            {showElementMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg 
                           border py-2 z-10">
                {ELEMENT_TYPES.map(({ type, label, icon }) => (
                  <button
                    key={type}
                    onClick={() => {
                      onAddElement(type);
                      setShowElementMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Element Liste */}
        <div className="space-y-2 overflow-auto max-h-[calc(100vh-300px)]">
          {elements.map((element) => (
            <ElementListItem
              key={element.id}
              element={element}
              isSelected={selectedElement === element.id}
              onSelect={() => onSelectElement(element.id)}
              onRemove={() => onRemoveElement(element.id)}
            />
          ))}
          
          {elements.length === 0 && (
            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg">
              Fügen Sie Elemente hinzu, um Ihr Widget zu gestalten
            </div>
          )}
        </div>
      </div>

      {/* Element Properties Panel */}
      <div className="w-1/2 pl-4">
        {selectedElement ? (
          <ElementProperties
            element={elements.find(el => el.id === selectedElement)!}
            onUpdateElement={onUpdateElement}
          />
        ) : (
          <div className="text-center py-8 text-gray-400">
            Wählen Sie ein Element aus, um dessen Eigenschaften zu bearbeiten
          </div>
        )}
      </div>
    </div>
  );
};

interface ElementPropertiesProps {
    element: WidgetElement;
    onUpdateElement: (id: string, updates: Partial<WidgetElement>) => void;
  }
  
  const ElementProperties: React.FC<ElementPropertiesProps> = ({
    element,
    onUpdateElement,
  }) => {
    // Hilfsfunktion für Updates
    const updateProperty = <K extends ElementProperty>(
      id: string,
      property: K,
      value: any,
      onUpdateElement: (id: string, updates: Partial<WidgetElement>) => void
    ) => {
      onUpdateElement(id, { [property]: value });
    };
  
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Element Eigenschaften
          </h3>
          <div className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
            {ELEMENT_TYPES.find(t => t.type === element.type)?.label || element.type}
          </div>
        </div>
  
        {/* Basis Eigenschaften */}
        <div className="space-y-4">
          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bezeichnung
            </label>
            <input
              type="text"
              value={element.label}
              onChange={(e) => updateProperty('label', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
  
          {/* Position */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                X-Position (%)
              </label>
              <input
                type="number"
                value={element.position.x}
                onChange={(e) => updateProperty('position', {
                  ...element.position,
                  x: Number(e.target.value)
                })}
                min={0}
                max={100}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Y-Position (%)
              </label>
              <input
                type="number"
                value={element.position.y}
                onChange={(e) => updateProperty('position', {
                  ...element.position,
                  y: Number(e.target.value)
                })}
                min={0}
                max={100}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
  
          {/* Größe */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Breite (%)
              </label>
              <input
                type="number"
                value={element.size.width}
                onChange={(e) => updateProperty('size', {
                  ...element.size,
                  width: Number(e.target.value)
                })}
                min={1}
                max={100}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Höhe (%)
              </label>
              <input
                type="number"
                value={element.size.height}
                onChange={(e) => updateProperty('size', {
                  ...element.size,
                  height: Number(e.target.value)
                })}
                min={1}
                max={100}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
  
          {/* Typ-spezifische Eigenschaften */}
          {renderTypeSpecificProperties()}
        </div>
      </div>
    );
  
    // Funktion für typ-spezifische Eigenschaften
    function renderTypeSpecificProperties() {
      switch (element.type) {
        case 'input':
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platzhaltertext
                </label>
                <input
                  type="text"
                  value={element.placeholder || ''}
                  onChange={(e) => updateProperty('placeholder', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={element.validation?.required || false}
                  onChange={(e) => updateProperty('validation', {
                    ...element.validation,
                    required: e.target.checked
                  })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="text-sm text-gray-700">
                  Pflichtfeld
                </label>
              </div>
            </div>
          );
  
        case 'number':
        case 'slider':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum
                  </label>
                  <input
                    type="number"
                    value={element.min || 0}
                    onChange={(e) => updateProperty('min', Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum
                  </label>
                  <input
                    type="number"
                    value={element.max || 100}
                    onChange={(e) => updateProperty('max', Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Schrittweite
                  </label>
                  <input
                    type="number"
                    value={element.step || 1}
                    onChange={(e) => updateProperty('step', Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          );
  
        case 'select':
          return (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Optionen
              </label>
              {(element.options || []).map((option, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => {
                      const newOptions = [...(element.options || [])];
                      newOptions[index] = { ...option, label: e.target.value };
                      updateProperty('options', newOptions);
                    }}
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => {
                      const newOptions = [...(element.options || [])];
                      newOptions[index] = { ...option, value: e.target.value };
                      updateProperty('options', newOptions);
                    }}
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Wert"
                  />
                  <button
                    onClick={() => {
                      const newOptions = (element.options || []).filter((_, i) => i !== index);
                      updateProperty('options', newOptions);
                    }}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newOptions = [...(element.options || []), { label: '', value: '' }];
                  updateProperty('options', newOptions);
                }}
                className="w-full px-4 py-2 text-indigo-500 border-2 border-dashed 
                         border-indigo-200 rounded-lg hover:border-indigo-500"
              >
                Option hinzufügen
              </button>
            </div>
          );
  
        case 'label':
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text
                </label>
                <input
                  type="text"
                  value={element.text || ''}
                  onChange={(e) => updateProperty('text', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={element.style?.bold || false}
                    onChange={(e) => updateProperty('style', {
                      ...element.style,
                      bold: e.target.checked
                    })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Fett</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={element.style?.italic || false}
                    onChange={(e) => updateProperty('style', {
                      ...element.style,
                      italic: e.target.checked
                    })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Kursiv</span>
                </label>
              </div>
            </div>
          );
  
        default:
          return null;
      }
    }
  };

export default ElementsTab;