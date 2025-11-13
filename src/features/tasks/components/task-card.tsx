'use client';

import { useState } from 'react';
import type { Task } from '../types';
import { useToast } from '@/components/ui/toast';

interface TaskCardProps {
  task: Task;
  token: string;
  onTaskUpdate: () => void;
  onDoingTask: (taskId: number) => Promise<void>;
  onDoneTask: (taskId: number) => Promise<void>;
  onAddComment: (taskId: number, comment: string) => Promise<void>;
}

export const TaskCard = ({
  task,
  token,
  onTaskUpdate,
  onDoingTask,
  onDoneTask,
  onAddComment,
}: TaskCardProps) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');

  const isRunning = task.running_flag === 1;
  const isDone = task.status_id === 10; // Assuming status 3 means done

  const handleDoingTask = async () => {
    setIsLoading(true);
    try {
      await onDoingTask(task.task_id);
      toast.success({
        title: isRunning ? 'Đã dừng task' : 'Đã bắt đầu task',
      });
      onTaskUpdate();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      toast.error({ title: errorMessage });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoneTask = async () => {
    setIsLoading(true);
    try {
      await onDoneTask(task.task_id);
      toast.success({ title: 'Đã cập nhật trạng thái task' });
      onTaskUpdate();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      toast.error({ title: errorMessage });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) {
      toast.warning({ title: 'Vui lòng nhập bình luận' });
      return;
    }

    setIsLoading(true);
    try {
      await onAddComment(task.task_id, comment);
      toast.success({ title: 'Đã thêm bình luận' });
      setComment('');
      setShowCommentInput(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      toast.error({ title: errorMessage });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {task.task_name}
          </h3>
          <p className="text-sm text-gray-600 font-mono">{task.code}</p>
        </div>
        {isRunning && (
          <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            Đang chạy
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-700">
        <div className="flex items-center">
          <span className="font-medium w-32">Người thực hiện:</span>
          <span>{task.account_name}</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium w-32">Thời gian:</span>
          <span>
            {task.schedule_start} → {task.schedule_end}
          </span>
        </div>
        <div className="flex items-center">
          <span className="font-medium w-32">Số giờ yêu cầu:</span>
          <span className="font-semibold text-indigo-600">
            {task.planned_duration_time}h
          </span>
        </div>
        <div className="flex items-center">
          <span className="font-medium w-32">Thực tế:</span>
          <span className="text-gray-600">
            {task.actual_execution_time.toFixed(2)}h
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
        <button
          onClick={handleDoingTask}
          disabled={isLoading}
          className={`flex-1 min-w-[120px] px-4 py-2 rounded-lg font-medium transition-colors ${
            isRunning
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isRunning ? '⏸ Dừng' : '▶ Bắt đầu'}
        </button>

        <button
          onClick={handleDoneTask}
          disabled={isLoading}
          className="flex-1 min-w-[120px] px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDone ? '↺ Huỷ hoàn thành' : '✓ Hoàn thành'}
        </button>

        <button
          onClick={() => setShowCommentInput(!showCommentInput)}
          disabled={isLoading}
          className="flex-1 min-w-[120px] px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          💬 Bình luận
        </button>
      </div>

      {/* Comment Input */}
      {showCommentInput && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Nhập bình luận của bạn..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddComment}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Gửi
            </button>
            <button
              onClick={() => {
                setShowCommentInput(false);
                setComment('');
              }}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Huỷ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
