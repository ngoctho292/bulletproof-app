'use client';

import { useState } from 'react';
import { Task } from '../types';
import { TaskCard } from './task-card';

interface ProjectGroupProps {
  projectId: number | null;
  projectName: string;
  tasks: Task[];
  token: string;
  onTaskUpdate: () => void;
  onDoingTask: (taskId: number) => Promise<void>;
  onDoneTask: (taskId: number) => Promise<void>;
  onAddComment: (taskId: number, comment: string) => Promise<void>;
}

export const ProjectGroup = ({
  projectId,
  projectName,
  tasks,
  token,
  onTaskUpdate,
  onDoingTask,
  onDoneTask,
  onAddComment,
}: ProjectGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const displayName = projectName || 'Không có dự án';

  return (
    <div className="mb-6">
      {/* Project Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between bg-white px-6 py-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 mb-3"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {isExpanded ? '📂' : '📁'}
          </span>
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-900">
              {displayName}
            </h2>
            <p className="text-sm text-gray-500">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 font-medium">
            {isExpanded ? 'Thu gọn' : 'Mở rộng'}
          </span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Tasks Grid */}
      {isExpanded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pl-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.task_id}
              task={task}
              token={token}
              onTaskUpdate={onTaskUpdate}
              onDoingTask={onDoingTask}
              onDoneTask={onDoneTask}
              onAddComment={onAddComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};
