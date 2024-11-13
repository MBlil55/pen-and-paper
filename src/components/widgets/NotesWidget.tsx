import React, { useState, useEffect } from 'react';
import { Save, Hash, Search, Filter, X, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
  category: string;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'general', name: 'Allgemein', color: '#6366f1' },
  { id: 'quest', name: 'Quests', color: '#ef4444' },
  { id: 'lore', name: 'Geschichte', color: '#f59e0b' },
  { id: 'inventory', name: 'Inventar', color: '#10b981' }
];

const STORAGE_KEY = 'character-notes';
const CURRENT_NOTE_KEY = 'current-note';
const CATEGORIES_KEY = 'note-categories';

const NotesWidget = () => {
  // State für Notizen und aktuelle Bearbeitung
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    if (savedNotes) {
      const parsed = JSON.parse(savedNotes);
      return parsed.map((note: any) => ({
        ...note,
        lastModified: new Date(note.lastModified),
        category: note.category || 'general',
        tags: note.tags || []
      }));
    }
    return [];
  });

  const [currentNote, setCurrentNote] = useState<Note>(() => {
    const savedCurrentNote = localStorage.getItem(CURRENT_NOTE_KEY);
    if (savedCurrentNote) {
      const parsed = JSON.parse(savedCurrentNote);
      return {
        ...parsed,
        lastModified: new Date(parsed.lastModified),
        category: parsed.category || 'general',
        tags: parsed.tags || []
      };
    }
    return {
      id: '',
      title: '',
      content: '',
      lastModified: new Date(),
      category: 'general',
      tags: []
    };
  });

  // State für Kategorien
  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem(CATEGORIES_KEY);
    return savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES;
  });

  // State für Suche und Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentTag, setCurrentTag] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  // Speichern der Daten
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(CURRENT_NOTE_KEY, JSON.stringify(currentNote));
  }, [currentNote]);

  useEffect(() => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

  // Filterfunktionen
  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchTerm === '' || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || note.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Tag Management
  const addTag = () => {
    if (currentTag && !currentNote.tags.includes(currentTag)) {
      setCurrentNote(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentNote(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Notiz Funktionen
  const saveNote = () => {
    if (!currentNote.title && !currentNote.content) return;

    const now = new Date();
    if (currentNote.id) {
      setNotes(notes.map(note => 
        note.id === currentNote.id 
          ? { ...currentNote, lastModified: now }
          : note
      ));
    } else {
      setNotes([...notes, {
        ...currentNote,
        id: Date.now().toString(),
        lastModified: now
      }]);
    }
    
    setCurrentNote({
      id: '',
      title: '',
      content: '',
      lastModified: new Date(),
      category: 'general',
      tags: []
    });
    setIsPreview(false);
  };

  return (
    <div className="space-y-4">
      {/* Suchleiste und Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Notizen durchsuchen..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
          />
        </div>
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
        >
          <option value="">Alle Kategorien</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Notiz Editor */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={currentNote.title}
            onChange={(e) => setCurrentNote(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Titel"
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
          />
          <select
            value={currentNote.category}
            onChange={(e) => setCurrentNote(prev => ({ ...prev, category: e.target.value }))}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
            style={{ color: categories.find(c => c.id === currentNote.category)?.color }}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 min-h-[32px] p-2 bg-gray-50 border border-gray-200 rounded-lg">
          {currentNote.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-700 rounded"
            >
              <Hash className="w-3 h-3 mr-1" />
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-indigo-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <div className="flex items-center">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              placeholder="Tag hinzufügen..."
              className="px-2 py-1 bg-transparent border-none focus:ring-0 text-sm"
            />
            <button
              onClick={addTag}
              className="p-1 hover:bg-indigo-50 rounded"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
            </button>
          </div>
        </div>

        {/* Editor/Preview Toggle */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            {isPreview ? 'Bearbeiten' : 'Vorschau'}
          </button>
        </div>

        {isPreview ? (
          <div className="prose prose-sm max-w-none p-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[8rem]">
            <ReactMarkdown>{currentNote.content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={currentNote.content}
            onChange={(e) => setCurrentNote(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Notizen hier eingeben... (Markdown wird unterstützt)"
            className="w-full h-32 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg resize-none"
          />
        )}

        <div className="flex justify-end">
          <button
            onClick={saveNote}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
          >
            <Save className="w-4 h-4" />
            <span>Speichern</span>
          </button>
        </div>
      </div>

      {/* Notizenliste */}
      {filteredNotes.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">
            Gespeicherte Notizen ({filteredNotes.length})
          </h4>
          <div className="space-y-2">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setCurrentNote(note);
                  setIsPreview(false);
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium">{note.title}</h5>
                    <span 
                      className="inline-block px-2 py-0.5 text-xs rounded"
                      style={{ 
                        backgroundColor: `${categories.find(c => c.id === note.category)?.color}20`,
                        color: categories.find(c => c.id === note.category)?.color 
                      }}
                    >
                      {categories.find(c => c.id === note.category)?.name}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotes(notes.filter(n => n.id !== note.id));
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {note.content}
                </p>
                
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {note.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs"
                      >
                        <Hash className="w-3 h-3 mr-0.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="text-xs text-gray-400 mt-2">
                  {note.lastModified.toLocaleString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesWidget;