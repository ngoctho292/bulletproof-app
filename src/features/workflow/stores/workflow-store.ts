import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Workflow, WorkflowNode, WorkflowEdge, NodeData, NodeType } from '../types';
import { nanoid } from 'nanoid';
import { addEdge as addReactFlowEdge, applyNodeChanges, applyEdgeChanges, Connection } from 'reactflow';

interface WorkflowState {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  
  // Workflow CRUD
  createWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  setCurrentWorkflow: (id: string | null) => void;
  
  // Node operations
  addNode: (node: { type: NodeType; position: { x: number; y: number }; data: NodeData }) => void;
  updateNode: (id: string, data: Partial<NodeData>) => void;
  deleteNode: (id: string) => void;
  onNodesChange: (changes: any) => void;
  
  // Edge operations
  addEdge: (connection: Connection) => void;
  deleteEdge: (id: string) => void;
  onEdgesChange: (changes: any) => void;
  
  // Workflow execution
  toggleWorkflowActive: (id: string) => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      workflows: [],
      currentWorkflow: null,

      createWorkflow: (workflow) => {
        const id = nanoid();
        const newWorkflow: Workflow = {
          ...workflow,
          id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          workflows: [...state.workflows, newWorkflow],
          currentWorkflow: newWorkflow,
        }));
        
        return id;
      },

      updateWorkflow: (id, updates) =>
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === id ? { ...w, ...updates, updatedAt: new Date() } : w
          ),
          currentWorkflow:
            state.currentWorkflow?.id === id
              ? { ...state.currentWorkflow, ...updates, updatedAt: new Date() }
              : state.currentWorkflow,
        })),

      deleteWorkflow: (id) =>
        set((state) => ({
          workflows: state.workflows.filter((w) => w.id !== id),
          currentWorkflow:
            state.currentWorkflow?.id === id ? null : state.currentWorkflow,
        })),

      setCurrentWorkflow: (id) =>
        set((state) => ({
          currentWorkflow:
            id === null ? null : state.workflows.find((w) => w.id === id) || null,
        })),

      addNode: (node) => {
        const newNode: WorkflowNode = {
          id: nanoid(),
          type: node.type,
          position: node.position,
          data: node.data,
        };
        
        set((state) => {
          if (!state.currentWorkflow) return state;
          
          return {
            currentWorkflow: {
              ...state.currentWorkflow,
              nodes: [...state.currentWorkflow.nodes, newNode],
            },
          };
        });
      },

      updateNode: (id, data) =>
        set((state) => {
          if (!state.currentWorkflow) return state;
          
          return {
            currentWorkflow: {
              ...state.currentWorkflow,
              nodes: state.currentWorkflow.nodes.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, ...data } } : node
              ),
            },
          };
        }),

      deleteNode: (id) =>
        set((state) => {
          if (!state.currentWorkflow) return state;
          
          return {
            currentWorkflow: {
              ...state.currentWorkflow,
              nodes: state.currentWorkflow.nodes.filter((node) => node.id !== id),
              edges: state.currentWorkflow.edges.filter(
                (edge) => edge.source !== id && edge.target !== id
              ),
            },
          };
        }),

      onNodesChange: (changes) =>
        set((state) => {
          if (!state.currentWorkflow) return state;
          
          return {
            currentWorkflow: {
              ...state.currentWorkflow,
              nodes: applyNodeChanges(changes, state.currentWorkflow.nodes),
            },
          };
        }),

      addEdge: (connection) =>
        set((state) => {
          if (!state.currentWorkflow) return state;
          
          const newEdges = addReactFlowEdge(connection, state.currentWorkflow.edges);
          
          return {
            currentWorkflow: {
              ...state.currentWorkflow,
              edges: newEdges,
            },
          };
        }),

      deleteEdge: (id) =>
        set((state) => {
          if (!state.currentWorkflow) return state;
          
          return {
            currentWorkflow: {
              ...state.currentWorkflow,
              edges: state.currentWorkflow.edges.filter((edge) => edge.id !== id),
            },
          };
        }),

      onEdgesChange: (changes) =>
        set((state) => {
          if (!state.currentWorkflow) return state;
          
          return {
            currentWorkflow: {
              ...state.currentWorkflow,
              edges: applyEdgeChanges(changes, state.currentWorkflow.edges),
            },
          };
        }),

      toggleWorkflowActive: (id) =>
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === id ? { ...w, isActive: !w.isActive } : w
          ),
        })),
    }),
    {
      name: 'workflow-storage',
    }
  )
);