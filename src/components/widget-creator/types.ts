// types/widgetCreator.ts

export interface ElementBase {
    id: string;
    type: string;
    label: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
  }
  
  export interface InputElement extends ElementBase {
    type: 'input';
    placeholder?: string;
    defaultValue?: string;
    validation?: {
      required?: boolean;
      pattern?: string;
      min?: number;
      max?: number;
    };
  }
  
  export interface NumberElement extends ElementBase {
    type: 'number';
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
  }
  
  export interface SliderElement extends ElementBase {
    type: 'slider';
    defaultValue?: number;
    min: number;
    max: number;
    step?: number;
  }
  
  export interface SelectElement extends ElementBase {
    type: 'select';
    options: Array<{ value: string; label: string }>;
    defaultValue?: string;
  }
  
  export interface CheckboxElement extends ElementBase {
    type: 'checkbox';
    defaultValue?: boolean;
    label: string;
  }
  
  export interface LabelElement extends ElementBase {
    type: 'label';
    text: string;
    style?: {
      bold?: boolean;
      italic?: boolean;
      color?: string;
    };
  }
  
  export type WidgetElement = 
    | InputElement 
    | NumberElement 
    | SliderElement 
    | SelectElement 
    | CheckboxElement 
    | LabelElement;
  
  export interface CustomWidget {
    id: string;
    name: string;
    description?: string;
    size: {
      width: number;
      height: number;
    };
    elements: WidgetElement[];
    theme?: {
      primary: string;
      secondary: string;
      background: string;
    };
  }
  
  export interface WidgetCreatorProps {
    onClose: () => void;
    onSave: (widget: CustomWidget) => void;
    initialWidget?: CustomWidget;
    availableElements?: any[];
  }