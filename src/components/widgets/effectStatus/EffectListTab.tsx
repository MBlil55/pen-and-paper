import React, { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Search, 
  CheckSquare, 
  Square,
  ChevronDown,
  ChevronRight,
  Filter,
  X,
  Check,
} from 'lucide-react';
import useEffectStore from './hooks/useEffectStore';
import { Effect, EffectCategory } from './types/effectTypes';

const categoryIcons = {
  buffs: '🔵',
  debuffs: '🔴',
  combat: '⚔️',
  special: '✨',
  defense: '🛡️',
  health: '❤️'
};

const CategoryGroup: React.FC<{
  category: EffectCategory;
  effects: Effect[];
  selectedEffects: string[];
  onSelect: (effectId: string) => void;
  onEdit: (effect: Effect) => void;
  onDelete: (effectId: string) => void;
  onToggle: (effectId: string) => void;
}> = ({ 
  category, 
  effects, 
  selectedEffects, 
  onSelect,
  onEdit,
  onDelete,
  onToggle
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border rounded-lg overflow-hidden mb-4">
      {/* Category Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between
                 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <span>{categoryIcons[category]}</span>
          <span className="font-medium capitalize">
            {category}
          </span>
          <span className="text-sm text-slate-500">
            ({effects.length})
          </span>
        </div>
        {isExpanded ? 
          <ChevronDown className="w-5 h-5 text-slate-400" /> : 
          <ChevronRight className="w-5 h-5 text-slate-400" />
        }
      </button>

      {/* Effects List */}
      {isExpanded && (
        <div className="divide-y">
          {effects.map(effect => (
            <div 
              key={effect.id}
              className="p-4 hover:bg-slate-50 flex items-start justify-between gap-4
                       transition-colors relative group"
            >
              <div className="flex items-start gap-3 flex-1">
                <button
                  onClick={() => onSelect(effect.id)}
                  className="mt-1"
                >
                  {selectedEffects.includes(effect.id) ? (
                    <CheckSquare className="w-5 h-5 text-indigo-500" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {effect.name}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      effect.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {effect.isActive ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    {effect.description}
                  </p>
                  {effect.value && (
                    <span className={`text-sm font-medium mt-2 inline-block
                                 ${effect.value > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {effect.value > 0 ? '+' : ''}{effect.value}%
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <button
                  onClick={() => onToggle(effect.id)}
                  className={`p-1 rounded ${
                    effect.isActive 
                      ? 'hover:bg-red-100 text-red-500' 
                      : 'hover:bg-green-100 text-green-500'
                  }`}
                  title={effect.isActive ? 'Deaktivieren' : 'Aktivieren'}
                >
                  {effect.isActive ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => onEdit(effect)}
                  className="p-1 hover:bg-slate-200 rounded"
                  title="Bearbeiten"
                >
                  <Edit className="w-4 h-4 text-slate-500" />
                </button>
                <button
                  onClick={() => onDelete(effect.id)}
                  className="p-1 hover:bg-rose-100 rounded"
                  title="Löschen"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EffectListTab: React.FC<{
  onEdit: (effect: Effect) => void;
}> = ({ onEdit }) => {
  const effects = useEffectStore(state => state.effects);
  const deleteEffect = useEffectStore(state => state.deleteEffect);
  const bulkDelete = useEffectStore(state => state.bulkDelete);
  const toggleEffect = useEffectStore(state => state.toggleEffect);
  const bulkToggle = useEffectStore(state => state.bulkToggle);

  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<EffectCategory | 'all'>('all');

  // Filter effects
  const filteredEffects = effects.filter(effect => {
    const matchesSearch = effect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         effect.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || effect.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Group effects by category
  const effectsByCategory = filteredEffects.reduce((acc, effect) => {
    if (!acc[effect.category]) {
      acc[effect.category] = [];
    }
    acc[effect.category].push(effect);
    return acc;
  }, {} as Record<EffectCategory, Effect[]>);

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedEffects.length === 0) return;

    switch (action) {
      case 'activate':
        bulkToggle(selectedEffects, true);
        break;
      case 'deactivate':
        bulkToggle(selectedEffects, false);
        break;
      case 'delete':
        if (confirm('Ausgewählte Effekte wirklich löschen?')) {
          selectedEffects.forEach(deleteEffect);
          setSelectedEffects([]);
        }
        break;
    }
  };

  const handleSelectEffect = (effectId: string) => {
    setSelectedEffects(prev => 
      prev.includes(effectId)
        ? prev.filter(id => id !== effectId)
        : [...prev, effectId]
    );
  };

  const handleBulkDelete = () => {
    if (confirm('Ausgewählte Effekte wirklich löschen?')) {
      bulkDelete(selectedEffects);
      setSelectedEffects([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Effekte durchsuchen..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as EffectCategory | 'all')}
            className="pl-9 pr-4 py-2 border rounded-lg appearance-none bg-white"
          >
            <option value="all">Alle Kategorien</option>
            {Object.keys(categoryIcons).map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedEffects.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
          <span className="text-sm text-indigo-600">
            {selectedEffects.length} Effekt(e) ausgewählt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('activate')}
              className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-100 rounded"
            >
              Aktivieren
            </button>
            <button
              onClick={() => handleBulkAction('deactivate')}
              className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-100 rounded"
            >
              Deaktivieren
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-100 rounded"
            >
              Löschen
            </button>
          </div>
        </div>
      )}

      {/* Effects List */}
      <div className="space-y-2">
        {Object.entries(effectsByCategory).map(([category, categoryEffects]) => (
          <CategoryGroup
            key={category}
            category={category as EffectCategory}
            effects={categoryEffects}
            selectedEffects={selectedEffects}
            onSelect={handleSelectEffect}
            onEdit={onEdit}
            onDelete={deleteEffect}
            onToggle={toggleEffect}
          />
        ))}
      </div>
    </div>
  );
};

export default EffectListTab;