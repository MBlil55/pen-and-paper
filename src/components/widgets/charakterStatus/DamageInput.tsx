import React from 'react';

interface DamageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  icon: React.ReactNode;
  iconColor: string;
}

const DamageInput: React.FC<DamageInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  icon,
  iconColor
}) => {
  // Handler für die Enter-Taste
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="w-full pl-3 pr-10 py-2 bg-white border border-gray-200 
                   rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      <button
        onClick={onSubmit}
        className={`absolute right-2 top-1/2 -translate-y-1/2
                   p-1 rounded hover:bg-opacity-80 transition-colors ${iconColor}`}
      >
        {icon}
      </button>
    </div>
  );
};

export default DamageInput;