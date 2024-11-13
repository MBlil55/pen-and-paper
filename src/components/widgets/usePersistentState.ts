// usePersistentState.ts
import { useState, useEffect } from 'react';

export function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Lade den gespeicherten Wert beim ersten Render
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      // Parse den gespeicherten JSON-String
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading persisted state for key "${key}":`, error);
      return initialValue;
    }
  });

  // Aktualisiere localStorage wenn sich der State ändert
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error saving state to localStorage for key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

// Alternative named export
export default usePersistentState;