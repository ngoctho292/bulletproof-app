import { useEffect, useRef, useCallback } from 'react';
import { doingTask } from '../api/task-api';
import type { Task } from '../types';

interface UseAutoStopTaskProps {
  tasks: Task[];
  token: string | null;
  onTaskStopped: (taskId: number, taskName: string) => void;
  enabled?: boolean;
  thresholdPercent?: number; // Default 90%
  checkIntervalMinutes?: number; // Default 2 minutes
}

export function useAutoStopTask({
  tasks,
  token,
  onTaskStopped,
  enabled = true,
  thresholdPercent = 90,
  checkIntervalMinutes = 2,
}: UseAutoStopTaskProps) {
  const stoppedTasksRef = useRef<Set<number>>(new Set());
  
  // Use refs to avoid stale closure
  const tasksRef = useRef<Task[]>(tasks);
  const tokenRef = useRef<string | null>(token);
  const thresholdRef = useRef<number>(thresholdPercent);
  const onTaskStoppedRef = useRef(onTaskStopped);

  // Update refs when props change
  useEffect(() => {
    tasksRef.current = tasks;
    tokenRef.current = token;
    thresholdRef.current = thresholdPercent;
    onTaskStoppedRef.current = onTaskStopped;
  }, [tasks, token, thresholdPercent, onTaskStopped]);

  const checkAndStopTasks = useCallback(async () => {
    const currentToken = tokenRef.current;
    const currentTasks = tasksRef.current;
    const currentThreshold = thresholdRef.current;
    
    if (!currentToken || currentTasks.length === 0) return;

    const runningTasks = currentTasks.filter((task) => task.running_flag === 1);

    for (const task of runningTasks) {
      // Skip if already auto-stopped
      if (stoppedTasksRef.current.has(task.task_id)) continue;

      // Skip if no planned duration
      if (!task.planned_duration_time || task.planned_duration_time <= 0) continue;

      const workedHours = task.actual_execution_time;
      const plannedHours = task.planned_duration_time;
      const progressPercent = (workedHours / plannedHours) * 100;

      // Auto-stop at threshold or more
      if (progressPercent >= currentThreshold) {
        try {
          await doingTask(currentToken, { task_id: task.task_id });
          stoppedTasksRef.current.add(task.task_id);
          onTaskStoppedRef.current(task.task_id, task.task_name);

          console.log(
            `🛑 Auto-stopped task: ${task.task_name} (${progressPercent.toFixed(1)}%)`
          );
        } catch (error) {
          console.error('Failed to auto-stop task:', task.task_name, error);
        }
      }
    }
  }, []); // Empty deps - function never changes, uses refs

  useEffect(() => {
    if (!enabled || !token || tasks.length === 0) return;

    // Check immediately on mount
    checkAndStopTasks();

    // Then check at intervals
    const intervalId = setInterval(
      checkAndStopTasks,
      checkIntervalMinutes * 60 * 1000
    );

    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, token, checkIntervalMinutes, checkAndStopTasks, tasks.length]);

  // Reset stopped tasks tracking when tasks change significantly
  useEffect(() => {
    const runningTaskIds = new Set(
      tasks.filter((t) => t.running_flag === 1).map((t) => t.task_id)
    );

    // Remove stopped tasks that are no longer running
    stoppedTasksRef.current.forEach((taskId) => {
      if (!runningTaskIds.has(taskId)) {
        stoppedTasksRef.current.delete(taskId);
      }
    });
  }, [tasks]);
}
