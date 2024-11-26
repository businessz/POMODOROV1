import { create } from 'zustand';

interface TimerState {
  isRunning: boolean;
  time: number;
  mode: 'work' | 'shortBreak' | 'longBreak';
  currentSession: number;
  totalSessions: number;
  durations: {
    work: number;
    shortBreak: number;
    longBreak: number;
  };
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  setTime: (time: number) => void;
  setIsRunning: (isRunning: boolean) => void;
  setMode: (mode: TimerState['mode']) => void;
  setCurrentSession: (session: number) => void;
  setDurations: (durations: TimerState['durations']) => void;
  setAutoStartBreaks: (autoStart: boolean) => void;
  setAutoStartPomodoros: (autoStart: boolean) => void;
  reset: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  isRunning: false,
  time: 25 * 60,
  mode: 'work',
  currentSession: 0,
  totalSessions: 4,
  durations: {
    work: 25,
    shortBreak: 5,
    longBreak: 15,
  },
  autoStartBreaks: false,
  autoStartPomodoros: false,
  setTime: (time) => set({ time }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setMode: (mode) => set({ mode }),
  setCurrentSession: (currentSession) => set({ currentSession }),
  setDurations: (durations) => set({ durations }),
  setAutoStartBreaks: (autoStartBreaks) => set({ autoStartBreaks }),
  setAutoStartPomodoros: (autoStartPomodoros) => set({ autoStartPomodoros }),
  reset: () =>
    set((state) => ({
      isRunning: false,
      time: state.durations.work * 60,
      mode: 'work',
      currentSession: 0,
    })),
}));