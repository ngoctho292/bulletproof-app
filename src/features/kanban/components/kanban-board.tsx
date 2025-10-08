'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useState } from 'react';
import { useKanbanStore } from '../stores/kanban-store';
import { KanbanColumn } from './kanban-column';
import { TaskCard } from './task-card';
import { Task } from '../types';
import { AddTaskForm } from './add-task-form';
import { AddColumnForm } from './add-column-form';

export function KanbanBoard() {
  const { tasks, columns, moveTask } = useKanbanStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    const newStatus = over.id as string;

    // Check if dropping on a column
    const isColumn = columns.some((col) => col.id === newStatus);
    if (isColumn) {
      moveTask(taskId, newStatus);
    }

    setActiveTask(null);
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80 flex flex-col">
            <KanbanColumn
              column={column}
              tasks={getTasksByStatus(column.id)}
            />
            <div className="mt-4 flex-shrink-0">
              <AddTaskForm defaultStatus={column.id} />
            </div>
          </div>
        ))}
        
        <AddColumnForm />
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 scale-105">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}