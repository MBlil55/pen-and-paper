import React, { useState } from 'react';
import { Link, Calculator, ArrowRight, Plus, X } from 'lucide-react';

// Verfügbare Operatoren für Berechnungen
const OPERATORS = [
  { symbol: '+', label: 'Add' },
  { symbol: '-', label: 'Subtract' },
  { symbol: '*', label: 'Multiply' },
  { symbol: '/', label: 'Divide' },
  { symbol: '%', label: 'Modulo' },
  { symbol: 'min', label: 'Minimum' },
  { symbol: 'max', label: 'Maximum' },
  { symbol: 'avg', label: 'Average' }
];

// Verfügbare Vergleichsoperatoren
const COMPARATORS = [
  { symbol: '>', label: 'Greater than' },
  { symbol: '<', label: 'Less than' },
  { symbol: '>=', label: 'Greater or equal' },
  { symbol: '<=', label: 'Less or equal' },
  { symbol: '==', label: 'Equal to' },
  { symbol: '!=', label: 'Not equal to' }
];

interface LinkModalProps {
  element: any;
  availableElements: any[];
  onClose: () => void;
  onLink: (linkConfig: any) => void;
}

// Hauptkomponente für Verknüpfungen
const LinkModal: React.FC<LinkModalProps> = ({
  element,
  availableElements,
  onClose,
  onLink
}) => {
  const [linkType, setLinkType] = useState<'value' | 'calculation' | 'condition'>('value');
  const [linkConfig, setLinkConfig] = useState({
    type: 'value',
    sourceField: '',
    operation: '+',
    targetFields: [],
    conditions: [],
    value: ''
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Configure Link</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Link Type Selector */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg flex items-center space-x-2
              ${linkType === 'value' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setLinkType('value')}
          >
            <Link className="w-4 h-4" />
            <span>Value Link</span>
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center space-x-2
              ${linkType === 'calculation' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setLinkType('calculation')}
          >
            <Calculator className="w-4 h-4" />
            <span>Calculation</span>
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center space-x-2
              ${linkType === 'condition' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setLinkType('condition')}
          >
            <ArrowRight className="w-4 h-4" />
            <span>Condition</span>
          </button>
        </div>

        {/* Link Configuration */}
        {linkType === 'value' && (
          <ValueLinkConfig
            config={linkConfig}
            availableElements={availableElements}
            onChange={setLinkConfig}
          />
        )}

        {linkType === 'calculation' && (
          <CalculationConfig
            config={linkConfig}
            availableElements={availableElements}
            onChange={setLinkConfig}
          />
        )}

        {linkType === 'condition' && (
          <ConditionConfig
            config={linkConfig}
            availableElements={availableElements}
            onChange={setLinkConfig}
          />
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            onClick={() => {
              onLink(linkConfig);
              onClose();
            }}
          >
            Apply Link
          </button>
        </div>
      </div>
    </div>
  );
};

// Komponente für einfache Wertverknüpfungen
const ValueLinkConfig = ({ config, availableElements, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Source Field
        </label>
        <select
          className="w-full p-2 border rounded-lg"
          value={config.sourceField}
          onChange={(e) => onChange({ ...config, sourceField: e.target.value })}
        >
          <option value="">Select field...</option>
          {availableElements.map((elem) => (
            <option key={elem.id} value={elem.id}>
              {elem.label || elem.id}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Fields
        </label>
        <div className="space-y-2">
          {config.targetFields.map((field, index) => (
            <div key={index} className="flex items-center space-x-2">
              <select
                className="flex-1 p-2 border rounded-lg"
                value={field}
                onChange={(e) => {
                  const newFields = [...config.targetFields];
                  newFields[index] = e.target.value;
                  onChange({ ...config, targetFields: newFields });
                }}
              >
                <option value="">Select field...</option>
                {availableElements.map((elem) => (
                  <option key={elem.id} value={elem.id}>
                    {elem.label || elem.id}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  const newFields = config.targetFields.filter((_, i) => i !== index);
                  onChange({ ...config, targetFields: newFields });
                }}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange({
              ...config,
              targetFields: [...config.targetFields, '']
            })}
            className="w-full p-2 border-2 border-dashed rounded-lg text-gray-500 hover:text-gray-700"
          >
            <Plus className="w-4 h-4 mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Komponente für Berechnungen
const CalculationConfig = ({ config, availableElements, onChange }) => {
  const [formula, setFormula] = useState<Array<{ type: 'field' | 'operator', value: string }>>([]);

  const addToFormula = (type: 'field' | 'operator', value: string) => {
    setFormula([...formula, { type, value }]);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Formula Builder
        </label>
        <div className="p-4 border rounded-lg bg-gray-50 min-h-[100px] mb-2">
          {formula.map((item, index) => (
            <span
              key={index}
              className={`inline-block px-2 py-1 m-1 rounded ${
                item.type === 'field' ? 'bg-blue-100' : 'bg-gray-200'
              }`}
            >
              {item.value}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Fields</label>
            <select
              className="w-full p-2 border rounded-lg"
              onChange={(e) => addToFormula('field', e.target.value)}
              value=""
            >
              <option value="">Add field...</option>
              {availableElements.map((elem) => (
                <option key={elem.id} value={elem.id}>
                  {elem.label || elem.id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Operators</label>
            <select
              className="w-full p-2 border rounded-lg"
              onChange={(e) => addToFormula('operator', e.target.value)}
              value=""
            >
              <option value="">Add operator...</option>
              {OPERATORS.map((op) => (
                <option key={op.symbol} value={op.symbol}>
                  {op.label} ({op.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Result Target
        </label>
        <select
          className="w-full p-2 border rounded-lg"
          value={config.targetFields[0] || ''}
          onChange={(e) => onChange({
            ...config,
            targetFields: [e.target.value]
          })}
        >
          <option value="">Select target field...</option>
          {availableElements.map((elem) => (
            <option key={elem.id} value={elem.id}>
              {elem.label || elem.id}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// Komponente für bedingte Verknüpfungen
const ConditionConfig = ({ config, availableElements, onChange }) => {
  const addCondition = () => {
    const newConditions = [
      ...config.conditions,
      { field: '', operator: '>', value: '', result: '' }
    ];
    onChange({ ...config, conditions: newConditions });
  };

  const updateCondition = (index: number, updates: any) => {
    const newConditions = config.conditions.map((condition, i) =>
      i === index ? { ...condition, ...updates } : condition
    );
    onChange({ ...config, conditions: newConditions });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {config.conditions.map((condition, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center space-x-2">
              <select
                className="flex-1 p-2 border rounded-lg"
                value={condition.field}
                onChange={(e) => updateCondition(index, { field: e.target.value })}
              >
                <option value="">Select field...</option>
                {availableElements.map((elem) => (
                  <option key={elem.id} value={elem.id}>
                    {elem.label || elem.id}
                  </option>
                ))}
              </select>
              <select
                className="w-32 p-2 border rounded-lg"
                value={condition.operator}
                onChange={(e) => updateCondition(index, { operator: e.target.value })}
              >
                {COMPARATORS.map((op) => (
                  <option key={op.symbol} value={op.symbol}>
                    {op.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="w-32 p-2 border rounded-lg"
                value={condition.value}
                onChange={(e) => updateCondition(index, { value: e.target.value })}
                placeholder="Value"
              />
              <button
                onClick={() => {
                  const newConditions = config.conditions.filter((_, i) => i !== index);
                  onChange({ ...config, conditions: newConditions });
                }}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <select
                className="w-full p-2 border rounded-lg"
                value={condition.result}
                onChange={(e) => updateCondition(index, { result: e.target.value })}
              >
                <option value="">Select result action...</option>
                <option value="show">Show Element</option>
                <option value="hide">Hide Element</option>
                <option value="enable">Enable Element</option>
                <option value="disable">Disable Element</option>
                <option value="setValue">Set Value</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addCondition}
        className="w-full p-2 border-2 border-dashed rounded-lg text-gray-500 hover:text-gray-700"
      >
        <Plus className="w-4 h-4 mx-auto" />
        Add Condition
      </button>
    </div>
  );
};

export default LinkModal;