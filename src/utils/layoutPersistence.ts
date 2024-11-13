export interface WidgetLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: string;
  title?: string;
  colorScheme?: string;
}

// Aktualisiere die Typdefinition mit allen möglichen Widget-Typen
export type WidgetType = 
  | 'characterInfo'
  | 'characterStatus'
  | 'skillTree'
  | 'dice'
  | 'damage'
  | 'health'
  | 'notes';

export const defaultLayout: WidgetLayout[] = [
  { i: 'char-info-1', x: 0, y: 0, w: 2, h: 4, type: 'characterInfo' },
  { i: 'char-status-1', x: 2, y: 0, w: 2, h: 4, type: 'characterStatus' }, // Neuer Default-Eintrag
  { i: 'handeln-1', x: 0, y: 4, w: 1, h: 4, type: 'skillTree', title: 'Handeln', colorScheme: 'amber' },
  { i: 'wissen-1', x: 1, y: 4, w: 1, h: 4, type: 'skillTree', title: 'Wissen', colorScheme: 'emerald' },
  { i: 'soziales-1', x: 2, y: 4, w: 1, h: 4, type: 'skillTree', title: 'Soziales', colorScheme: 'violet' }
];

export const saveLayout = (layout: WidgetLayout[]) => {
  try {
    localStorage.setItem('widgetLayout', JSON.stringify(layout));
  } catch (error) {
    console.error('Failed to save layout:', error);
  }
};

export const loadLayout = (): WidgetLayout[] => {
  try {
    const saved = localStorage.getItem('widgetLayout');
    return saved ? JSON.parse(saved) : defaultLayout;
  } catch (error) {
    console.error('Failed to load layout:', error);
    return defaultLayout;
  }
};