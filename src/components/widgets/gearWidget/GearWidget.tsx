// components/widgets/gearWidget/GearWidget.tsx
import React, { useState } from 'react';
import { useGearStore } from './store/useGearStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { 
  Sword, 
  Scroll, 
  BadgePercent,
  Settings,
  RefreshCw
} from 'lucide-react';
import { EquipmentSection } from './EquipmentSection';
import { DamageCalculator } from './DamageCalculator';

const GearWidget: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const resetStore = useGearStore(state => state.reset);

  // UI Helper
  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'gear':
        return Sword;
      case 'abilities':
        return Scroll;
      case 'effects':
        return BadgePercent;
      default:
        return Sword;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[600px]">
      {/* Header */}
      <div className="border-b bg-gray-50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Ausrüstung & Fähigkeiten
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg 
                       hover:bg-gray-100"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={resetStore}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg 
                       hover:bg-gray-100"
              title="Zurücksetzen"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Tabs defaultValue="gear" className="w-full">
          <TabsList className="w-full bg-white/50 p-1 rounded-lg">
            {['gear', 'abilities', 'effects'].map(tab => {
              const Icon = getTabIcon(tab);
              return (
                <TabsTrigger 
                  key={tab}
                  value={tab}
                  className="flex-1 flex items-center gap-2 capitalize"
                >
                  <Icon className="w-4 h-4" />
                  {tab === 'gear' ? 'Ausrüstung' : 
                   tab === 'abilities' ? 'Fähigkeiten' : 'Effekte'}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs defaultValue="gear">
          <div className="grid grid-cols-5 gap-6">
            {/* Left Column: Equipment/Abilities Management */}
            <div className="col-span-3">
              <TabsContent value="gear" className="mt-0">
                <EquipmentSection />
              </TabsContent>
              
              <TabsContent value="abilities" className="mt-0">
                <div className="text-center py-12 text-gray-500">
                  <Scroll className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    Fähigkeiten kommen bald
                  </h3>
                  <p className="text-sm">
                    Dieser Bereich wird in einem zukünftigen Update verfügbar sein.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="effects" className="mt-0">
                <div className="text-center py-12 text-gray-500">
                  <BadgePercent className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    Effekte kommen bald
                  </h3>
                  <p className="text-sm">
                    Dieser Bereich wird in einem zukünftigen Update verfügbar sein.
                  </p>
                </div>
              </TabsContent>
            </div>

            {/* Right Column: Damage Calculator */}
            <div className="col-span-2">
              <DamageCalculator />
            </div>
          </div>
        </Tabs>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Einstellungen</h3>
            
            {/* Import/Export */}
            <div className="space-y-4">
              <button
                onClick={() => {/* Export Logic */}}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg
                         hover:bg-gray-200 flex items-center justify-center gap-2"
              >
                Daten exportieren
              </button>
              
              <button
                onClick={() => {/* Import Logic */}}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg
                         hover:bg-gray-200 flex items-center justify-center gap-2"
              >
                Daten importieren
              </button>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg
                         hover:bg-indigo-600"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GearWidget;