'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTaskStore } from '@/features/tasks/stores/task-store';
import {
  getTaskList,
  doingTask,
  doneTask,
  addTaskComment,
} from '@/features/tasks/api/task-api';
import { ProjectGroup } from '@/features/tasks/components/project-group';
import { useToast } from '@/components/ui/toast';
import type { Task } from '@/features/tasks/types';

export default function TasksPage() {
  const router = useRouter();
  const toast = useToast();
  const { token, userId, username, tasks, setTasks, clearAuth } = useTaskStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (!token || !userId) {
      router.push('/login-v2');
      return;
    }

    loadTasks();
  }, [token, userId]);

  const loadTasks = async () => {
    if (!token || !userId) return;

    setIsLoading(true);
    try {
      const response = await getTaskList(token, userId);
      console.log("Response:", response);
      
      // Parse the data string to get the actual data object
      const parsedData = JSON.parse(response.data);
      
      // Combine tasks from both doing_assignee_task_start and doing_assignee_task
      const tasksStart = parsedData.doing_assignee_task_start || [];
      const tasksDoing = parsedData.doing_assignee_task || [];
      const allTasks = [...tasksStart, ...tasksDoing];
      
      setTasks(allTasks);
    } catch (error) {
      toast.error({ title: 'Không thể tải danh sách task' });
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoingTask = async (taskId: number) => {
    if (!token) return;
    await doingTask(token, { task_id: taskId });
  };

  const handleDoneTask = async (taskId: number) => {
    if (!token) return;
    await doneTask(token, { task_id: taskId });
  };

  const handleAddComment = async (taskId: number, comment: string) => {
    if (!token) return;
    await addTaskComment(token, {
      task_id: taskId,
      comment,
      file_attachment_ids: [],
    });
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login-v2');
  };

  const filteredTasks = tasks.filter((task) =>
    task.task_name.toLowerCase().includes(searchText.toLowerCase()) ||
    task.code.toLowerCase().includes(searchText.toLowerCase())
  );

  // Group tasks by project
  const groupedTasks = useMemo(() => {
    const groups = new Map<number | null, { projectName: string; tasks: Task[] }>();

    filteredTasks.forEach((task) => {
      const projectId = task.project_id;
      const projectName = task.project_name || 'Dự án khác';

      if (!groups.has(projectId)) {
        groups.set(projectId, { projectName, tasks: [] });
      }

      groups.get(projectId)!.tasks.push(task);
    });

    // Convert to array and sort: projects with tasks first, then by project name
    return Array.from(groups.entries())
      .sort(([aId, aGroup], [bId, bGroup]) => {
        // Null projects last
        if (aId === null && bId !== null) return 1;
        if (aId !== null && bId === null) return -1;
        // Sort by project name
        return aGroup.projectName.localeCompare(bGroup.projectName);
      });
  }, [filteredTasks]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản lý công việc
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Xin chào, <span className="font-medium">{username}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadTasks}
                className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg font-medium transition-colors"
              >
                🔄 Làm mới
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Tìm kiếm task theo tên hoặc mã..."
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchText
                ? 'Không tìm thấy task nào phù hợp'
                : 'Không có task nào'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Tìm thấy <span className="font-semibold">{filteredTasks.length}</span> task
              {' '}trong <span className="font-semibold">{groupedTasks.length}</span> dự án
            </div>
            <div className="space-y-6">
              {groupedTasks.map(([projectId, { projectName, tasks: projectTasks }]) => (
                <ProjectGroup
                  key={projectId ?? 'no-project'}
                  projectId={projectId}
                  projectName={projectName}
                  tasks={projectTasks}
                  token={token!}
                  onTaskUpdate={loadTasks}
                  onDoingTask={handleDoingTask}
                  onDoneTask={handleDoneTask}
                  onAddComment={handleAddComment}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
