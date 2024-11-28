// src/components/widgets/CharacterStatusModals.tsx
import React, { useState } from 'react';
import { Upload, Link as LinkIcon } from 'lucide-react';

// Upload Modal Komponente
interface UploadModalProps {
  onClose: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlUpload: (url: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const UploadModal: React.FC<UploadModalProps> = ({
  onClose,
  onFileUpload,
  onUrlUpload,
  fileInputRef
}) => {
  const [url, setUrl] = useState('');
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Portrait hochladen</h3>
        
        {/* Upload Type Selector */}
        <div className="flex space-x-4 mb-4">
          <button
            className={`flex-1 py-2 px-4 rounded-lg ${
              uploadType === 'file'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setUploadType('file')}
          >
            <Upload className="w-4 h-4 inline-block mr-2" />
            Datei
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-lg ${
              uploadType === 'url'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setUploadType('url')}
          >
            <LinkIcon className="w-4 h-4 inline-block mr-2" />
            URL
          </button>
        </div>

        {/* Upload Content */}
        {uploadType === 'file' ? (
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg
                       flex flex-col items-center justify-center hover:border-indigo-500
                       hover:bg-indigo-50 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500 mt-2">
                Klicken zum Auswählen
              </span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Bild-URL eingeben"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button
              onClick={() => url && onUrlUpload(url)}
              className="w-full py-2 px-4 bg-indigo-500 text-white rounded-lg
                       hover:bg-indigo-600 disabled:opacity-50"
              disabled={!url}
            >
              Bild laden
            </button>
          </div>
        )}

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg
                   hover:bg-gray-200"
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
};

// Config Modal Komponente
interface ConfigModalProps {
  title: string;
  current: number;
  onChange: (value: number) => void;
  onClose: () => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  title,
  current,
  onChange,
  onClose
}) => {
  const [value, setValue] = useState(current.toString());

  const handleSubmit = () => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      onChange(numValue);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Maximaler Wert</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              min="1"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              className="flex-1 py-2 px-4 bg-indigo-500 text-white rounded-lg
                       hover:bg-indigo-600 disabled:opacity-50"
              disabled={!value || parseInt(value) < 1}
            >
              Speichern
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg
                       hover:bg-gray-200"
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UploadModal, ConfigModal };