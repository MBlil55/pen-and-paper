import React, { useState } from 'react';
import { Upload, Download, Trash2, AlertTriangle } from 'lucide-react';
import DataManagementService from '../services/DataManagementService';

interface DataManagementProps {
  onComplete?: () => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({ onComplete }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const dataService = DataManagementService.getInstance();

  // Export Handler
  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError(null);
      
      const exportData = await dataService.exportData();
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      // Erstelle Download Link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `character-data-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess('Export erfolgreich');
      onComplete?.();
    } catch (err) {
      setError('Export fehlgeschlagen');
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  // Import Handler
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      setError(null);

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importData = JSON.parse(e.target?.result as string);
          await dataService.importData(importData);
          setSuccess('Import erfolgreich');
          onComplete?.();
        } catch (err) {
          setError('Import fehlgeschlagen: Ungültige Datei');
          console.error(err);
        } finally {
          setIsImporting(false);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      setError('Import fehlgeschlagen');
      setIsImporting(false);
      console.error(err);
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    try {
      await dataService.deleteAllData();
      setSuccess('Alle Daten wurden gelöscht');
      setShowDeleteConfirm(false);
      onComplete?.();
    } catch (err) {
      setError('Löschen fehlgeschlagen');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 
                   text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Exportiere...' : 'Daten exportieren'}
        </button>

        {/* Import Button */}
        <label className="flex items-center justify-center gap-2 px-4 py-2 
                        bg-green-500 text-white rounded-lg hover:bg-green-600 
                        cursor-pointer disabled:opacity-50">
          <Upload className="w-4 h-4" />
          {isImporting ? 'Importiere...' : 'Daten importieren'}
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={isImporting}
            className="hidden"
          />
        </label>

        {/* Delete Button */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 
                   bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <Trash2 className="w-4 h-4" />
          Alle Daten löschen
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center 
                      justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Alle Daten löschen?</h3>
            <p className="text-gray-600 mb-6">
              Diese Aktion kann nicht rückgängig gemacht werden. Alle Charakter-Daten 
              werden unwiderruflich gelöscht.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg 
                         hover:bg-red-600"
              >
                Endgültig löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManagement;