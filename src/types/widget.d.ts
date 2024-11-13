// types/widget.d.ts

interface ElementConfig {
    id: string;
    type: string;
    position: {
      x: number;
      y: number;
    };
    size: {
      width: number;
      height: number;
    };
    defaultValue?: string | number;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    text?: string;
    links?: Array<{
      type: 'value' | 'calculation' | 'condition';
      sourceField?: string;
      formula?: string;
      conditions?: Array<{
        field: string;
        operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
        value: any;
        result: any;
      }>;
    }>;
  }
  
  interface CustomWidgetConfig {
    size?: {
      width: number;
      height: number;
    };
    elements?: ElementConfig[];
    name?: string;
    type?: string;
  }
  
  interface WidgetLayout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    type: string;
    title?: string;
    colorScheme?: string;
    config?: CustomWidgetConfig;
  }
  
  interface WidgetProps {
    widget: WidgetLayout;
    onRemove: () => void;
    isDragging?: boolean;
    isResizing?: boolean;
  }
  
  export type {
    ElementConfig,
    CustomWidgetConfig,
    WidgetLayout,
    WidgetProps
  };