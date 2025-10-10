'use client';

import { X, Play, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { ExecutionLog, ExecutionResult } from '../utils/workflow-executor';

interface ExecutionPanelProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  onClose: () => void;
}

export function ExecutionPanel({ result, isRunning, onClose }: ExecutionPanelProps) {
  if (!result) return null;

  const getStatusIcon = (status: ExecutionLog['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={14} className="text-gray-400" />;
      case 'running':
        return <Play size={14} className="text-blue-500 animate-pulse" />;
      case 'success':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'error':
        return <XCircle size={14} className="text-red-500" />;
      case 'skipped':
        return <AlertCircle size={14} className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status: ExecutionLog['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-50 border-gray-200';
      case 'running':
        return 'bg-blue-50 border-blue-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'skipped':
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const duration = result.endTime
    ? result.endTime.getTime() - result.startTime.getTime()
    : Date.now() - result.startTime.getTime();

  return (
    <div className="absolute top-0 right-0 w-96 h-full bg-white border-l shadow-lg overflow-hidden z-20 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div>
          <h3 className="font-bold">Workflow Execution</h3>
          <p className="text-xs text-gray-500">
            {isRunning ? 'Running...' : `Completed in ${(duration / 1000).toFixed(2)}s`}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Stats */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Status</div>
            <div className="font-semibold capitalize flex items-center gap-2 mt-1">
              {result.status === 'running' && (
                <>
                  <Play size={16} className="text-blue-500 animate-pulse" />
                  <span className="text-blue-600">Running</span>
                </>
              )}
              {result.status === 'completed' && (
                <>
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-green-600">Completed</span>
                </>
              )}
              {result.status === 'failed' && (
                <>
                  <XCircle size={16} className="text-red-500" />
                  <span className="text-red-600">Failed</span>
                </>
              )}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Progress</div>
            <div className="font-semibold mt-1">
              {result.executedNodes} / {result.totalNodes} nodes
            </div>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {result.logs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded border ${getStatusColor(log.status)}`}
            >
              <div className="flex items-start gap-2">
                {getStatusIcon(log.status)}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{log.nodeLabel}</div>
                  <div className="text-xs text-gray-600 mt-1">{log.message}</div>
                  {log.data && (
                    <details className="mt-2">
                      <summary className="text-xs text-blue-600 cursor-pointer">
                        View data
                      </summary>
                      <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    </details>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    {log.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isRunning && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}