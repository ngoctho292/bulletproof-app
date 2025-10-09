'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Play } from 'lucide-react';

export const ActionNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-gradient-to-br from-blue-50 to-blue-100 min-w-[180px] ${
        selected ? 'border-blue-500 shadow-lg' : 'border-blue-300'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white"
      />
      <div className="flex items-center gap-2 mb-2">
        <Play size={18} className="text-blue-600" />
        <div className="font-semibold text-sm text-blue-900">Action</div>
      </div>
      <div className="text-xs text-blue-700">{data.label}</div>
      {data.description && (
        <div className="text-xs text-blue-600 mt-1">{data.description}</div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
});

ActionNode.displayName = 'ActionNode';