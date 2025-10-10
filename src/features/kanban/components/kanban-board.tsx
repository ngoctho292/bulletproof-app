'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  pointerWithin,
  closestCenter,
  rectIntersection,
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
  const { 
    tasks, 
    moveTask, 
    getCurrentBoard,
    reorderColumns,
  } = useKanbanStore();
  
  const board = getCurrentBoard();
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
        delay: 200,
        tolerance: 8,
      },
    })
  );

  const collisionDetectionStrategy = useCallback(
    (args: any) => {
      if (activeColumn) {
        return closestCenter(args);
      }

      const pointerCollisions = pointerWithin(args);
      
      if (pointerCollisions.length > 0) {
        return pointerCollisions;
      }

      return rectIntersection(args);
    },
    [activeColumn]
  );

  const handleDragStart = (event: DragStartEvent) => {
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

    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }

    if (!over || !board) {
      setActiveTask(null);
      setActiveColumn(null);
      setOverId(null);
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle column reordering
    if (activeData?.type === 'column' && overData?.type === 'column') {
      const oldIndex = board.columns.findIndex((col) => col.id === active.id);
      const newIndex = board.columns.findIndex((col) => col.id === over.id);

      if (oldIndex !== newIndex) {
        const newColumns = arrayMove(board.columns, oldIndex, newIndex);
        reorderColumns(board.id, newColumns);
      }
    }
    // Handle task movement
    else if (activeData?.type !== 'column') {
      const taskId = active.id as string;
      
      if (overData?.type === 'column') {
        moveTask(taskId, over.id as string);
      } else if (board.columns.some((col) => col.id === over.id)) {
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

  if (!board) {
    return <div>No board selected</div>;
  }

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
        items={board.columns.map((col) => col.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {board.columns.map((column) => (
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