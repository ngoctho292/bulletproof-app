import { Workflow } from '../types';

export const workflowTemplates: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Email Notification on Task Complete',
    description: 'Send email when a task is marked as complete',
    isActive: false,
    nodes: [
      {
        id: '1',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: {
          label: 'Task Completed',
          description: 'Triggers when task status changes to done',
          config: { triggerType: 'event' },
        },
      },
      {
        id: '2',
        type: 'notification',
        position: { x: 250, y: 200 },
        data: {
          label: 'Send Email',
          description: 'Notify team members',
          config: { channel: 'email', message: 'Task has been completed!' },
        },
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
      },
    ],
  },
  {
    name: 'Approval Workflow',
    description: 'Review and approve/reject items',
    isActive: false,
    nodes: [
      {
        id: '1',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: {
          label: 'New Submission',
          description: 'Triggers on new item submission',
        },
      },
      {
        id: '2',
        type: 'condition',
        position: { x: 250, y: 200 },
        data: {
          label: 'Check Status',
          description: 'Approved or Rejected?',
          config: { condition: 'status == approved' },
        },
      },
      {
        id: '3',
        type: 'notification',
        position: { x: 100, y: 350 },
        data: {
          label: 'Approved Notification',
          description: 'Send approval email',
        },
      },
      {
        id: '4',
        type: 'notification',
        position: { x: 400, y: 350 },
        data: {
          label: 'Rejected Notification',
          description: 'Send rejection email',
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3', sourceHandle: 'true' },
      { id: 'e2-4', source: '2', target: '4', sourceHandle: 'false' },
    ],
  },
];