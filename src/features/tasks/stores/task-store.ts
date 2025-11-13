import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task } from '../types';

interface TaskStore {
  token: string | null;
  userId: number | null;
  username: string | null;
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setAuth: (token: string, userId: number, username: string) => void;
  clearAuth: () => void;
  setTasks: (tasks: Task[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  updateTaskRunningFlag: (taskId: number, runningFlag: number) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      username: null,
      tasks: [],
      isLoading: false,
      error: null,

      setAuth: (token, userId, username) =>
        set({ token, userId, username }),

      clearAuth: () =>
        set({ token: null, userId: null, username: null, tasks: [] }),

      setTasks: (tasks) => set({ tasks }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      updateTaskRunningFlag: (taskId, runningFlag) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.task_id === taskId ? { ...task, running_flag: runningFlag } : task
          ),
        })),
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({
        token: state.token,
        userId: state.userId,
        username: state.username,
      }),
    }
  )
);
