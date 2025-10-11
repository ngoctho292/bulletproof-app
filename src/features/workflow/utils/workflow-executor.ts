import { Workflow, WorkflowNode, WorkflowEdge } from '../types';

export interface ExecutionLog {
  id: string;
  timestamp: Date;
  nodeId: string;
  nodeLabel: string;
  status: 'pending' | 'running' | 'success' | 'error' | 'skipped';
  message?: string;
  data?: any;
}

export interface ExecutionResult {
  workflowId: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed';
  logs: ExecutionLog[];
  totalNodes: number;
  executedNodes: number;
}

export class WorkflowExecutor {
  private workflow: Workflow;
  private logs: ExecutionLog[] = [];
  private executedNodes: Set<string> = new Set();
  private onLogUpdate?: (log: ExecutionLog) => void;

  constructor(workflow: Workflow, onLogUpdate?: (log: ExecutionLog) => void) {
    this.workflow = workflow;
    this.onLogUpdate = onLogUpdate;
  }

  async execute(): Promise<ExecutionResult> {
    const startTime = new Date();
    const result: ExecutionResult = {
      workflowId: this.workflow.id,
      startTime,
      status: 'running',
      logs: [],
      totalNodes: this.workflow.nodes.length,
      executedNodes: 0,
    };

    try {
      // Find trigger nodes (nodes without incoming edges)
      const triggerNodes = this.findTriggerNodes();

      if (triggerNodes.length === 0) {
        throw new Error('No trigger node found in workflow');
      }

      // Execute from each trigger node
      for (const triggerNode of triggerNodes) {
        await this.executeNode(triggerNode);
      }

      result.status = 'completed';
      result.endTime = new Date();
      result.executedNodes = this.executedNodes.size;
      result.logs = this.logs;
    } catch (error: any) {
      result.status = 'failed';
      result.endTime = new Date();
      result.logs = this.logs;
      
      this.addLog({
        nodeId: 'system',
        nodeLabel: 'System',
        status: 'error',
        message: error.message || 'Workflow execution failed',
      });
    }

    return result;
  }

  private findTriggerNodes(): WorkflowNode[] {
    const nodesWithIncoming = new Set(
      this.workflow.edges.map((edge) => edge.target)
    );

    return this.workflow.nodes.filter(
      (node) => !nodesWithIncoming.has(node.id)
    );
  }

  private async executeNode(node: WorkflowNode, context: any = {}): Promise<any> {
    // Check if already executed (avoid loops)
    if (this.executedNodes.has(node.id)) {
      this.addLog({
        nodeId: node.id,
        nodeLabel: node.data.label,
        status: 'skipped',
        message: 'Node already executed',
      });
      return context;
    }

    this.executedNodes.add(node.id);

    // Log node execution start
    this.addLog({
      nodeId: node.id,
      nodeLabel: node.data.label,
      status: 'running',
      message: `Executing ${node.type} node`,
    });

    try {
      // Simulate execution delay
      await this.delay(500);

      // Execute based on node type
      let result: any;
      switch (node.type) {
        case 'trigger':
          result = await this.executeTrigger(node, context);
          break;
        case 'action':
          result = await this.executeAction(node, context);
          break;
        case 'condition':
          result = await this.executeCondition(node, context);
          break;
        case 'delay':
          result = await this.executeDelay(node, context);
          break;
        case 'notification':
          result = await this.executeNotification(node, context);
          break;
        case 'api':
          result = await this.executeAPI(node, context);
          break;
        default:
          result = context;
      }

      // Log success
      this.addLog({
        nodeId: node.id,
        nodeLabel: node.data.label,
        status: 'success',
        message: `${node.type} completed successfully`,
        data: result,
      });

      // Execute next nodes
      await this.executeNextNodes(node, result);

      return result;
    } catch (error: any) {
      this.addLog({
        nodeId: node.id,
        nodeLabel: node.data.label,
        status: 'error',
        message: error.message || 'Node execution failed',
      });
      throw error;
    }
  }

  private async executeNextNodes(currentNode: WorkflowNode, context: any) {
    const outgoingEdges = this.workflow.edges.filter(
      (edge) => edge.source === currentNode.id
    );

    for (const edge of outgoingEdges) {
      const nextNode = this.workflow.nodes.find((n) => n.id === edge.target);
      if (nextNode) {
        // For condition nodes, check which branch to follow
        if (currentNode.type === 'condition' && edge.sourceHandle) {
          if (
            (edge.sourceHandle === 'true' && context.conditionResult === true) ||
            (edge.sourceHandle === 'false' && context.conditionResult === false)
          ) {
            await this.executeNode(nextNode, context);
          }
        } else {
          await this.executeNode(nextNode, context);
        }
      }
    }
  }

  private async executeTrigger(node: WorkflowNode, context: any): Promise<any> {
    const { config } = node.data;
    
    return {
      ...context,
      triggeredAt: new Date(),
      triggerType: config?.triggerType || 'manual',
      triggeredBy: 'system',
    };
  }

  private async executeAction(node: WorkflowNode, context: any): Promise<any> {
    const { config } = node.data;
    
    // Simulate action execution
    return {
      ...context,
      actionResult: {
        nodeId: node.id,
        label: node.data.label,
        executedAt: new Date(),
        config,
      },
    };
  }

  private async executeCondition(node: WorkflowNode, context: any): Promise<any> {
    const { config } = node.data;
    const condition = config?.condition || '';

    // Simple condition evaluation (you can make this more sophisticated)
    let conditionResult = false;
    
    try {
      // Example: "value > 100"
      if (condition.includes('>')) {
        const [left, right] = condition.split('>').map((s: any) => s.trim());
        const leftValue = this.evaluateExpression(left, context);
        const rightValue = parseFloat(right);
        conditionResult = leftValue > rightValue;
      } else if (condition.includes('==')) {
        const [left, right] = condition.split('==').map((s: any) => s.trim());
        const leftValue = this.evaluateExpression(left, context);
        conditionResult = leftValue == right.replace(/['"]/g, '');
      } else {
        // Default to true for demo
        conditionResult = true;
      }
    } catch (error) {
      console.error('Condition evaluation error:', error);
      conditionResult = false;
    }

    return {
      ...context,
      conditionResult,
      conditionExpression: condition,
    };
  }

  private async executeDelay(node: WorkflowNode, context: any): Promise<any> {
    const { config } = node.data;
    const duration = config?.duration || 1;
    const unit = config?.unit || 'seconds';

    // Convert to milliseconds
    let delayMs = duration * 1000; // default seconds
    if (unit === 'minutes') delayMs = duration * 60 * 1000;
    if (unit === 'hours') delayMs = duration * 60 * 60 * 1000;
    if (unit === 'days') delayMs = duration * 24 * 60 * 60 * 1000;

    // Cap at 5 seconds for demo
    delayMs = Math.min(delayMs, 5000);

    this.addLog({
      nodeId: node.id,
      nodeLabel: node.data.label,
      status: 'running',
      message: `Waiting for ${duration} ${unit}...`,
    });

    await this.delay(delayMs);

    return {
      ...context,
      delayedFor: `${duration} ${unit}`,
    };
  }

  private async executeNotification(node: WorkflowNode, context: any): Promise<any> {
    const { config } = node.data;
    const message = config?.message || 'Notification sent';
    const channel = config?.channel || 'email';

    // Simulate sending notification
    return {
      ...context,
      notificationSent: {
        channel,
        message,
        sentAt: new Date(),
      },
    };
  }

  private async executeAPI(node: WorkflowNode, context: any): Promise<any> {
    const { config } = node.data;
    const method = config?.method || 'GET';
    const url = config?.url || '';

    if (!url) {
      throw new Error('API URL is required');
    }

    try {
      // Parse headers - support both string and object
      let headers: Record<string, string> = {};
      if (config?.headers) {
        if (typeof config.headers === 'string') {
          try {
            headers = JSON.parse(config.headers);
          } catch (e) {
            console.error('Failed to parse headers:', e);
            throw new Error('Invalid headers JSON format');
          }
        } else if (typeof config.headers === 'object') {
          headers = config.headers;
        }
      }

      // Parse body - support both string and object
      let bodyData: any = null;
      if (config?.body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        if (typeof config.body === 'string') {
          try {
            bodyData = JSON.parse(config.body);
          } catch (e) {
            console.error('Failed to parse body:', e);
            throw new Error('Invalid body JSON format');
          }
        } else if (typeof config.body === 'object') {
          bodyData = config.body;
        }
      }

      this.addLog({
        nodeId: node.id,
        nodeLabel: node.data.label,
        status: 'running',
        message: `Making ${method} request to ${url}`,
      });

      // Log for debugging
      console.log('📤 API Request:', {
        method,
        url,
        headers,
        body: bodyData,
      });

      // Make API call
      const response = await fetch(url, {
        method,
        headers,
        body: bodyData ? JSON.stringify(bodyData) : undefined,
      });

      console.log('📥 API Response Status:', response.status);

      // Parse response
      let responseData: any;
      const contentType = response.headers.get('content-type');
      
      try {
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
      } catch (e) {
        responseData = { message: 'No response body' };
      }

      console.log('📥 API Response Data:', responseData);

      // SendGrid returns 202 Accepted on success
      if (!response.ok && response.status !== 202) {
        const errorMessage = typeof responseData === 'object' 
          ? JSON.stringify(responseData, null, 2)
          : responseData;
        
        throw new Error(`HTTP ${response.status}: ${errorMessage}`);
      }

      // Log success
      this.addLog({
        nodeId: node.id,
        nodeLabel: node.data.label,
        status: 'success',
        message: response.status === 202 
          ? 'Email queued for sending (202 Accepted)'
          : `Request successful (${response.status})`,
        data: { 
          status: response.status,
          statusText: response.statusText,
          response: responseData 
        },
      });

      return {
        ...context,
        apiResponse: {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        },
      };
    } catch (error: any) {
      console.error('❌ API Error:', error);
      throw new Error(`API call failed: ${error.message}`);
    }
  }

  private evaluateExpression(expr: string, context: any): any {
    // Simple expression evaluator
    // In production, use a proper expression parser
    if (expr === 'value') {
      return context.value || 0;
    }
    return expr;
  }

  private addLog(log: Omit<ExecutionLog, 'id' | 'timestamp'>) {
    const fullLog: ExecutionLog = {
      ...log,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };

    this.logs.push(fullLog);
    
    if (this.onLogUpdate) {
      this.onLogUpdate(fullLog);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}