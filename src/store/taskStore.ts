import { create } from 'zustand';
import { Task, Category, Priority } from '../types/task';

interface TaskState {
  tasks: Task[];
  categories: Category[];
  activeTaskId: string | null;
  autoCheckTasks: boolean;
  autoSwitchTasks: boolean;
  filter: {
    status: 'all' | 'completed' | 'active';
    category: string | null;
    priority: Priority | null;
  };
  sort: {
    by: 'priority' | 'dueDate' | 'category' | 'order';
    direction: 'asc' | 'desc';
  };
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'order' | 'completedPomodoros'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'order'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  setFilter: (filter: Partial<TaskState['filter']>) => void;
  setSort: (sort: Partial<TaskState['sort']>) => void;
  reorderTasks: (tasks: Task[]) => void;
  reorderCategories: (categories: Category[]) => void;
  setActiveTask: (taskId: string | null) => void;
  incrementPomodoroCount: (taskId: string) => void;
  setAutoCheckTasks: (autoCheck: boolean) => void;
  setAutoSwitchTasks: (autoSwitch: boolean) => void;
  switchToNextTask: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  categories: [],
  activeTaskId: null,
  autoCheckTasks: false,
  autoSwitchTasks: false,
  filter: {
    status: 'all',
    category: null,
    priority: null,
  },
  sort: {
    by: 'order',
    direction: 'asc',
  },
  addTask: (task) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          order: state.tasks.length,
          completedPomodoros: 0,
        },
      ],
    })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
      activeTaskId: state.activeTaskId === id ? null : state.activeTaskId,
    })),
  addCategory: (category) => {
    const newCategory = {
      ...category,
      id: crypto.randomUUID(),
      order: 0,
    };
    set((state) => ({
      categories: [...state.categories, newCategory],
    }));
    return newCategory;
  },
  updateCategory: (id, updates) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id ? { ...category, ...updates } : category
      ),
    })),
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
      tasks: state.tasks.filter((task) => task.categoryId !== id),
    })),
  setFilter: (filter) =>
    set((state) => ({
      filter: { ...state.filter, ...filter },
    })),
  setSort: (sort) =>
    set((state) => ({
      sort: { ...state.sort, ...sort },
    })),
  reorderTasks: (tasks) =>
    set(() => ({
      tasks,
    })),
  reorderCategories: (categories) =>
    set(() => ({
      categories,
    })),
  setActiveTask: (taskId) =>
    set(() => ({
      activeTaskId: taskId,
    })),
  incrementPomodoroCount: (taskId) =>
    set((state) => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (!task) return state;

      const updatedTasks = state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completedPomodoros: t.completedPomodoros + 1,
              completed: state.autoCheckTasks && t.completedPomodoros + 1 >= t.estimatedPomodoros,
            }
          : t
      );

      if (state.autoSwitchTasks && task.completedPomodoros + 1 >= task.estimatedPomodoros) {
        const nextTask = get().switchToNextTask();
        return {
          tasks: updatedTasks,
          activeTaskId: nextTask?.id || null,
        };
      }

      return { tasks: updatedTasks };
    }),
  setAutoCheckTasks: (autoCheck) =>
    set(() => ({
      autoCheckTasks: autoCheck,
    })),
  setAutoSwitchTasks: (autoSwitch) =>
    set(() => ({
      autoSwitchTasks: autoSwitch,
    })),
  switchToNextTask: () => {
    const state = get();
    const incompleteTasks = state.tasks
      .filter((t) => !t.completed)
      .sort((a, b) => a.order - b.order);
    
    const currentIndex = incompleteTasks.findIndex((t) => t.id === state.activeTaskId);
    const nextTask = incompleteTasks[currentIndex + 1] || incompleteTasks[0];
    
    if (nextTask) {
      set({ activeTaskId: nextTask.id });
      return nextTask;
    }
    
    return null;
  },
}));