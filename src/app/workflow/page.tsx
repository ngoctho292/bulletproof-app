'use client';

import { useWorkflowStore } from '@/features/workflow/stores/workflow-store';
import { WorkflowList } from '@/features/workflow/components/workflow-list';
import { WorkflowBuilder } from '@/features/workflow/components/workflow-builder';
import { ArrowLeft } from 'lucide-react';

export default function WorkflowPage() {
  const { currentWorkflow, setCurrentWorkflow } = useWorkflowStore();

  if (currentWorkflow) {
    return (
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="border-b px-4 py-3 bg-white flex-shrink-0">
          <div className="container mx-auto flex items-center gap-4">
            <button
              onClick={() => setCurrentWorkflow(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Workflows
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{currentWorkflow.name}</h1>
              <p className="text-sm text-gray-600">{currentWorkflow.description}</p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentWorkflow.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {currentWorkflow.isActive ? '● Active' : '○ Inactive'}
            </div>
          </div>
        </div>

        {/* Workflow Builder */}
        <div className="flex-1 overflow-hidden">
          <div className="container mx-auto h-full py-4">
            <WorkflowBuilder />
          </div>
        </div>
      </div>
    );
  }

  // Workflow List View
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Workflow Automation</h1>
          <p className="text-gray-600">
            Create and manage automated workflows to streamline your processes
          </p>
        </div>
        <WorkflowList />
      </div>
    </div>
  );
}