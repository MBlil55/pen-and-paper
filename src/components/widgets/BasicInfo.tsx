// src/components/character/BasicInfo.tsx
import React from 'react';
import { Camera } from 'lucide-react';

const BasicInfo = () => {
  return (
    <div>
      {/* Name and Portrait Section */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px]">
          <Camera className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-500 mt-2">Portrait</span>
        </div>
      </div>

      {/* Character Details Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Geschlecht"
          className="p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Alter"
          className="p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Lebenspunkte"
          className="p-2 border rounded-lg"
        />
        
        <input
          type="text"
          placeholder="Statur"
          className="p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Religion"
          className="p-2 border rounded-lg col-span-2"
        />
        
        <input
          type="text"
          placeholder="Beruf"
          className="p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Familienstand"
          className="p-2 border rounded-lg col-span-2"
        />
      </div>
    </div>
  );
};

export default BasicInfo;