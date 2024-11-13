import React from 'react';
import { Camera } from 'lucide-react';

interface InfoFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-sm text-gray-500">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    />
  </div>
);

const CharacterInfoWidget = () => {
  const [characterInfo, setCharacterInfo] = React.useState({
    name: '',
    gender: '',
    age: '',
    stature: '',
    religion: '',
    profession: '',
    familyStatus: ''
  });

  const updateField = (field: string, value: string) => {
    setCharacterInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <input
            type="text"
            value={characterInfo.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Charaktername"
            className="w-full text-2xl font-bold bg-transparent border-b-2 border-indigo-200 focus:border-indigo-600 outline-none px-2 py-1"
          />
        </div>
        <div className="border-2 border-dashed border-indigo-200 rounded-xl p-4 flex flex-col items-center justify-center">
          <Camera className="w-8 h-8 text-indigo-300" />
          <span className="text-sm text-indigo-400 mt-2">Portrait</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InfoField
          label="Geschlecht"
          value={characterInfo.gender}
          onChange={(value) => updateField('gender', value)}
        />
        <InfoField
          label="Alter"
          value={characterInfo.age}
          onChange={(value) => updateField('age', value)}
        />
        <InfoField
          label="Statur"
          value={characterInfo.stature}
          onChange={(value) => updateField('stature', value)}
        />
        <InfoField
          label="Religion"
          value={characterInfo.religion}
          onChange={(value) => updateField('religion', value)}
        />
        <InfoField
          label="Beruf"
          value={characterInfo.profession}
          onChange={(value) => updateField('profession', value)}
        />
        <InfoField
          label="Familienstand"
          value={characterInfo.familyStatus}
          onChange={(value) => updateField('familyStatus', value)}
        />
      </div>
    </div>
  );
};

export default CharacterInfoWidget;