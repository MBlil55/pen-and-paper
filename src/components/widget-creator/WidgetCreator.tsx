import React, { useState, useCallback } from 'react';
import { Plus, X, Save, Layout, Palette } from 'lucide-react';
import { ThemeTab } from './ThemeTab';
import { ElementsTab } from './ElementsTab';
import { WidgetPreview } from './WidgetPreview';
import type { CustomWidget, WidgetElement } from './types';

interface WidgetCreatorProps {
  onClose: () => void;
  onSave: (widget: CustomWidget) => void;
  initialWidget?: CustomWidget;
}

export const WidgetCreator: React.FC<WidgetCreatorProps> = ({
  onClose,
  onSave,
  initialWidget
}) => {
  // State Management
  const [widget, setWidget] = useState<CustomWidget>(initialWidget || {
    id: `widget-${Date.now()}`,
    name: 'Neues Widget',
    description: '',
    size: { width: 2, height: 2 },
    elements: [],
    theme: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      background: '#ffffff'
    }
  });

  const [activeTab, setActiveTab] = useState<'layout' | 'elements' | 'theme'>('layout');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  // Layout Management
  const handleLayoutChange = useCallback((updates: Partial<CustomWidget>) => {
    setWidget(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Element Management
  const addElement = useCallback((type: WidgetElement['type']) => {
    const newElement: WidgetElement = {
      id: `element-${Date.now()}`,
      type,
      label: `Neues ${type}`,
      position: { x: 10, y: 10 },
      size: { width: 30, height: type === 'label' ? 10 : 15 }
    };

    setWidget(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
    setSelectedElement(newElement.id);
  }, []);

  const updateElement = useCallback((elementId: string, updates: Partial<WidgetElement>) => {
    setWidget(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        el.id === elementId ? { ...el, ...updates } : el
      )
    }));
  }, []);

  const removeElement = useCallback((elementId: string) => {
    setWidget(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId)
    }));
    setSelectedElement(null);
  }, []);

  // Render Functions
  const renderLayoutTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Widget Name
          </label>
          <input
            type="text"
            value={widget.name}
            onChange={(e) => handleLayoutChange({ name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Widget Name eingeben"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Beschreibung
          </label>
          <input
            type="text"
            value={widget.description}
            onChange={(e) => handleLayoutChange({ description: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Optionale Beschreibung"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Breite (Grid Units)
          </label>
          <input
            type="number"
            value={widget.size.width}
            onChange={(e) => handleLayoutChange({ 
              size: { ...widget.size, width: Number(e.target.value) }
            })}
            min={1}
            max={12}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Höhe (Grid Units)
          </label>
          <input
            type="number"
            value={widget.size.height}
            onChange={(e) => handleLayoutChange({ 
              size: { ...widget.size, height: Number(e.target.value) }
            })}
            min={1}
            max={12}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'layout':
        return renderLayoutTab();
      case 'elements':
        return (
          <ElementsTab
            elements={widget.elements}
            selectedElement={selectedElement}
            onAddElement={addElement}
            onUpdateElement={updateElement}
            onRemoveElement={removeElement}
            onSelectElement={setSelectedElement}
          />
        );
      case 'theme':
        return (
          <ThemeTab
            theme={widget.theme}
            onUpdateTheme={(updates) => handleLayoutChange({ theme: { ...widget.theme, ...updates } })}
          />
        );
      default:
        return null;
    }
  };

  // Navigation Items
  const navItems = [
    { id: 'layout', icon: Layout, label: 'Layout' },
    { id: 'elements', icon: Plus, label: 'Elemente' },
    { id: 'theme', icon: Palette, label: 'Design' }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Widget Creator</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            aria-label="Schließen"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex min-h-0">
          {/* Navigation */}
          <div className="w-48 border-r bg-gray-50 p-4">
            <nav className="space-y-2">
              {navItems.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors
                    ${activeTab === id 
                      ? 'bg-indigo-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex min-h-0">
            {/* Editor */}
            <div className="flex-1 p-6 overflow-auto">
              {renderContent()}
            </div>

            {/* Preview */}
            <div className="w-96 border-l p-6 overflow-auto">
              <WidgetPreview
                widget={widget}
                selectedElement={selectedElement}
                onSelectElement={setSelectedElement}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {widget.elements.length} Element{widget.elements.length !== 1 ? 'e' : ''}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Abbrechen
            </button>
            <button
              onClick={() => onSave(widget)}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600
                       flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Widget speichern</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetCreator;