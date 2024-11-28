import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Filter, AlertCircle } from 'lucide-react';
import { useGearStore } from './store/useGearStore';
import { EquipmentItem } from './EquipmentItem';
import { AddItemModal } from './AddItemModal';
import type { GearItem } from './store/useGearStore';

export const EquipmentSection: React.FC = () => {
  // State Management - Optimiert um unnötige Re-Renders zu vermeiden
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  // Store Selektoren - Optimiert mit spezifischen Selektoren
  const items = useGearStore(useCallback(state => state.items, []));
  const toggleItem = useGearStore(useCallback(state => state.toggleItem, []));

  // Memoized Filter Logik
  const filteredItems = useMemo(() => {
    return filterActive === null 
      ? items 
      : items.filter(item => item.isActive === filterActive);
  }, [items, filterActive]);

  // Memoized Item Gruppierung
  const { activeItems, inactiveItems } = useMemo(() => ({
    activeItems: filteredItems.filter(item => item.isActive),
    inactiveItems: filteredItems.filter(item => !item.isActive)
  }), [filteredItems]);

  // Event Handlers mit useCallback um Referenz-Stabilität zu gewährleisten
  const handleToggleAll = useCallback((shouldBeActive: boolean) => {
    items.forEach(item => {
      if (item.isActive !== shouldBeActive) {
        toggleItem(item.id);
      }
    });
  }, [items, toggleItem]);

  const handleFilterChange = useCallback(() => {
    setFilterActive(prev => 
      prev === null ? true : 
      prev === true ? false : null
    );
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  // Memoized Render-Funktionen
  const renderItemList = useCallback((items: GearItem[]) => (
    <div className="space-y-3">
      {items.map(item => (
        <EquipmentItem 
          key={item.id} 
          itemId={item.id}
        />
      ))}
    </div>
  ), []);

  const renderEmptyState = useCallback(() => (
    <div className="text-center py-12">
      <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Keine Ausrüstung vorhanden
      </h3>
      <p className="text-sm text-gray-500">
        Fügen Sie Ihre erste Ausrüstung hinzu.
      </p>
    </div>
  ), []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Ausrüstung</h3>
        <div className="flex gap-2">
          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={handleFilterChange}
              className="px-3 py-1.5 bg-white border rounded-lg hover:bg-gray-50 
                       flex items-center gap-2 text-sm"
            >
              <Filter className="w-4 h-4" />
              <span>
                {filterActive === null ? 'Alle' : 
                 filterActive ? 'Aktiv' : 'Inaktiv'}
              </span>
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleOpenModal}
            className="px-3 py-1.5 bg-indigo-500 text-white rounded-lg 
                     hover:bg-indigo-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Hinzufügen</span>
          </button>
        </div>
      </div>

      {/* Active Items Section */}
      {activeItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700">
              Aktive Ausrüstung ({activeItems.length})
            </h4>
            <button
              onClick={() => handleToggleAll(false)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Alle deaktivieren
            </button>
          </div>
          {renderItemList(activeItems)}
        </div>
      )}

      {/* Inactive Items Section */}
      {inactiveItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700">
              Inaktive Ausrüstung ({inactiveItems.length})
            </h4>
            <button
              onClick={() => handleToggleAll(true)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Alle aktivieren
            </button>
          </div>
          {renderItemList(inactiveItems)}
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && renderEmptyState()}

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <AddItemModal onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default EquipmentSection;