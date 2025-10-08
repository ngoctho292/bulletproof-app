export interface Task {
  id: string;
  title: string;
  description: string;
  status: string; // Thay đổi từ literal type sang string
  createdAt: Date;
}

export interface Column {
  id: string;
  title: string;
  color?: string; // Thêm màu tùy chỉnh
}