import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import {
  GripVertical,
  Calendar,
  Flag,
  Trash2,
  CheckCircle2,
  Circle,
  Timer,
} from 'lucide-react';
import { Task as TaskType } from '../types/task';
import { useTaskStore } from '../store/taskStore';
import clsx from 'clsx';

interface TaskProps {
  task: TaskType;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export function Task({ task }: TaskProps) {
  const { updateTask, deleteTask, categories, activeTaskId, setActiveTask } = useTaskStore();
  const category = categories.find((c) => c.id === task.categoryId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isActive = activeTaskId === task.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'group bg-white rounded-lg p-6 shadow-sm border transition-colors',
        isDragging && 'opacity-50',
        isActive ? 'border-black' : 'border-gray-200'
      )}
    >
      <div className="flex items-start gap-4">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-6 h-6 text-gray-400" />
        </button>

        <button
          onClick={() => updateTask(task.id, { completed: !task.completed })}
          className="mt-1 flex-shrink-0"
        >
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3
                className={clsx(
                  'text-xl font-medium',
                  task.completed && 'line-through text-gray-400'
                )}
              >
                {task.title}
              </h3>
              <p className="text-base text-gray-500 mt-2">{task.description}</p>
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-4 mt-4 text-base">
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-5 h-5" />
              <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
            </div>

            <div className="flex items-center gap-2">
              <Flag className="w-5 h-5" />
              <span className={clsx('px-3 py-1 rounded-full text-sm font-medium', priorityColors[task.priority])}>
                {task.priority}
              </span>
            </div>

            {category && (
              <div
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                {category.name}
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <Timer className="w-5 h-5" />
              <span className="text-base font-medium">
                {task.completedPomodoros}/{task.estimatedPomodoros}
              </span>
            </div>

            {!task.completed && (
              <button
                onClick={() => setActiveTask(isActive ? null : task.id)}
                className={clsx(
                  'px-4 py-2 text-base font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                {isActive ? 'Stop Focus' : 'Focus'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}