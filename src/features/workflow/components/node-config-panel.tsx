'use client';

import { useState, useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { X } from 'lucide-react';
import { useWorkflowStore } from '../stores/workflow-store';

interface NodeConfigPanelProps {
  nodeId: string | null;
  onClose: () => void;
}

export function NodeConfigPanel({ nodeId, onClose }: NodeConfigPanelProps) {
  const { getNode } = useReactFlow();
  const { updateNode } = useWorkflowStore();
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [config, setConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!nodeId) return;
    
    const node = getNode(nodeId);
    if (node) {
      setLabel(node.data.label || '');
      setDescription(node.data.description || '');
      setConfig(node.data.config || {});
    }
  }, [nodeId, getNode]);

  const handleSave = () => {
    if (!nodeId) return;
    
    updateNode(nodeId, {
      label,
      description,
      config,
    });
    
    onClose();
  };

  if (!nodeId) return null;

  const node = getNode(nodeId);
  if (!node) return null;

  return (
    <div className="absolute top-0 right-0 w-80 h-full bg-white border-l shadow-lg overflow-y-auto z-10">
      <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
        <h3 className="font-bold">Configure Node</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Node Type</label>
          <div className="px-3 py-2 bg-gray-50 rounded text-sm capitalize">
            {node.type}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter label"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            placeholder="Enter description"
          />
        </div>

        {/* Node-specific configurations */}
        {node.type === 'trigger' && (
          <div>
            <label className="block text-sm font-medium mb-2">Trigger Type</label>
            <select
              value={config.triggerType || 'manual'}
              onChange={(e) => setConfig({ ...config, triggerType: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="manual">Manual</option>
              <option value="schedule">Schedule</option>
              <option value="webhook">Webhook</option>
              <option value="event">Event</option>
            </select>
          </div>
        )}

        {node.type === 'condition' && (
          <div>
            <label className="block text-sm font-medium mb-2">Condition</label>
            <input
              type="text"
              value={config.condition || ''}
              onChange={(e) => setConfig({ ...config, condition: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., value > 100"
            />
          </div>
        )}

        {node.type === 'delay' && (
          <div>
            <label className="block text-sm font-medium mb-2">Delay Duration</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={config.duration || 1}
                onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) })}
                className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                min="1"
              />
              <select
                value={config.unit || 'minutes'}
                onChange={(e) => setConfig({ ...config, unit: e.target.value })}
                className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>
        )}

        {node.type === 'notification' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                value={config.message || ''}
                onChange={(e) => setConfig({ ...config, message: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                placeholder="Enter notification message"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Channel</label>
              <select
                value={config.channel || 'email'}
                onChange={(e) => setConfig({ ...config, channel: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="email">Email</option>
                <option value="slack">Slack</option>
                <option value="sms">SMS</option>
                <option value="push">Push Notification</option>
              </select>
            </div>
          </>
        )}

        {node.type === 'api' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">HTTP Method</label>
              <select
                value={config.method || 'GET'}
                onChange={(e) => setConfig({ ...config, method: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL</label>
              <input
                type="text"
                value={config.url || ''}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="https://api.example.com/endpoint"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Headers (JSON)</label>
              <textarea
                value={config.headers || '{}'}
                onChange={(e) => setConfig({ ...config, headers: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 resize-none font-mono text-xs"
                rows={3}
                placeholder='{"Content-Type": "application/json"}'
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Body (JSON)</label>
              <textarea
                value={config.body || '{}'}
                onChange={(e) => setConfig({ ...config, body: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 resize-none font-mono text-xs"
                rows={4}
                placeholder='{"key": "value"}'
              />
            </div>
          </>
        )}

        <div className="pt-4 border-t">
          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}