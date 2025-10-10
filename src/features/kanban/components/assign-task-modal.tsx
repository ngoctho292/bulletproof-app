'use client';

import { useState, useEffect } from 'react';
import { useKanbanStore } from '../stores/kanban-store';
import { X, Check } from 'lucide-react';

export function AssignTaskModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const { tasks, getCurrentBoard, assignTask } = useKanbanStore();
  const board = getCurrentBoard();
  
  const task = tasks.find((t) => t.id === taskId);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const event = e as CustomEvent<{ taskId: string }>;
      setTaskId(event.detail.taskId);
      
      const t = tasks.find((task) => task.id === event.detail.taskId);
      setSelectedMembers(t?.assignedTo || []);
      setIsOpen(true);
    };

    window.addEventListener('open-assign-task-modal', handleOpen);
    return () => window.removeEventListener('open-assign-task-modal', handleOpen);
  }, [tasks]);

  const handleToggleMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSave = () => {
    if (taskId) {
      assignTask(taskId, selectedMembers);
    }
    setIsOpen(false);
  };

  if (!isOpen || !task || !board) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Assign Task</h2>
            <p className="text-sm text-gray-600">{task.title}</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {board.members.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No members in this board</p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.dispatchEvent(new CustomEvent('open-board-members-panel'));
                }}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Add members to get started
              </button>
            </div>
          ) : (
            board.members.map((member) => {
              const isSelected = selectedMembers.includes(member.id);
              return (
                <button
                  key={member.id}
                  onClick={() => handleToggleMember(member.id)}
                  className={`w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                    isSelected ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <img
                    src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.email}</div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save ({selectedMembers.length} selected)
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}