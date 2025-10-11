'use client';

import { useState } from 'react';
import { useKanbanStore } from '../stores/kanban-store';
import { Plus, X } from 'lucide-react';

interface AddTaskFormProps {
  defaultStatus?: string;
}

export function AddTaskForm({ defaultStatus = 'todo' }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<string>(defaultStatus);
  const addTask = useKanbanStore((state) => state.addTask);
  const getCurrentBoard = useKanbanStore((state) => state.getCurrentBoard);
  const columns = getCurrentBoard()?.columns || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim(),
      status,
    });

    setTitle('');
    setDescription('');
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-3 border-2 border-dashed rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
      >
        <Plus size={20} />
        Add Task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">New Task</h3>
        <button
          type="button"
          onClick={handleCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full px-3 py-2 border rounded mb-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        autoFocus
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description (optional)"
        className="w-full px-3 py-2 border rounded mb-3 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={3}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {columns.map((column: any) => (
          <option key={column.id} value={column.id}>
            {column.title}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
        >
          Add Task
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
  );
}