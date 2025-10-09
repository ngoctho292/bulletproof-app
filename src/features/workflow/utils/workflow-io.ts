import { Workflow } from '../types';

export interface ExportedWorkflow extends Omit<Workflow, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
  version: string;
}

export const exportWorkflow = (workflow: Workflow): string => {
  const exportData: ExportedWorkflow = {
    ...workflow,
    createdAt: workflow.createdAt.toISOString(),
    updatedAt: workflow.updatedAt.toISOString(),
    version: '1.0.0',
  };

  return JSON.stringify(exportData, null, 2);
};

export const downloadWorkflow = (workflow: Workflow) => {
  const json = exportWorkflow(workflow);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `${workflow.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const validateWorkflowJSON = (json: any): json is ExportedWorkflow => {
  return (
    typeof json === 'object' &&
    json !== null &&
    typeof json.id === 'string' &&
    typeof json.name === 'string' &&
    typeof json.description === 'string' &&
    Array.isArray(json.nodes) &&
    Array.isArray(json.edges) &&
    typeof json.isActive === 'boolean' &&
    typeof json.version === 'string'
  );
};

export const importWorkflow = (jsonString: string): Workflow | null => {
  try {
    const parsed = JSON.parse(jsonString);
    
    if (!validateWorkflowJSON(parsed)) {
      throw new Error('Invalid workflow format');
    }

    const workflow: Workflow = {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
    };

    return workflow;
  } catch (error) {
    console.error('Failed to import workflow:', error);
    return null;
  }
};