import React from 'react';
import { Settings, BarChart2, Calendar } from 'lucide-react';

interface ControlsProps {
  onSettingsClick: () => void;
  onAnalyticsClick: () => void;
}

export function Controls({ onSettingsClick, onAnalyticsClick }: ControlsProps) {
  return (
    <div className="flex justify-center gap-8 text-gray-600 mb-8">
      <button
        type="button"
        className="p-3 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="View Calendar"
      >
        <Calendar className="w-5 h-5" strokeWidth={2.5} />
      </button>
      <button
        type="button"
        className="p-3 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="View Analytics"
        onClick={onAnalyticsClick}
      >
        <BarChart2 className="w-5 h-5" strokeWidth={2.5} />
      </button>
      <button
        type="button"
        onClick={onSettingsClick}
        className="p-3 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Open Settings"
      >
        <Settings className="w-5 h-5" strokeWidth={2.5} />
      </button>
    </div>
  );
}