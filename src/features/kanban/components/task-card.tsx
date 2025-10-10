'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';
import { useKanbanStore } from '../stores/kanban-store';
import { useState } from 'react';
import { MoreVertical, Edit, Copy, Trash2, User } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { ClientDate } from '@/components/ui/client-date';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { updateTask, deleteTask, duplicateTask, getCurrentBoard } = useKanbanStore();
  const board = getCurrentBoard();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const assignedMembers = board?.members.filter((m) =>
    task.assignedTo?.includes(m.id)
  ) || [];

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  const handleSave = () => {
    updateTask(task.id, {
      title: editTitle,
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(false);
  };

  const handleDuplicate = () => {
    duplicateTask(task.id);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
    setMenuOpen(false);
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white border rounded-lg p-4 shadow-sm"
      >
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-2 py-1 border rounded mb-2 font-semibold"
          placeholder="Task title"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full px-2 py-1 border rounded mb-3 text-sm resize-none"
          rows={3}
          placeholder="Task description"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 px-3 py-1 border rounded text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing touch-none"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-sm flex-1">{task.title}</h3>
        
        <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Popover.Trigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 touch-auto"
            >
              <MoreVertical size={16} />
            </button>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              className="bg-white border rounded-lg shadow-lg p-1 z-50"
              sideOffset={5}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setIsEditing(true);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 rounded"
              >
                <Edit size={14} />
                Edit
              </button>
              <button
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('open-assign-task-modal', {
                      detail: { taskId: task.id },
                    })
                  );
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 rounded"
              >
                <User size={14} />
                Assign
              </button>
              <button
                onClick={handleDuplicate}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 rounded"
              >
                <Copy size={14} />
                Duplicate
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      <p className="text-gray-600 text-xs mb-3 line-clamp-3">
        {task.description}
      </p>

      {/* Priority Badge */}
      {task.priority && (
        <div className="mb-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
            {task.priority.toUpperCase()}
          </span>
        </div>
      )}

      {/* Assigned Members */}
      {assignedMembers.length > 0 && (
        <div className="flex items-center gap-1 mb-2">
          <div className="flex -space-x-2">
            {assignedMembers.slice(0, 3).map((member) => (
              <img
                key={member.id}
                src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                alt={member.name}
                title={member.name}
                className="w-6 h-6 rounded-full border-2 border-white"
              />
            ))}
          </div>
          {assignedMembers.length > 3 && (
            <span className="text-xs text-gray-500">
              +{assignedMembers.length - 3}
            </span>
          )}
        </div>
      )}

      <ClientDate date={task.createdAt} className="text-xs text-gray-400" />
    </div>
  );
}