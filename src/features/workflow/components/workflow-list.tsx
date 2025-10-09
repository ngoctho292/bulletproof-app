'use client';

import { useWorkflowStore } from '../stores/workflow-store';
import { Plus, Play, Pause, Trash2, Edit, Download, Upload, Copy } from 'lucide-react';
import { useState, useRef } from 'react';
import { downloadWorkflow, importWorkflow } from '../utils/workflow-io';
import { nanoid } from 'nanoid';

export function WorkflowList() {
  const { 
    workflows, 
    createWorkflow, 
    setCurrentWorkflow, 
    toggleWorkflowActive, 
    deleteWorkflow 
  } = useWorkflowStore();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    if (!newWorkflowName.trim()) return;

    createWorkflow({
      name: newWorkflowName,
      description: newWorkflowDescription,
      nodes: [],
      edges: [],
      isActive: false,
    });

    setNewWorkflowName('');
    setNewWorkflowDescription('');
    setShowCreateForm(false);
  };

  const handleExport = (workflow: any) => {
    downloadWorkflow(workflow);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const workflow = importWorkflow(text);

      if (!workflow) {
        alert('Invalid workflow file format');
        return;
      }

      // Generate new ID for imported workflow
      const newWorkflow = {
        ...workflow,
        id: nanoid(),
        name: `${workflow.name} (Imported)`,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: false,
      };

      createWorkflow(newWorkflow);
      alert(`Workflow "${workflow.name}" imported successfully!`);
    } catch (error) {
      alert('Failed to import workflow file');
      console.error(error);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDuplicate = (workflow: any) => {
    const duplicatedWorkflow = {
      ...workflow,
      name: `${workflow.name} (Copy)`,
      description: workflow.description,
      nodes: workflow.nodes,
      edges: workflow.edges,
      isActive: false,
    };

    createWorkflow(duplicatedWorkflow);
    alert(`Workflow duplicated!`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Workflows</h2>
        <div className="flex gap-2">
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Upload size={18} />
            Import
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            New Workflow
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {showCreateForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-3">Create New Workflow</h3>
          <input
            type="text"
            value={newWorkflowName}
            onChange={(e) => setNewWorkflowName(e.target.value)}
            placeholder="Workflow name"
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <textarea
            value={newWorkflowDescription}
            onChange={(e) => setNewWorkflowDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-3 py-2 border rounded mb-3 resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{workflow.name}</h3>
                <p className="text-sm text-gray-600">{workflow.description}</p>
              </div>
              <div
                className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ml-2 ${
                  workflow.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {workflow.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>{workflow.nodes.length} nodes</span>
              <span>{workflow.edges.length} connections</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => setCurrentWorkflow(workflow.id)}
                className="flex items-center justify-center gap-1 px-3 py-2 border rounded hover:bg-gray-50 text-sm"
              >
                <Edit size={14} />
                Edit
              </button>
              <button
                onClick={() => toggleWorkflowActive(workflow.id)}
                className={`px-3 py-2 rounded text-sm flex items-center justify-center gap-1 ${
                  workflow.isActive
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {workflow.isActive ? (
                  <>
                    <Pause size={14} />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    Activate
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleExport(workflow)}
                className="flex items-center justify-center gap-1 px-2 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                title="Export workflow"
              >
                <Download size={14} />
              </button>
              <button
                onClick={() => handleDuplicate(workflow)}
                className="flex items-center justify-center gap-1 px-2 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm"
                title="Duplicate workflow"
              >
                <Copy size={14} />
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this workflow?')) {
                    deleteWorkflow(workflow.id);
                  }
                }}
                className="flex items-center justify-center gap-1 px-2 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                title="Delete workflow"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {workflows.length === 0 && !showCreateForm && (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">No workflows yet</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowCreateForm(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first workflow
            </button>
            <span className="text-gray-300">or</span>
            <button
              onClick={handleImportClick}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Import existing workflow
            </button>
          </div>
        </div>
      )}
    </div>
  );
}