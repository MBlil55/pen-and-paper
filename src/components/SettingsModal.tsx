import React, { useState } from 'react';
import { Settings, Database, X, Save, Palette, Layout } from 'lucide-react';
import DataManagement from './DataManagement';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'theme' | 'data'>('general');

  if (!isOpen) return null;

  const tabs = [
    { id: 'general', label: 'Allgemein', icon: Settings },
    { id: 'theme', label: 'Design', icon: Palette },
    { id: 'data', label: 'Datenverwaltung', icon: Database }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Einstellungen</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <div className="w-48 border-r bg-gray-50 p-4">
            <nav className="space-y-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full px-3 py-2 rounded-lg flex items-center space-x-2
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
          <div className="flex-1 p-6 overflow-auto">
            {activeTab === 'general' && (
              <div className="space-y-6">
                {/* Allgemeine Einstellungen */}
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="space-y-6">
                {/* Theme Einstellungen */}
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Datenverwaltung</h3>
                <DataManagement 
                  onComplete={() => {
                    // Optional: Aktualisiere UI oder zeige Erfolgsmeldung
                  }} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;