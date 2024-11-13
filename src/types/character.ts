// src/types/character.ts
export interface Character {
    basicInfo: {
      name: string;
      gender: string;
      age: number;
      healthPoints: number;
      stature: string;
      religion: string;
      profession: string;
      familyStatus: string;
    };
    skills: {
      handeln: Skill[];
      wissen: Skill[];
      soziales: Skill[];
    };
  }
  
  export interface Skill {
    name: string;
    value: number;
    bonus: number;
  }