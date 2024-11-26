import React from 'react';
import { TaskList } from './components/TaskList';
import { PomodoroTimer } from './components/PomodoroTimer';
import { useTaskStore } from './store/taskStore';

function App() {
  const { addCategory } = useTaskStore();

  // Initialize default categories if needed
  React.useEffect(() => {
    addCategory({ name: 'Work', color: '#3b82f6' });
    addCategory({ name: 'Personal', color: '#10b981' });
    addCategory({ name: 'Shopping', color: '#f59e0b' });
  }, [addCategory]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Pomodoro Task Manager</h1>
        <PomodoroTimer />
        <TaskList />
      </div>
    </div>
  );
}

export default App;