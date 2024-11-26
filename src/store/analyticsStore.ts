import { create } from 'zustand';
import { startOfDay, startOfWeek, format, eachDayOfInterval, subDays } from 'date-fns';
import { useTaskStore } from './taskStore';

interface DailyStats {
  date: string;
  focusMinutes: number;
  completedPomodoros: number;
  completedTasks: number;
}

interface AnalyticsState {
  dailyStats: DailyStats[];
  addFocusMinutes: (minutes: number) => void;
  calculateStats: () => {
    totalFocusTime: number;
    totalPomodoros: number;
    totalTasks: number;
    completionRate: number;
    weeklyStats: DailyStats[];
    focusDistribution: { [key: string]: number };
  };
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  dailyStats: [],

  addFocusMinutes: (minutes: number) => {
    const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
    
    set((state) => {
      const existingStats = state.dailyStats.find((stat) => stat.date === today);
      
      if (existingStats) {
        return {
          dailyStats: state.dailyStats.map((stat) =>
            stat.date === today
              ? { ...stat, focusMinutes: stat.focusMinutes + minutes }
              : stat
          ),
        };
      }

      return {
        dailyStats: [
          ...state.dailyStats,
          {
            date: today,
            focusMinutes: minutes,
            completedPomodoros: 0,
            completedTasks: 0,
          },
        ],
      };
    });
  },

  calculateStats: () => {
    const { tasks } = useTaskStore.getState();
    const { dailyStats } = get();
    
    const today = new Date();
    const lastWeek = subDays(today, 6);
    const weekDays = eachDayOfInterval({ start: lastWeek, end: today });
    
    const weeklyStats = weekDays.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return (
        dailyStats.find((stat) => stat.date === dateStr) || {
          date: dateStr,
          focusMinutes: 0,
          completedPomodoros: 0,
          completedTasks: 0,
        }
      );
    });

    const totalFocusTime = dailyStats.reduce(
      (sum, day) => sum + day.focusMinutes,
      0
    );

    const totalPomodoros = tasks.reduce(
      (sum, task) => sum + task.completedPomodoros,
      0
    );

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const completionRate = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

    const focusDistribution = tasks.reduce((acc, task) => {
      const hour = new Date(task.createdAt).getHours();
      const period = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
      acc[period] = (acc[period] || 0) + task.completedPomodoros;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalFocusTime,
      totalPomodoros,
      totalTasks,
      completionRate,
      weeklyStats,
      focusDistribution,
    };
  },
}));