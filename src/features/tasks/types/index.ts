export interface LoginV2Request {
  username: string;
  password: string;
}

export interface LoginV2Response {
  message: string;
  data: {
    token: {
      access_token: string;
      expires_in: number;
    };
    user: {
      user_id: number;
      username: string;
      telegram_id: string;
      active: boolean;
      role_id: number;
      status: number;
      show_notify: number;
    };
  };
  error: string | null;
  success: boolean;
  statusCode: number;
}

export interface Task {
  code: string;
  avatar: string;
  rating: number | null;
  status: number;
  step_id: number;
  task_id: number;
  jira_url: string;
  parent_id: number | null;
  status_id: number;
  task_name: string;
  actual_end: string | null;
  create_day: string;
  project_id: number | null;
  assignee_id: number;
  creator_flg: boolean;
  prefix_name: string;
  schedule_ed: string;
  schedule_sd: string;
  account_name: string;
  assignee_flg: boolean;
  project_name: string;
  running_flag: number;
  schedule_end: string;
  task_creator: number;
  schedule_start: string;
  complaint_status: number | null;
  actual_execution_time: number;
  planned_duration_time: number;
}

export interface TaskListResponse {
  message: string;
  data: string; // JSON string that contains the actual data object
  error: string | null;
  success: boolean;
  statusCode: number;
}

export interface TaskListData {
  done_assignee_task: Array<{
    code: string;
    avatar: string;
  }>;
  doing_assignee_task_start: Task[];
  doing_assignee_task: Task[]; // Add this field
}

export interface TaskActionResponse {
  message: string;
  data: string;
  error: string | null;
  success: boolean;
  statusCode: number;
}

export interface AddCommentRequest {
  comment: string;
  task_id: number;
  file_attachment_ids: number[];
}

export interface DoingTaskRequest {
  task_id: number;
}

export interface DoneTaskRequest {
  task_id: number;
}
