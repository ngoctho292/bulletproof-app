'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Bell } from 'lucide-react';

export const NotificationNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-gradient-to-br from-green-50 to-green-100 min-w-[180px] ${
        selected ? 'border-green-500 shadow-lg' : 'border-green-300'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-green-500 !w-3 !h-3 !border-2 !border-white"
      />
      <div className="flex items-center gap-2 mb-2">
        <Bell size={18} className="text-green-600" />
        <div className="font-semibold text-sm text-green-900">Notification</div>
      </div>
      <div className="text-xs text-green-700">{data.label}</div>
      {data.description && (
        <div className="text-xs text-green-600 mt-1">{data.description}</div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-green-500 !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
});

NotificationNode.displayName = 'NotificationNode';