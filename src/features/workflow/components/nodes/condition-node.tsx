'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { GitBranch } from 'lucide-react';

export const ConditionNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-gradient-to-br from-yellow-50 to-yellow-100 min-w-[180px] ${
        selected ? 'border-yellow-500 shadow-lg' : 'border-yellow-300'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-yellow-500 !w-3 !h-3 !border-2 !border-white"
      />
      <div className="flex items-center gap-2 mb-2">
        <GitBranch size={18} className="text-yellow-600" />
        <div className="font-semibold text-sm text-yellow-900">Condition</div>
      </div>
      <div className="text-xs text-yellow-700">{data.label}</div>
      {data.description && (
        <div className="text-xs text-yellow-600 mt-1">{data.description}</div>
      )}
      <div className="flex justify-between mt-2">
        <Handle
          type="source"
          position={Position.Bottom}
          id="true"
          className="!bg-green-500 !w-3 !h-3 !border-2 !border-white !left-1/4"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="false"
          className="!bg-red-500 !w-3 !h-3 !border-2 !border-white !left-3/4"
        />
      </div>
    </div>
  );
});

ConditionNode.displayName = 'ConditionNode';