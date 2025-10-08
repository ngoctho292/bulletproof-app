'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverEvent,
  rectIntersection,
  pointerWithin,
  getFirstCollision,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useState, useCallback } from 'react';
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
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 8,
      },
    })
  );

  // Custom collision detection for better mobile experience
  const collisionDetectionStrategy = useCallback(
    (args: any) => {
      // If dragging a column, use closestCenter
      if (activeColumn) {
        return closestCenter(args);
      }

      // If dragging a task, use custom strategy
      // First, use pointerWithin to get columns under pointer
      const pointerCollisions = pointerWithin(args);
      
      if (pointerCollisions.length > 0) {
        return pointerCollisions;
      }

      // Fallback to rectIntersection for better detection
      return rectIntersection(args);
    },
    [activeColumn]
  );

  const handleDragStart = (event: DragStartEvent) => {
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

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
    const { over } = event;
    
    if (over) {
      setOverId(over.id as string);
    } else {
      setOverId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }

    if (!over) {
      setActiveTask(null);
      setActiveColumn(null);
      setOverId(null);
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
    setOverId(null);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
    setActiveColumn(null);
    setOverId(null);
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
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
              isOver={overId === column.id}
            />
          ))}
          
          <AddColumnForm />
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="rotate-2 scale-105 shadow-2xl">
            <TaskCard task={activeTask} />
          </div>
        ) : activeColumn ? (
          <div className="w-80 opacity-60 rotate-2 scale-105">
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