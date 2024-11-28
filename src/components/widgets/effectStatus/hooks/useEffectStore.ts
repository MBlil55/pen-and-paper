// src/components/widgets/effectStatus/useEffectStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Effect, EffectTemplate } from '../types/effectTypes';

interface EffectStore {
  effects: Effect[];
  templates: EffectTemplate[];
  activeEffects: string[];
  selectedEffects: string[];
  
  // CRUD Operations
  createEffect: (effect: Omit<Effect, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEffect: (effect: Effect) => void;
  deleteEffect: (effectId: string) => void;
  toggleEffect: (effectId: string) => void;
  
  // Bulk Operations
  bulkToggle: (effectIds: string[], active: boolean) => void;
  bulkDelete: (effectIds: string[]) => void;
  
  // Template Operations
  createTemplate: (template: Omit<EffectTemplate, 'id'>) => void;
  updateTemplate: (template: EffectTemplate) => void;
  deleteTemplate: (templateId: string) => void;
  
  // Selection Operations
  selectEffect: (effectId: string) => void;
  deselectEffect: (effectId: string) => void;
  clearSelection: () => void;
  
  // Filter & Sort
  getEffectsByCategory: (category: string) => Effect[];
  getActiveEffects: () => Effect[];
}

const useEffectStore = create<EffectStore>()(
  persist(
    (set, get) => ({
      effects: [],
      templates: [],
      activeEffects: [],
      selectedEffects: [],

      createEffect: (effectData) => {
        const newEffect: Effect = {
          ...effectData,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isActive: false
        };
        set((state) => ({
          effects: [...state.effects, newEffect]
        }));
      },

      updateEffect: (updatedEffect) => {
        set((state) => ({
          effects: state.effects.map((effect) =>
            effect.id === updatedEffect.id
              ? { ...updatedEffect, updatedAt: Date.now() }
              : effect
          )
        }));
      },

      deleteEffect: (effectId) => {
        set((state) => ({
          effects: state.effects.filter((effect) => effect.id !== effectId),
          activeEffects: state.activeEffects.filter((id) => id !== effectId),
          selectedEffects: state.selectedEffects.filter((id) => id !== effectId)
        }));
      },

      toggleEffect: (effectId) => {
        set((state) => {
          const effect = state.effects.find(e => e.id === effectId);
          if (!effect) return state;

          const updatedEffect = {
            ...effect,
            isActive: !effect.isActive,
            updatedAt: Date.now()
          };

          return {
            effects: state.effects.map(e => 
              e.id === effectId ? updatedEffect : e
            )
          };
        });
      },

      bulkToggle: (effectIds, active) => {
        set((state) => ({
          effects: state.effects.map(effect => 
            effectIds.includes(effect.id)
              ? {
                  ...effect,
                  isActive: active,
                  updatedAt: Date.now()
                }
              : effect
          )
        }));
      },

      bulkDelete: (effectIds) => {
        set((state) => ({
          effects: state.effects.filter((effect) => !effectIds.includes(effect.id)),
          activeEffects: state.activeEffects.filter(
            (id) => !effectIds.includes(id)
          ),
          selectedEffects: state.selectedEffects.filter(
            (id) => !effectIds.includes(id)
          )
        }));
      },

      createTemplate: (templateData) => {
        const newTemplate: EffectTemplate = {
          ...templateData,
          id: crypto.randomUUID()
        };
        set((state) => ({
          templates: [...state.templates, newTemplate]
        }));
      },

      updateTemplate: (updatedTemplate) => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === updatedTemplate.id ? updatedTemplate : template
          )
        }));
      },

      deleteTemplate: (templateId) => {
        set((state) => ({
          templates: state.templates.filter(
            (template) => template.id !== templateId
          )
        }));
      },

      selectEffect: (effectId) => {
        set((state) => ({
          selectedEffects: [...state.selectedEffects, effectId]
        }));
      },

      deselectEffect: (effectId) => {
        set((state) => ({
          selectedEffects: state.selectedEffects.filter((id) => id !== effectId)
        }));
      },

      clearSelection: () => {
        set({ selectedEffects: [] });
      },

      getEffectsByCategory: (category) => {
        return get().effects.filter((effect) => effect.category === category);
      },

      getActiveEffects: () => {
        const activeIds = get().activeEffects;
        return get().effects.filter((effect) => activeIds.includes(effect.id));
      }
    }),
    {
      name: 'effect-storage'
    }
  )
);

export default useEffectStore;