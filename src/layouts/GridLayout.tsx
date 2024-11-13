import React, { useState, useEffect, useCallback} from 'react';
import GridLayout from 'react-grid-layout';
import { Widget, AddWidgetButton } from '../types';
import { WidgetCreator } from '../components/widget-creator';
import { loadLayout, saveLayout } from '../utils/layoutPersistence';
import { Plus } from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

interface CustomWidgetConfig {
    size?: {
      width: number;
      height: number;
    };
    elements?: any[];
    name?: string;
    type?: string;
  }

const ModernCharacterSheet = () => {
  const [layouts, setLayouts] = useState(loadLayout());
  const [showWidgetCreator, setShowWidgetCreator] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [activeWidget, setActiveWidget] = useState(null);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [resizingWidget, setResizingWidget] = useState<string | null>(null);

  useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById('grid-container');
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleDragStart = (layout, oldItem, newItem) => {
    document.body.classList.add('dragging-widget');
    setActiveWidget(newItem.i);
  };

  const handleDragStop = useCallback((layout: Layout[], oldItem: Layout, newItem: Layout) => {
    document.body.classList.remove('dragging-widget');
    setDraggedWidget(null);
    
    const updatedLayouts = layouts.map(widget => {
      const newPos = layout.find(l => l.i === widget.i);
      return newPos ? { ...widget, ...newPos } : widget;
    });
    
    setLayouts(updatedLayouts);
    saveLayout(updatedLayouts);
  }, [layouts]);

  const addWidget = useCallback((type: string) => {
    const newWidget = {
      i: `${type}-${Date.now()}`,
      x: (layouts.length * 2) % 12,
      y: Infinity,
      w: 3,
      h: 4,
      type
    };
    setLayouts(prev => [...prev, newWidget]);
  }, [layouts]);

  const removeWidget = useCallback((widgetId: string) => {
    const updatedLayouts = layouts.filter(l => l.i !== widgetId);
    setLayouts(updatedLayouts);
    saveLayout(updatedLayouts); // Speichern der aktualisierten Layouts
  }, [layouts]);

  const onLayoutChange = (newLayout) => {
    if (!activeWidget) {
      const updatedLayouts = layouts.map(widget => {
        const newPos = newLayout.find(l => l.i === widget.i);
        return { ...widget, ...newPos };
      });
      setLayouts(updatedLayouts);
    }
  };

  const handleCustomWidgetSave = useCallback((widgetConfig: CustomWidgetConfig) => {
    try {
      const newWidget = {
        i: `custom-${Date.now()}`,
        x: (layouts.length * 2) % 12,
        y: Infinity,
        w: widgetConfig.size?.width || 3,
        h: widgetConfig.size?.height || 4,
        type: 'custom',
        config: widgetConfig
      };
      setLayouts(prev => [...prev, newWidget]);
      setShowWidgetCreator(false);
    } catch (error) {
      console.error('Fehler beim Speichern des Custom Widgets:', error);
    }
  }, [layouts]);

  useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById('grid-container');
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <nav className="bg-white shadow-lg rounded-xl mb-6">
        <div className="max-w-full mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <span className="text-xl font-bold text-indigo-600">How to be a Hero</span>
            <div className="flex space-x-4">
              <AddWidgetButton onAdd={addWidget} />
              <button
                onClick={() => setShowWidgetCreator(true)}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Custom Widget</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div id="grid-container" className="max-w-full">
        <GridLayout
          className="layout"
          layout={layouts}
          cols={12}
          rowHeight={100}
          width={containerWidth}
          onLayoutChange={onLayoutChange}
          onDragStart={handleDragStart}
          onDragStop={handleDragStop}
          isResizable={true}
          isDraggable={true}
          draggableHandle=".widget-handle"
          draggableCancel=".widget-content"
          preventCollision={true}
          compactType={null}
          margin={[16, 16]}
          useCSSTransforms={true}
        >
          {layouts.map(widget => (
            <div
              key={widget.i}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200
                        ${activeWidget === widget.i ? 'scale-[1.02] shadow-2xl' : ''}`}
            >
              <Widget
                widget={widget}
                onRemove={() => removeWidget(widget.i)}
              />
            </div>
          ))}
        </GridLayout>
      </div>

      {showWidgetCreator && (
        <WidgetCreator
          onClose={() => setShowWidgetCreator(false)}
          onSave={handleCustomWidgetSave}
          availableElements={layouts}
        />
      )}
    </div>
  );
};

export default ModernCharacterSheet;