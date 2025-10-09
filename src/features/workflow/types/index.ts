import type { Node, Edge, NodeProps } from 'reactflow';

export type NodeType = 
  | 'trigger'
  | 'action'
  | 'condition'
  | 'delay'
  | 'notification'
  | 'api'
  | 'email';

// Node data structure
export interface NodeData {
  label: string;
  description?: string;
  config?: Record<string, any>;
  icon?: string;
}

// Edge data structure
export interface EdgeData {
  label?: string;
  condition?: string;
}

// Workflow-specific node type (extends React Flow's Node)
export type WorkflowNode = Node<NodeData>;

// Workflow-specific edge type (extends React Flow's Edge)
export type WorkflowEdge = Edge<EdgeData>;

// Workflow definition
export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Node Props type for custom components
export type CustomNodeProps = NodeProps<NodeData>;