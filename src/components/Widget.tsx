import React, { useState } from 'react';
import { GripVertical, X, Maximize2, Minimize2 } from 'lucide-react';
import {
  CharacterInfoWidget,
  CharacterStatusWidget,
  SkillTreeWidget,
  DiceWidget,
  DamageWidget,
  HealthWidget,
  NotesWidget
} from './widgets';

interface WidgetProps {
  widget: {
    i: string;
    type: string;
    title?: string;
    colorScheme?: string;
  };
  onRemove: () => void;
}

type WidgetType = 
  | 'characterInfo'
  | 'characterStatus'
  | 'skillTree'
  | 'dice'
  | 'damage'
  | 'health'
  | 'notes';

const Widget: React.FC<WidgetProps> = ({ widget, onRemove }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  // Type Guard Funktion
  const isWidgetType = (type: string): type is WidgetType => {
    return [
      'characterInfo',
      'characterStatus',
      'skillTree',
      'dice',
      'damage',
      'health',
      'notes'
    ].includes(type);
  };

  const renderContent = () => {
    if (isMinimized) return null;

    // Verwende den Type Guard
    if (!isWidgetType(widget.type)) {
      console.warn(`Unknown widget type: ${widget.type}`);
      return null;
    }

    // Jetzt weiß TypeScript, dass widget.type eine gültige WidgetType ist
    switch (widget.type) {
      case 'characterInfo':
        return <CharacterInfoWidget />;
      case 'characterStatus':
        return <CharacterStatusWidget />;
      case 'skillTree':
        return <SkillTreeWidget title={widget.title || ''} colorScheme={widget.colorScheme || 'gray'} />;
      case 'dice':
        return <DiceWidget />;
      case 'damage':
        return <DamageWidget />;
      case 'health':
        return <HealthWidget />;
      case 'notes':
        return <NotesWidget />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="widget-handle bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GripVertical className="w-4 h-4 text-gray-400" />
          <h3 className="font-bold text-gray-700">
            {widget.title || widget.type.replace(/([A-Z])/g, ' $1').trim()}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-400 hover:text-gray-600"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default Widget;