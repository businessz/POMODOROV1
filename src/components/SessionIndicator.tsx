import React from 'react';
import { Tomato } from './Icons';

interface SessionIndicatorProps {
  currentSession: number;
  totalSessions: number;
}

export function SessionIndicator({ currentSession, totalSessions }: SessionIndicatorProps) {
  return (
    <div className="flex justify-center gap-3 mb-10">
      {Array.from({ length: totalSessions }).map((_, index) => (
        <Tomato
          key={index}
          className={`w-6 h-6 ${
            index < currentSession ? 'text-red-500' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}