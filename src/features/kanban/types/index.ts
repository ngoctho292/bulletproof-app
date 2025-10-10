export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  assignedTo?: string[]; // Array of member IDs
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

export interface Column {
  id: string;
  title: string;
  color?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  color: string;
  columns: Column[];
  members: Member[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}