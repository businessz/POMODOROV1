export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  categoryId: string;
  completed: boolean;
  order: number;
  createdAt: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  order: number;
}