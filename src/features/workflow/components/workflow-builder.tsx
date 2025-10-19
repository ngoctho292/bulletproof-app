'use client';

import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  useReactFlow,
  ReactFlowProvider,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../stores/workflow-store';
import { NodeToolbar } from './node-toolbar';
import { NodeConfigPanel } from './node-config-panel';
import { ExecutionPanel } from './execution-panel';
import { TriggerNode } from './nodes/trigger-node';
import { ActionNode } from './nodes/action-node';
import { ConditionNode } from './nodes/condition-node';
import { DelayNode } from './nodes/delay-node';
import { NotificationNode } from './nodes/notification-node';
import { NodeType } from '../types';
import { Save, Play, Settings, Download } from 'lucide-react';
import { downloadWorkflow } from '../utils/workflow-io';
import { WorkflowExecutor, ExecutionResult, ExecutionLog } from '../utils/workflow-executor';

// ✅ Move nodeTypes OUTSIDE the component
const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
  notification: NotificationNode,
  api: ActionNode,
  email: NotificationNode,
};

function WorkflowBuilderInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const {
    currentWorkflow,
    onNodesChange,
    onEdgesChange,
    addEdge,
    addNode,
    updateWorkflow,
  } = useWorkflowStore();

  const onConnect = useCallback(
    (params: any) => {
      addEdge(params);
    },
    [addEdge]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      
      if (!type || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        type,
        position,
        data: {
          label: `New ${type}`,
          description: `Configure this ${type}`,
          config: {},
        },
      };

      addNode(newNode);
    },
    [project, addNode]
  );

  const handleAddNodeClick = useCallback(
    (type: NodeType) => {
      const position = {
        x: Math.random() * 500,
        y: Math.random() * 500,
      };

      const newNode = {
        type,
        position,
        data: {
          label: `New ${type}`,
          description: `Configure this ${type}`,
          config: {},
        },
      };

      addNode(newNode);
    },
    [addNode]
  );

  const handleSave = useCallback(() => {
    if (!currentWorkflow) return;
    
    updateWorkflow(currentWorkflow.id, {
      nodes: currentWorkflow.nodes,
      edges: currentWorkflow.edges,
    });
    
    alert('Workflow saved!');
  }, [currentWorkflow, updateWorkflow]);

  const handleExport = useCallback(() => {
    if (!currentWorkflow) return;
    downloadWorkflow(currentWorkflow);
  }, [currentWorkflow]);

  const handleRun = useCallback(async () => {
    if (!currentWorkflow) return;
    
    if (currentWorkflow.nodes.length === 0) {
      alert('Add some nodes to the workflow first!');
      return;
    }

    setIsRunning(true);
    setExecutionResult(null);

    const executor = new WorkflowExecutor(
      currentWorkflow,
      (log: ExecutionLog) => {
        // Update execution result with new log
        setExecutionResult((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            logs: [...prev.logs, log],
          };
        });
      }
    );

    try {
      const result = await executor.execute();
      setExecutionResult(result);
    } catch (error: any) {
      console.error('Workflow execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  }, [currentWorkflow]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  if (!currentWorkflow) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No workflow selected</p>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-4 relative">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 space-y-4">
        <NodeToolbar onAddNode={handleAddNodeClick} />
        
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-bold mb-3">Actions</h3>
          <div className="space-y-2">
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={18} />
              Save
            </button>
            
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Download size={18} />
              Export
            </button>
            
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Play size={18} className={isRunning ? 'animate-pulse' : ''} />
              {isRunning ? 'Running...' : 'Run Workflow'}
            </button>

            {selectedNodeId && (
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Settings size={18} />
                Configure
              </button>
            )}
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-bold mb-2">Statistics</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Nodes:</span>
              <span className="font-medium">{currentWorkflow.nodes.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Connections:</span>
              <span className="font-medium">{currentWorkflow.edges.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 border rounded-lg overflow-hidden bg-gray-50" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={currentWorkflow.nodes as Node[]}
          edges={currentWorkflow.edges as Edge[]}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          proOptions={{ hideAttribution: true }}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              switch (node.type) {
                case 'trigger':
                  return '#a78bfa';
                case 'action':
                  return '#60a5fa';
                case 'condition':
                  return '#fbbf24';
                case 'delay':
                  return '#9ca3af';
                case 'notification':
                  return '#34d399';
                default:
                  return '#e5e7eb';
              }
            }}
          />
        </ReactFlow>
      </div>

      {/* Config Panel */}
      {selectedNodeId && !executionResult && (
        <NodeConfigPanel
          nodeId={selectedNodeId}
          onClose={() => setSelectedNodeId(null)}
        />
      )}

      {/* Execution Panel */}
      {executionResult && (
        <ExecutionPanel
          result={executionResult}
          isRunning={isRunning}
          onClose={() => setExecutionResult(null)}
        />
      )}
    </div>
  );
}

export function WorkflowBuilder() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderInner />
    </ReactFlowProvider>
  );
}