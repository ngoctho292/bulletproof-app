'use client';

import { useState } from 'react';
import { useKanbanStore } from '../stores/kanban-store';
import { Plus, X } from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Gray', value: 'gray', bg: 'bg-gray-50', border: 'border-gray-200' },
  { name: 'Blue', value: 'blue', bg: 'bg-blue-50', border: 'border-blue-200' },
  { name: 'Green', value: 'green', bg: 'bg-green-50', border: 'border-green-200' },
  { name: 'Yellow', value: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { name: 'Red', value: 'red', bg: 'bg-red-50', border: 'border-red-200' },
  { name: 'Purple', value: 'purple', bg: 'bg-purple-50', border: 'border-purple-200' },
  { name: 'Pink', value: 'pink', bg: 'bg-pink-50', border: 'border-pink-200' },
  { name: 'Indigo', value: 'indigo', bg: 'bg-indigo-50', border: 'border-indigo-200' },
];

export function AddColumnForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('gray');
  const { addColumn, getCurrentBoard } = useKanbanStore();
  const board = getCurrentBoard();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !board) return;

    addColumn(board.id, {
      title: title.trim(),
      color: selectedColor,
    });

    setTitle('');
    setSelectedColor('gray');
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTitle('');
    setSelectedColor('gray');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className="flex-shrink-0 w-80">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full h-full min-h-[200px] border-2 border-dashed rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
        >
          <Plus size={32} />
          <span className="font-semibold">Add Column</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-80">
      <form
        onSubmit={handleSubmit}
        className="border-2 rounded-lg p-4 bg-white shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">New Column</h3>
          <button
            type="button"
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Column Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., In Review"
            className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Color Theme</label>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                className={`
                  h-12 rounded border-2 transition-all
                  ${color.bg} ${color.border}
                  ${
                    selectedColor === color.value
                      ? 'ring-2 ring-blue-500 scale-105'
                      : 'hover:scale-105'
                  }
                `}
                title={color.name}
              >
                <span className="text-xs font-medium">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add Column
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border rounded text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}