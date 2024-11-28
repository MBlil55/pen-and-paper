// components/gear/EquipmentItem.tsx
import React, { useState, } from "react";
import { Eye, EyeOff, Sword, Shield, Crown, Edit, Trash2 } from 'lucide-react';
import { useGearStore, GearItem } from './store/useGearStore';
import {AddItemModal} from './AddItemModal'

interface EquipmentItemProps {
  itemId: string;
}

const getItemIcon = (type: GearItem['type']) => {
  switch (type) {
    case 'weapon':
      return Sword;
    case 'armor':
      return Shield;
    case 'accessory':
      return Crown;
    default:
      return Sword;
  }
};

export const EquipmentItem: React.FC<EquipmentItemProps> = ({ itemId }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const item = useGearStore(state => 
    state.items.find(item => item.id === itemId)
  );
  const toggleItem = useGearStore(state => state.toggleItem);
  const removeItem = useGearStore(state => state.removeItem);
  

  //Debuglogg for Edit Button
  const handleEditClick = (e: React.MouseEvent) => {
    setShowEditModal(true);
  };
  

  if (!item) return null;

  const Icon = getItemIcon(item.type);
  
  const getDiceString = () => {
    if (!item.damage) return '';
    const diceStr = item.damage.dice
      .map(d => `${d.count}W${d.sides}`)
      .join(' + ');
    return `${diceStr}${item.damage.modifier ? ` + ${item.damage.modifier}` : ''}`;
  };

  const handleToggle = () => {
    toggleItem(item.id);
  };

  const getStatusColor = () => {
    if (!item.isActive) return 'bg-gray-100 text-gray-500 hover:bg-gray-200';
    return 'bg-green-100 text-green-600 hover:bg-green-200';
  };

  return (
    <div className={`
      bg-white border rounded-xl p-6 hover:bg-gray-50 relative group
      transition-all duration-300 ${item.isActive ? 'border-indigo-200' : 'border-gray-200'}
    `}>
      {/* Main Content */}
      <div className="flex gap-5 items-start">
        {/* Item Icon */}
        <div className={`
          w-8 h-8 rounded-xl flex items-center justify-center
          transition-all duration-300 shadow-sm
          ${item.isActive 
            ? 'bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600' 
            : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400'}
        `}>
          <Icon className="w-8 h-8 transform transition-transform group-hover:scale-110" />
        </div>

        {/* Item Details */}
        <div className="flex-1 space-y-2">
          {/* Title and Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h4 className="font-semibold text-pretty text-gray-900">{item.name}</h4>
              <span className={`
                px-2.5 py-1 rounded-full text-xs font-medium
                transition-colors duration-300
                ${item.isActive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'}
              `}>
                {item.isActive ? 'Aktiv' : 'Inaktiv'}
              </span>
            </div>
          </div>

          {/* Stats Display */}
          <div className="space-y-2">
            {/* Weapon Stats */}
            {item.type === 'weapon' && item.damage && (
              <div className="flex items-center gap-2 text-gray-600">
                <Sword className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Schaden: {getDiceString()}
                </span>
              </div>
            )}

            {/* Armor/Accessory Stats */}
            {(item.type === 'armor' || item.type === 'accessory') && item.stats && (
              <div className="flex flex-wrap gap-2">
                {item.stats.health !== 0 && (
                  <span className="inline-flex items-center px-1.5 py-1 rounded-lg 
                                 text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    +{item.stats.health} Lebenspunkte
                  </span>
                )}
                {item.stats.armor !== 0 && (
                  <span className="inline-flex items-center px-1.5 py-1 rounded-lg 
                                 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    +{item.stats.armor} Rüstung
                  </span>
                )}
              </div>
            )}

            {/* Effects */}
            {item.effects && item.effects.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {item.effects.map((effect) => (
                  <span
                    key={effect.id}
                    className={`
                      px-1.5 py-1 rounded-lg text-xs font-medium
                      ${effect.type === 'percentage'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'}
                    `}
                  >
                    {effect.name}
                    {effect.value > 0 && ` +${effect.value}${effect.type === 'percentage' ? '%' : ''}`}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`
        absolute right-4 top-4 flex items-center gap-2
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
      `}>
        <button
          onClick={handleToggle}
          className={`
            p-2 rounded-lg transition-colors duration-200
            ${getStatusColor()}
          `}
          title={item.isActive ? 'Deaktivieren' : 'Aktivieren'}
        >
          {item.isActive ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={handleEditClick}
          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 
                   rounded-lg transition-colors duration-200"
          title="Bearbeiten"
        >
          <Edit className="w-4 h-4" />
        </button>

        <button
          onClick={() => removeItem(item.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 
                   rounded-lg transition-colors duration-200"
          title="Entfernen"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <AddItemModal
          editItem={item}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default EquipmentItem;