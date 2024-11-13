// types/widgetCreator.ts

export interface ElementBase {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  placeholder?: string;
  validation?: {
    required?: boolean;
    pattern?: string;
    min?: number;
    max?: number;
  };
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: string; label: string }>;
}

export interface InputElement extends ElementBase {
  type: 'input';
  placeholder?: string;
  validation?: {
    required?: boolean;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface NumberElement extends ElementBase {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
}

export interface SliderElement extends ElementBase {
  type: 'slider';
  min: number;
  max: number;
  step?: number;
}

export interface SelectElement extends ElementBase {
  type: 'select';
  options: Array<{ value: string; label: string }>;
}

export type ElementProperty = keyof ElementBase | 
                          'placeholder' | 
                          'validation' | 
                          'min' | 
                          'max' | 
                          'step' | 
                          'options';