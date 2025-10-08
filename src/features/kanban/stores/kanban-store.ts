import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Column } from '../types';
import { nanoid } from 'nanoid';

interface KanbanState {
  tasks: Task[];
  columns: Column[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (id: string) => void;
  moveTask: (id: string, status: string) => void;
  addColumn: (column: Omit<Column, 'id'>) => void;
  updateColumn: (id: string, updates: Partial<Column>) => void;
  deleteColumn: (id: string) => void;
  reorderColumns: (columns: Column[]) => void;
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      columns: [
        { id: 'todo', title: 'To Do', color: 'gray' },
        { id: 'in-progress', title: 'In Progress', color: 'blue' },
        { id: 'done', title: 'Done', color: 'green' },
      ],

      tasks: [
        {
          id: '1',
          title: 'Setup project',
          description: 'Initialize Next.js project with TypeScript',
          status: 'done',
          createdAt: new Date(),
        },
        {
          id: '2',
          title: 'Create components',
          description: 'Build reusable UI components',
          status: 'in-progress',
          createdAt: new Date(),
        },
        {
          id: '3',
          title: 'Write documentation',
          description: 'Document the codebase',
          status: 'todo',
          createdAt: new Date(),
        },
      ],

      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: nanoid(),
              createdAt: new Date(),
            },
          ],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      duplicateTask: (id) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;

          return {
            tasks: [
              ...state.tasks,
              {
                ...task,
                id: nanoid(),
                title: `${task.title} (Copy)`,
                createdAt: new Date(),
              },
            ],
          };
        }),

      moveTask: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status } : task
          ),
        })),

      addColumn: (column) =>
        set((state) => ({
          columns: [
            ...state.columns,
            {
              ...column,
              id: nanoid(),
            },
          ],
        })),

      updateColumn: (id, updates) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, ...updates } : col
          ),
        })),

      deleteColumn: (id) =>
        set((state) => {
          // Also delete all tasks in this column
          return {
            columns: state.columns.filter((col) => col.id !== id),
            tasks: state.tasks.filter((task) => task.status !== id),
          };
        }),

      reorderColumns: (columns) =>
        set({ columns }),
    }),
    {
      name: 'kanban-storage',
    }
  )
);