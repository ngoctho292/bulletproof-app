'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task, Column } from '../types';
import { TaskCard } from './task-card';
import { cn } from '@/lib/utils';
import { useKanbanStore } from '../stores/kanban-store';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  isOver?: boolean;
}

const colorClasses: Record<string, { bg: string; border: string; hoverBg: string }> = {
  gray: { bg: 'bg-gray-50', border: 'border-gray-200', hoverBg: 'bg-gray-100' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', hoverBg: 'bg-blue-100' },
  green: { bg: 'bg-green-50', border: 'border-green-200', hoverBg: 'bg-green-100' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', hoverBg: 'bg-yellow-100' },
  red: { bg: 'bg-red-50', border: 'border-red-200', hoverBg: 'bg-red-100' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', hoverBg: 'bg-purple-100' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', hoverBg: 'bg-pink-100' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', hoverBg: 'bg-indigo-100' },
};

export function KanbanColumn({ column, tasks, isOver }: KanbanColumnProps) {
  const { setNodeRef, isOver: isOverDroppable } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });
  const { updateColumn, deleteColumn } = useKanbanStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  const colors = colorClasses[column.color || 'gray'];
  const showHighlight = isOver || isOverDroppable;

  const handleSave = () => {
    if (editTitle.trim()) {
      updateColumn(column.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (tasks.length > 0) {
      if (!confirm(`Delete "${column.title}" and all ${tasks.length} tasks inside?`)) {
        return;
      }
    }
    deleteColumn(column.id);
    setMenuOpen(false);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-280px)]">
      <div className="mb-4 flex items-center justify-between flex-shrink-0">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') {
                  setEditTitle(column.title);
                  setIsEditing(false);
                }
              }}
              className="font-bold text-lg px-2 py-1 border rounded w-full"
              autoFocus
            />
          ) : (
            <>
              <h2 className="font-bold text-lg mb-1">{column.title}</h2>
              <p className="text-sm text-gray-500">{tasks.length} tasks</p>
            </>
          )}
        </div>

        <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Popover.Trigger asChild>
            <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
              <MoreVertical size={18} />
            </button>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              className="bg-white border rounded-lg shadow-lg p-1 z-50"
              sideOffset={5}
            >
              <button
                onClick={() => {
                  setIsEditing(true);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 rounded"
              >
                <Edit size={14} />
                Rename
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 size={14} />
                Delete Column
              </button>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 border-2 rounded-lg p-4 transition-all duration-200 overflow-y-auto',
          showHighlight ? [
            'border-solid border-blue-500 shadow-lg scale-[1.02]',
            colors.hoverBg,
            'ring-4 ring-blue-200'
          ] : [
            'border-dashed',
            colors.bg,
            colors.border,
          ]
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>

        {tasks.length === 0 && (
          <div className={cn(
            "flex items-center justify-center h-32 text-sm transition-all",
            showHighlight ? "text-blue-600 font-semibold text-lg" : "text-gray-400"
          )}>
            {showHighlight ? '📥 Drop here' : 'Drop tasks here'}
          </div>
        )}
      </div>
    </div>
  );
}