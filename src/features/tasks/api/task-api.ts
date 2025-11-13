import type {
  LoginV2Request,
  LoginV2Response,
  TaskListResponse,
  TaskActionResponse,
  AddCommentRequest,
  DoingTaskRequest,
  DoneTaskRequest,
} from '../types';

// Use Next.js API routes as proxy to avoid CORS issues
const API_PREFIX = '/api/tasks';

// Login V2
export const loginV2 = async (
  credentials: LoginV2Request
): Promise<LoginV2Response> => {
  const response = await fetch(`${API_PREFIX}/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const result = await response.json();
  
  // Check if API returned success: false
  if (!result.success) {
    throw new Error(result.message || 'Login failed');
  }

  return result;
};

// Get Task List
export const getTaskList = async (
  token: string,
  userId: number,
  startDate: string = '01/01/2025',
  endDate: string = '31/12/2025',
  searchText: string = ''
): Promise<TaskListResponse> => {
  const params = new URLSearchParams({
    userId: userId.toString(),
    searchText,
    startDate,
    endDate,
  });

  const response = await fetch(`${API_PREFIX}/list?${params}`, {
    method: 'GET',
    headers: {
      'authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  const result = await response.json();
  
  // Check if API returned success: false
  if (result.success === false) {
    throw new Error(result.message || 'Failed to fetch tasks');
  }

  return result;
};

// Start/Stop Task (Doing Task)
export const doingTask = async (
  token: string,
  data: DoingTaskRequest
): Promise<TaskActionResponse> => {
  const response = await fetch(`${API_PREFIX}/doing`, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update task status');
  }

  const result = await response.json();
  
  // Check if API returned success: false
  if (!result.success) {
    throw new Error(result.message || 'Failed to update task status');
  }

  return result;
};

// Complete Task
export const doneTask = async (
  token: string,
  data: DoneTaskRequest
): Promise<TaskActionResponse> => {
  const response = await fetch(`${API_PREFIX}/done`, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to complete task');
  }

  const result = await response.json();
  
  // Check if API returned success: false
  if (!result.success) {
    throw new Error(result.message || 'Failed to complete task');
  }

  return result;
};

// Add Comment to Task
export const addTaskComment = async (
  token: string,
  data: AddCommentRequest
): Promise<TaskActionResponse> => {
  const response = await fetch(`${API_PREFIX}/comment`, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to add comment');
  }

  const result = await response.json();
  
  // Check if API returned success: false
  if (!result.success) {
    throw new Error(result.message || 'Failed to add comment');
  }

  return result;
};
