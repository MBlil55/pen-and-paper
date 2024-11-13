import React, { useState, useEffect } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  value: number;
  bonus: number;
  finalValue: number;
}

interface SkillTreeProps {
  title: string;
  colorScheme: string;
}

interface SavedSkillTreeData {
  skills: Skill[];
  manualBonus: number;
  treeBonus: number;
}

const getInitialData = (title: string): SavedSkillTreeData => {
  try {
    const savedData = localStorage.getItem(`skillTree-${title.toLowerCase()}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log('Geladene Daten:', parsedData);
      return parsedData;
    }
  } catch (error) {
    console.error('Fehler beim Laden der initialen Daten:', error);
  }
  return {
    skills: [],
    manualBonus: 0,
    treeBonus: 0
  };
};

const SkillTreeWidget: React.FC<SkillTreeProps> = ({ title, colorScheme }) => {
  // Initialisiere State mit gespeicherten Daten
  const initialData = getInitialData(title);
  const [skills, setSkills] = useState<Skill[]>(initialData.skills);
  const [treeBonus, setTreeBonus] = useState(initialData.treeBonus);
  const [manualBonus, setManualBonus] = useState(initialData.manualBonus);
  const maxPoints = 400;
  const storageKey = `skillTree-${title.toLowerCase()}`;

  // Speichern der Daten
  const saveData = (
    updatedSkills: Skill[], 
    updatedTreeBonus: number, 
    updatedManualBonus: number
  ) => {
    try {
      const dataToSave: SavedSkillTreeData = {
        skills: updatedSkills,
        treeBonus: updatedTreeBonus,
        manualBonus: updatedManualBonus
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      console.log('Daten gespeichert:', dataToSave);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
    }
  };

  // Berechne und aktualisiere Tree Bonus wenn sich die Skill-Werte ändern
  useEffect(() => {
    const totalPoints = skills.reduce((sum, skill) => sum + skill.value, 0);
    const calculatedBonus = Math.floor(totalPoints / 10);
    
    if (calculatedBonus !== treeBonus) {
      setTreeBonus(calculatedBonus);
      
      const updatedSkills = skills.map(skill => ({
        ...skill,
        bonus: calculatedBonus,
        finalValue: skill.value + calculatedBonus
      }));
      
      setSkills(updatedSkills);
      saveData(updatedSkills, calculatedBonus, manualBonus);
    }
  }, [skills.map(s => s.value).join(','), manualBonus]);

  const addSkill = () => {
    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: '',
      value: 0,
      bonus: treeBonus,
      finalValue: treeBonus
    };
    const updatedSkills = [...skills, newSkill];
    setSkills(updatedSkills);
    saveData(updatedSkills, treeBonus, manualBonus);
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    const updatedSkills = skills.map(skill => {
      if (skill.id === id) {
        const updatedSkill = { ...skill, ...updates };
        updatedSkill.finalValue = updatedSkill.value + treeBonus;
        return updatedSkill;
      }
      return skill;
    });
    setSkills(updatedSkills);
    saveData(updatedSkills, treeBonus, manualBonus);
  };

  const removeSkill = (id: string) => {
    const updatedSkills = skills.filter(skill => skill.id !== id);
    setSkills(updatedSkills);
    saveData(updatedSkills, treeBonus, manualBonus);
  };

  const handleManualBonusChange = (newBonus: number) => {
    const validBonus = Math.max(0, newBonus);
    setManualBonus(validBonus);
    saveData(skills, treeBonus, validBonus);
  };

  const totalPoints = skills.reduce((sum, skill) => sum + skill.value, 0);

  return (
    <div className="space-y-4"> 
      <div className="flex justify-between items-center"> 
        <div className="flex items-center space-x-4"> 
          <h3 className="font-bold text-lg">{title}</h3> 
          <div className={`bg-${colorScheme}-100 text-${colorScheme}-700 px-2 py-1 rounded-lg text-sm`}> 
            ({treeBonus})
            {totalPoints}/{maxPoints}

          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
          
          </div>
          <input
            type="number"
            value={manualBonus}
            onChange={(e) => handleManualBonusChange(parseInt(e.target.value) || 0)}
            className="w-16 px-2 py-1 border rounded text-center"
          />
        </div>
      </div>

      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 items-center text-sm font-medium text-gray-500 px-2">
          <div className="col-span-1"></div>
          <div className="col-span-4">Fähigkeit</div>
          <div className="col-span-2 text-center">Basis</div>
          <div className="col-span-2 text-center">Bonus</div>
          <div className="col-span-2 text-center">Gesamt</div>
          <div className="col-span-1"></div>
        </div>

        {/* Skills */}
        {skills.map((skill) => (
          <div key={skill.id} className="grid grid-cols-12 gap-2 items-center">
            <GripVertical className="w-4 h-4 text-gray-400 col-span-1" />
            <input
              type="text"
              value={skill.name}
              onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
              placeholder="Fähigkeit"
              className="col-span-4 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            />
            <input
              type="number"
              value={skill.value}
              onChange={(e) => updateSkill(skill.id, { 
                value: Math.max(0, parseInt(e.target.value) || 0) 
              })}
              className="col-span-2 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center"
              min="0"
              max={maxPoints}
            />
            <div className="col-span-2 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center">
              +{skill.bonus}
            </div>
            <div className="col-span-2 px-2 py-1 bg-gray-100 border border-gray-200 rounded-lg text-sm text-center font-medium">
              {skill.finalValue}
            </div>
            <button
              onClick={() => removeSkill(skill.id)}
              className="col-span-1 text-gray-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          onClick={addSkill}
          className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 
                   hover:border-indigo-400 hover:text-indigo-600 transition-colors 
                   flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Fähigkeit hinzufügen
        </button>
      </div>
    </div>
  );
};

export default SkillTreeWidget;