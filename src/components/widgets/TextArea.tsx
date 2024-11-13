// src/components/character/TextArea.tsx
import React from 'react';

interface TextAreaProps {
  title: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

const TextArea = ({ title, placeholder, value, onChange }: TextAreaProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-bold">{title}</h3>
      <textarea
        className="w-full h-32 p-2 border rounded-lg"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};

export default TextArea;