// src/components/character/SkillRow.tsx
import React from 'react';

interface SkillRowProps {
  name: string;
  value: number;
}

const SkillRow = ({ name, value }: SkillRowProps) => {
  return (
    <div className="grid grid-cols-8 gap-2">
      <input
        type="text"
        className="col-span-5 p-1 border rounded text-sm"
        placeholder="Fähigkeit"
        value={name}
        onChange={(e) => {/* TODO: Implement onChange handler */}}
      />
      <input
        type="number"
        className="col-span-2 p-1 border rounded text-sm text-center"
        placeholder="0"
        value={value}
        onChange={(e) => {/* TODO: Implement onChange handler */}}
      />
      <div className="col-span-1 border rounded"></div>
    </div>
  );
};

export default SkillRow;