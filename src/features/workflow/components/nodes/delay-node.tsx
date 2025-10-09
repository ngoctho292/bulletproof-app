'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Clock } from 'lucide-react';

export const DelayNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-gradient-to-br from-gray-50 to-gray-100 min-w-[180px] ${
        selected ? 'border-gray-500 shadow-lg' : 'border-gray-300'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-500 !w-3 !h-3 !border-2 !border-white"
      />
      <div className="flex items-center gap-2 mb-2">
        <Clock size={18} className="text-gray-600" />
        <div className="font-semibold text-sm text-gray-900">Delay</div>
      </div>
      <div className="text-xs text-gray-700">{data.label}</div>
      {data.description && (
        <div className="text-xs text-gray-600 mt-1">{data.description}</div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-500 !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
});

DelayNode.displayName = 'DelayNode';