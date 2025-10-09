'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Zap } from 'lucide-react';
import type { CustomNodeProps } from '../../types';

export const TriggerNode = memo(({ data, selected }: CustomNodeProps) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-gradient-to-br from-purple-50 to-purple-100 min-w-[180px] ${
        selected ? 'border-purple-500 shadow-lg' : 'border-purple-300'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Zap size={18} className="text-purple-600" />
        <div className="font-semibold text-sm text-purple-900">Trigger</div>
      </div>
      <div className="text-xs text-purple-700">{data.label}</div>
      {data.description && (
        <div className="text-xs text-purple-600 mt-1">{data.description}</div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-purple-500 !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
});

TriggerNode.displayName = 'TriggerNode';