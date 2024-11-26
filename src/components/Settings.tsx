import React, { useState } from 'react';
import { Clock, X, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

interface SettingsProps {
  durations: {
    work: number;
    shortBreak: number;
    longBreak: number;
  };
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  autoCheckTasks: boolean;
  autoSwitchTasks: boolean;
  onUpdate: (settings: {
    durations: {
      work: number;
      shortBreak: number;
      longBreak: number;
    };
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
    autoCheckTasks: boolean;
    autoSwitchTasks: boolean;
  }) => void;
  onClose: () => void;
}

const DEFAULT_SETTINGS = {
  durations: {
    work: 25,
    shortBreak: 5,
    longBreak: 15
  },
  autoStartBreaks: false,
  autoStartPomodoros: false,
  autoCheckTasks: false,
  autoSwitchTasks: false
};

export function Settings({ 
  durations, 
  autoStartBreaks, 
  autoStartPomodoros,
  autoCheckTasks,
  autoSwitchTasks,
  onUpdate, 
  onClose 
}: SettingsProps) {
  const [localSettings, setLocalSettings] = useState({
    durations,
    autoStartBreaks,
    autoStartPomodoros,
    autoCheckTasks,
    autoSwitchTasks
  });

  const handleDurationChange = (key: keyof typeof durations, value: string) => {
    const numValue = Math.max(1, Math.min(60, Number(value) || 1));
    setLocalSettings(prev => ({
      ...prev,
      durations: {
        ...prev.durations,
        [key]: numValue
      }
    }));
  };

  const handleToggleChange = (key: keyof typeof localSettings) => {
    if (key !== 'durations') {
      setLocalSettings(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };

  const handleSave = () => {
    onUpdate(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_SETTINGS);
  };

  return (
    <div className="mt-4 space-y-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Timer Settings
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid gap-3 text-sm">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-gray-600 mb-1">Work</label>
            <input
              type="number"
              value={localSettings.durations.work}
              onChange={(e) => handleDurationChange('work', e.target.value)}
              className="w-full bg-gray-50 rounded px-2 py-1 text-base focus:outline-none focus:ring-1 focus:ring-black"
              min="1"
              max="60"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Short Break</label>
            <input
              type="number"
              value={localSettings.durations.shortBreak}
              onChange={(e) => handleDurationChange('shortBreak', e.target.value)}
              className="w-full bg-gray-50 rounded px-2 py-1 text-base focus:outline-none focus:ring-1 focus:ring-black"
              min="1"
              max="60"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Long Break</label>
            <input
              type="number"
              value={localSettings.durations.longBreak}
              onChange={(e) => handleDurationChange('longBreak', e.target.value)}
              className="w-full bg-gray-50 rounded px-2 py-1 text-base focus:outline-none focus:ring-1 focus:ring-black"
              min="1"
              max="60"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Auto Start Breaks</span>
            <button
              onClick={() => handleToggleChange('autoStartBreaks')}
              className={clsx(
                'w-9 h-5 rounded-full transition-colors relative',
                localSettings.autoStartBreaks ? 'bg-black' : 'bg-gray-300'
              )}
            >
              <span
                className={clsx(
                  'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform',
                  localSettings.autoStartBreaks && 'translate-x-4'
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Auto Start Pomodoros</span>
            <button
              onClick={() => handleToggleChange('autoStartPomodoros')}
              className={clsx(
                'w-9 h-5 rounded-full transition-colors relative',
                localSettings.autoStartPomodoros ? 'bg-black' : 'bg-gray-300'
              )}
            >
              <span
                className={clsx(
                  'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform',
                  localSettings.autoStartPomodoros && 'translate-x-4'
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Auto Check Completed Tasks</span>
            <button
              onClick={() => handleToggleChange('autoCheckTasks')}
              className={clsx(
                'w-9 h-5 rounded-full transition-colors relative',
                localSettings.autoCheckTasks ? 'bg-black' : 'bg-gray-300'
              )}
            >
              <span
                className={clsx(
                  'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform',
                  localSettings.autoCheckTasks && 'translate-x-4'
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Auto Switch to Next Task</span>
            <button
              onClick={() => handleToggleChange('autoSwitchTasks')}
              className={clsx(
                'w-9 h-5 rounded-full transition-colors relative',
                localSettings.autoSwitchTasks ? 'bg-black' : 'bg-gray-300'
              )}
            >
              <span
                className={clsx(
                  'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform',
                  localSettings.autoSwitchTasks && 'translate-x-4'
                )}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button
          onClick={handleReset}
          className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 text-xs bg-black text-white rounded hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}