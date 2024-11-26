import React, { useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { TimerDisplay } from './TimerDisplay';
import { SessionIndicator } from './SessionIndicator';
import { Controls } from './Controls';
import { Settings } from './Settings';
import { Analytics } from './Analytics';
import { useTimerStore } from '../store/timerStore';
import { useTaskStore } from '../store/taskStore';
import { useAnalyticsStore } from '../store/analyticsStore';

export function PomodoroTimer() {
  const {
    isRunning,
    time,
    mode,
    currentSession,
    totalSessions,
    durations,
    autoStartBreaks,
    autoStartPomodoros,
    setTime,
    setIsRunning,
    setMode,
    setCurrentSession,
    setDurations,
    setAutoStartBreaks,
    setAutoStartPomodoros,
    reset,
  } = useTimerStore();

  const { 
    activeTaskId, 
    incrementPomodoroCount,
    autoCheckTasks,
    autoSwitchTasks,
    setAutoCheckTasks,
    setAutoSwitchTasks
  } = useTaskStore();

  const addFocusMinutes = useAnalyticsStore((state) => state.addFocusMinutes);
  
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && time > 0) {
      interval = window.setInterval(() => {
        setTime(time - 1);
        if (mode === 'work' && time % 60 === 0) {
          addFocusMinutes(1);
        }
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, time, mode]);

  const handleTimerComplete = () => {
    if (mode === 'work') {
      if (activeTaskId) {
        incrementPomodoroCount(activeTaskId);
      }

      const newSession = currentSession + 1;
      setCurrentSession(newSession);
      
      if (newSession === totalSessions) {
        setMode('longBreak');
        setTime(durations.longBreak * 60);
        if (autoStartBreaks) setIsRunning(true);
      } else {
        setMode('shortBreak');
        setTime(durations.shortBreak * 60);
        if (autoStartBreaks) setIsRunning(true);
      }
    } else {
      if (currentSession === totalSessions) {
        reset();
        if (autoStartPomodoros) setIsRunning(true);
      } else {
        setMode('work');
        setTime(durations.work * 60);
        if (autoStartPomodoros) setIsRunning(true);
      }
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleModeChange = (newMode: typeof mode) => {
    setMode(newMode);
    setIsRunning(false);
    setTime(durations[newMode] * 60);
  };

  const handleSettingsUpdate = (settings: {
    durations: typeof durations;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
    autoCheckTasks: boolean;
    autoSwitchTasks: boolean;
  }) => {
    setDurations(settings.durations);
    setAutoStartBreaks(settings.autoStartBreaks);
    setAutoStartPomodoros(settings.autoStartPomodoros);
    setAutoCheckTasks(settings.autoCheckTasks);
    setAutoSwitchTasks(settings.autoSwitchTasks);
    setTime(settings.durations[mode] * 60);
  };

  const progress = ((durations[mode] * 60 - time) / (durations[mode] * 60)) * 100;

  return (
    <div className="max-w-sm mx-auto mb-8 bg-white rounded-lg shadow-sm p-4">
      <div className="text-center mb-4">
        <div className="inline-flex rounded-lg bg-gray-100 p-0.5">
          {(['work', 'shortBreak', 'longBreak'] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                mode === m
                  ? 'bg-white shadow-sm text-black'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {m === 'work'
                ? 'Focus'
                : m === 'shortBreak'
                ? 'Short'
                : 'Long'}
            </button>
          ))}
        </div>
      </div>

      <TimerDisplay time={time} progress={progress} />

      <div className="flex justify-center mb-4">
        <button
          onClick={toggleTimer}
          className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          {isRunning ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </button>
      </div>

      <SessionIndicator
        currentSession={currentSession}
        totalSessions={totalSessions}
      />

      <Controls 
        onSettingsClick={() => setShowSettings(true)}
        onAnalyticsClick={() => setShowAnalytics(true)}
      />

      {showSettings && (
        <Settings
          durations={durations}
          autoStartBreaks={autoStartBreaks}
          autoStartPomodoros={autoStartPomodoros}
          autoCheckTasks={autoCheckTasks}
          autoSwitchTasks={autoSwitchTasks}
          onUpdate={handleSettingsUpdate}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showAnalytics && (
        <Analytics onClose={() => setShowAnalytics(false)} />
      )}
    </div>
  );
}