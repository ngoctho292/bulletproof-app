'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { useKanbanStore } from '../stores/kanban-store';
import { SortableColumn } from './sortable-column';
import { TaskCard } from './task-card';
import { Task, Column } from '../types';
import { AddColumnForm } from './add-column-form';
import { KanbanColumn } from './kanban-column';

export function KanbanBoard() {
  const { tasks, columns, moveTask, reorderColumns } = useKanbanStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.type === 'column') {
      setActiveColumn(activeData.column);
    } else {
      const task = tasks.find((t) => t.id === active.id);
      if (task) {
        setActiveTask(task);
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Only handle task dragging over columns
    if (activeData?.type !== 'column' && overData?.type === 'column') {
      // This is for visual feedback, actual move happens in handleDragEnd
      return;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      setActiveColumn(null);
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle column reordering
    if (activeData?.type === 'column' && overData?.type === 'column') {
      const oldIndex = columns.findIndex((col) => col.id === active.id);
      const newIndex = columns.findIndex((col) => col.id === over.id);

      if (oldIndex !== newIndex) {
        const newColumns = arrayMove(columns, oldIndex, newIndex);
        reorderColumns(newColumns);
      }
    }
    // Handle task movement
    else if (activeData?.type !== 'column') {
      const taskId = active.id as string;
      
      // Check if dropping on a column
      if (overData?.type === 'column') {
        moveTask(taskId, over.id as string);
      }
      // Check if dropping on column id directly
      else if (columns.some((col) => col.id === over.id)) {
        moveTask(taskId, over.id as string);
      }
    }

    setActiveTask(null);
    setActiveColumn(null);
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={columns.map((col) => col.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <SortableColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.id)}
            />
          ))}
          
          <AddColumnForm />
        </div>
      </SortableContext>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 scale-105">
            <TaskCard task={activeTask} />
          </div>
        ) : activeColumn ? (
          <div className="w-80 opacity-50 rotate-2">
            <KanbanColumn 
              column={activeColumn} 
              tasks={getTasksByStatus(activeColumn.id)} 
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}