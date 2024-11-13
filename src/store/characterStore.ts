// src/store/characterStore.ts
import create from 'zustand';
import { Character } from '../types/character';

interface CharacterStore {
  character: Character;
  updateBasicInfo: (field: string, value: string | number) => void;
  addSkill: (tree: string, skill: Skill) => void;
  removeSkill: (tree: string, index: number) => void;
}

export const useCharacterStore = create<CharacterStore>((set) => ({
  character: {
    basicInfo: {
      name: '',
      gender: '',
      age: 0,
      healthPoints: 100,
      stature: '',
      religion: '',
      profession: '',
      familyStatus: ''
    },
    skills: {
      handeln: [],
      wissen: [],
      soziales: []
    }
  },
  updateBasicInfo: (field, value) =>
    set((state) => ({
      character: {
        ...state.character,
        basicInfo: {
          ...state.character.basicInfo,
          [field]: value
        }
      }
    })),
  // ... weitere Store Methoden
}));