import React from 'react';
import { ChevronUp, Menu, ArrowDown } from 'lucide-react';
import type { CustomWidget, WidgetElement } from './types';

interface WidgetPreviewProps {
  widget: CustomWidget;
  selectedElement: string | null;
  onSelectElement: (id: string | null) => void;
}

interface PreviewElementProps {
  element: WidgetElement;
  theme: CustomWidget['theme'];
}

// Komponente für einzelne Vorschau-Elemente
const PreviewElement: React.FC<PreviewElementProps> = ({ element, theme }) => {
  const getBaseStyles = () => {
    return {
      width: '100%',
      height: '100%',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      backgroundColor: 'white',
      transition: 'all 0.2s ease'
    };
  };

  switch (element.type) {
    case 'input':
      return (
        <div className="relative" style={getBaseStyles()}>
          {element.label && (
            <label className="absolute -top-6 left-0 text-sm text-gray-600">
              {element.label}
            </label>
          )}
          <input
            type="text"
            placeholder={element.placeholder}
            className="w-full h-full px-3 rounded-lg cursor-not-allowed bg-gray-50"
            disabled
          />
        </div>
      );

    case 'number':
      return (
        <div className="relative" style={getBaseStyles()}>
          {element.label && (
            <label className="absolute -top-6 left-0 text-sm text-gray-600">
              {element.label}
            </label>
          )}
          <div className="relative w-full h-full">
            <input
              type="number"
              className="w-full h-full px-3 rounded-lg cursor-not-allowed bg-gray-50"
              disabled
            />
            <div className="absolute right-0 inset-y-0 flex flex-col border-l">
              <button className="flex-1 px-2 hover:bg-gray-100 disabled:opacity-50" disabled>
                <ChevronUp className="w-4 h-4" />
              </button>
              <button className="flex-1 px-2 hover:bg-gray-100 border-t disabled:opacity-50" disabled>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );

    case 'slider':
      return (
        <div className="relative" style={getBaseStyles()}>
          {element.label && (
            <label className="absolute -top-6 left-0 text-sm text-gray-600">
              {element.label}
            </label>
          )}
          <div className="w-full h-full flex items-center px-3">
            <input
              type="range"
              min={element.min}
              max={element.max}
              step={element.step}
              className="w-full cursor-not-allowed"
              disabled
            />
          </div>
        </div>
      );

    case 'select':
      return (
        <div className="relative" style={getBaseStyles()}>
          {element.label && (
            <label className="absolute -top-6 left-0 text-sm text-gray-600">
              {element.label}
            </label>
          )}
          <div className="relative w-full h-full">
            <select 
              className="w-full h-full px-3 rounded-lg appearance-none cursor-not-allowed bg-gray-50"
              disabled
            >
              <option>{element.label || 'Bitte wählen...'}</option>
            </select>
            <div className="absolute right-3 inset-y-0 flex items-center pointer-events-none">
              <Menu className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      );

    case 'checkbox':
      return (
        <div className="relative flex items-center" style={getBaseStyles()}>
          <input
            type="checkbox"
            className="w-4 h-4 rounded cursor-not-allowed"
            disabled
          />
          <label className="ml-2 text-sm text-gray-600">
            {element.label}
          </label>
        </div>
      );

    case 'label':
      return (
        <div
          className="flex items-center px-3"
          style={{
            ...getBaseStyles(),
            fontWeight: element.style?.bold ? 'bold' : 'normal',
            fontStyle: element.style?.italic ? 'italic' : 'normal',
            color: element.style?.color || theme.primary,
            backgroundColor: 'transparent',
            border: 'none'
          }}
        >
          {element.text}
        </div>
      );

    default:
      return null;
  }
};

// Hauptkomponente für die Widget-Vorschau
export const WidgetPreview: React.FC<WidgetPreviewProps> = ({
  widget,
  selectedElement,
  onSelectElement
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Live Vorschau</h3>
      
      <div 
        className="border rounded-lg overflow-hidden shadow-sm"
        style={{ backgroundColor: widget.theme.background }}
      >
        {/* Widget Header */}
        <div 
          className="p-4 border-b flex items-center justify-between"
          style={{ backgroundColor: widget.theme.primary + '10' }}
        >
          <div className="font-medium text-gray-900">
            {widget.name || 'Neues Widget'}
          </div>
          {widget.description && (
            <div className="text-sm text-gray-500">
              {widget.description}
            </div>
          )}
        </div>

        {/* Widget Content */}
        <div 
          className="relative p-4" 
          style={{ 
            height: '400px',
            backgroundColor: widget.theme.background 
          }}
        >
          {widget.elements.map((element) => (
            <div
              key={element.id}
              className={`absolute transition-all duration-200 ${
                selectedElement === element.id 
                  ? 'ring-2 ring-offset-2 ring-indigo-500' 
                  : 'hover:ring-2 hover:ring-offset-2 hover:ring-indigo-200'
              }`}
              style={{
                left: `${element.position.x}%`,
                top: `${element.position.y}%`,
                width: `${element.size.width}%`,
                height: `${element.size.height}%`,
                cursor: 'pointer'
              }}
              onClick={() => onSelectElement(element.id)}
            >
              <PreviewElement 
                element={element} 
                theme={widget.theme} 
              />
            </div>
          ))}

          {/* Empty State */}
          {widget.elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Fügen Sie Elemente hinzu, um das Widget zu gestalten
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WidgetPreview;