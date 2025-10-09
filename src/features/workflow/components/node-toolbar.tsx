'use client';

import { Zap, Play, GitBranch, Clock, Bell, Globe } from 'lucide-react';
import { NodeType } from '../types';

interface NodeTemplate {
  type: NodeType;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const nodeTemplates: NodeTemplate[] = [
  {
    type: 'trigger',
    label: 'Trigger',
    icon: <Zap size={18} />,
    color: 'bg-purple-100 hover:bg-purple-200 border-purple-300',
  },
  {
    type: 'action',
    label: 'Action',
    icon: <Play size={18} />,
    color: 'bg-blue-100 hover:bg-blue-200 border-blue-300',
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: <GitBranch size={18} />,
    color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300',
  },
  {
    type: 'delay',
    label: 'Delay',
    icon: <Clock size={18} />,
    color: 'bg-gray-100 hover:bg-gray-200 border-gray-300',
  },
  {
    type: 'notification',
    label: 'Notification',
    icon: <Bell size={18} />,
    color: 'bg-green-100 hover:bg-green-200 border-green-300',
  },
  {
    type: 'api',
    label: 'API Call',
    icon: <Globe size={18} />,
    color: 'bg-red-100 hover:bg-red-200 border-red-300',
  },
];

interface NodeToolbarProps {
  onAddNode: (type: NodeType) => void;
}

export function NodeToolbar({ onAddNode }: NodeToolbarProps) {
  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h3 className="font-bold mb-3">Nodes</h3>
      <div className="space-y-2">
        {nodeTemplates.map((template) => (
          <button
            key={template.type}
            draggable
            onDragStart={(e) => handleDragStart(e, template.type)}
            onClick={() => onAddNode(template.type)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded border-2 transition-colors ${template.color}`}
          >
            {template.icon}
            <span className="text-sm font-medium">{template.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}