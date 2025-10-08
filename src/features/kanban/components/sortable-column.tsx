'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column, Task } from '../types';
import { KanbanColumn } from './kanban-column';
import { AddTaskForm } from './add-task-form';
import { GripVertical } from 'lucide-react';

interface SortableColumnProps {
  column: Column;
  tasks: Task[];
  isOver?: boolean;
}

export function SortableColumn({ column, tasks, isOver }: SortableColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex-shrink-0 w-80 flex flex-col"
    >
      {/* Drag Handle */}
      <div
        className="flex items-center gap-2 mb-2 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={20} className="text-gray-400 hover:text-gray-600" />
        <span className="text-sm text-gray-500">Drag to reorder</span>
      </div>

      <KanbanColumn column={column} tasks={tasks} isOver={isOver} />
      
      <div className="mt-4 flex-shrink-0">
        <AddTaskForm defaultStatus={column.id} />
      </div>
    </div>
  );
}