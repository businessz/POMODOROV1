import React from 'react';
import { useTaskStore } from '../store/taskStore';
import { Priority } from '../types/task';
import clsx from 'clsx';

export function TaskFilters() {
  const { filter, setFilter, sort, setSort, categories } = useTaskStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select
            value={filter.status}
            onChange={(e) => setFilter({ status: e.target.value as any })}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filter.category || ''}
            onChange={(e) =>
              setFilter({ category: e.target.value || null })
            }
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={filter.priority || ''}
            onChange={(e) =>
              setFilter({ priority: (e.target.value as Priority) || null })
            }
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sort.by}
            onChange={(e) => setSort({ by: e.target.value as any })}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="order">Manual</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
            <option value="category">Category</option>
          </select>

          <button
            onClick={() =>
              setSort({
                direction: sort.direction === 'asc' ? 'desc' : 'asc',
              })
            }
            className={clsx(
              'p-2 rounded-lg hover:bg-gray-100 text-xl',
              sort.direction === 'desc' && 'rotate-180'
            )}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}