import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format } from 'date-fns';
import { useAnalyticsStore } from '../store/analyticsStore';
import { Clock, CheckCircle2, Timer, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function Analytics({ onClose }: { onClose: () => void }) {
  const stats = useAnalyticsStore((state) => state.calculateStats());

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${remainingMinutes}m`;
  };

  const weeklyData = {
    labels: stats.weeklyStats.map((day) =>
      format(new Date(day.date), 'EEE')
    ),
    datasets: [
      {
        label: 'Focus Time',
        data: stats.weeklyStats.map((day) => day.focusMinutes),
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const distributionData = {
    labels: Object.keys(stats.focusDistribution),
    datasets: [
      {
        data: Object.values(stats.focusDistribution),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Productivity Analytics</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Clock className="w-4 h-4" />
              <span>Total Focus Time</span>
            </div>
            <div className="text-2xl font-bold">
              {formatTime(stats.totalFocusTime)}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Timer className="w-4 h-4" />
              <span>Completed Pomodoros</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalPomodoros}</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tasks Completed</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>Completion Rate</span>
            </div>
            <div className="text-2xl font-bold">
              {stats.completionRate.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Weekly Focus Time</h3>
            <Line
              data={weeklyData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Minutes',
                    },
                  },
                },
              }}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Focus Distribution</h3>
            <Doughnut
              data={distributionData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}