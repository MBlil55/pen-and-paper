// src/utils/widgetStorage.ts
export const saveCustomWidget = (config) => {
    const savedWidgets = JSON.parse(localStorage.getItem('customWidgets') || '[]');
    savedWidgets.push(config);
    localStorage.setItem('customWidgets', JSON.stringify(savedWidgets));
  };
  
  export const loadCustomWidgets = () => {
    return JSON.parse(localStorage.getItem('customWidgets') || '[]');
  };