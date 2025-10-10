'use client';

import { useState, useEffect } from 'react';
import { useKanbanStore } from '../stores/kanban-store';
import { X } from 'lucide-react';

const BOARD_COLORS = [
  { name: 'Blue', value: 'blue' },
  { name: 'Green', value: 'green' },
  { name: 'Purple', value: 'purple' },
  { name: 'Red', value: 'red' },
  { name: 'Yellow', value: 'yellow' },
  { name: 'Pink', value: 'pink' },
  { name: 'Indigo', value: 'indigo' },
  { name: 'Gray', value: 'gray' },
];

export function CreateBoardModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('blue');
  const { createBoard } = useKanbanStore();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-create-board-modal', handleOpen);
    return () => window.removeEventListener('open-create-board-modal', handleOpen);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createBoard({
      name: name.trim(),
      description: description.trim(),
      color,
      createdBy: 'current-user', // In production, get from auth
    });

    setName('');
    setDescription('');
    setColor('blue');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Create New Board</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Board Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Marketing Campaign"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this board about?"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Board Color</label>
            <div className="grid grid-cols-4 gap-2">
              {BOARD_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`h-12 rounded-lg bg-${c.value}-500 hover:scale-105 transition-transform ${
                    color === c.value ? 'ring-4 ring-blue-300' : ''
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Create Board
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}