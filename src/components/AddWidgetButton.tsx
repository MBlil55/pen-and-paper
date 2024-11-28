import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddWidgetButtonProps {
  onAdd: (type: string) => void;
}

const WIDGET_TYPES = {
  CHARACTER_INFO: 'characterInfo',
  CHARACTER_STATUS: 'characterStatus', // Neuer Typ hinzugefügt
  SKILL_TREE: 'skillTree',
  DICE: 'dice',
  DAMAGE: 'damage',
  NOTES: 'notes',
  HEALTH: 'health',
  GEAR: 'gear'
};

const AddWidgetButton: React.FC<AddWidgetButtonProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 flex items-center"
      >
        <Plus className="w-4 h-4 mr-2" />
        Widget hinzufügen
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
          {Object.entries(WIDGET_TYPES).map(([key, type]) => (
            <button
              key={key}
              onClick={() => {
                onAdd(type);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-gray-700"
            >
              {type.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddWidgetButton;