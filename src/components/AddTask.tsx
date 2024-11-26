import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { Priority } from '../types/task';
import { Plus } from 'lucide-react';

export function AddTask() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [categoryId, setCategoryId] = useState('');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const { addTask, categories, addCategory } = useTaskStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let finalCategoryId = categoryId;

    if (isAddingCategory && newCategory.trim()) {
      const category = {
        name: newCategory.trim(),
        color: '#3b82f6', // Default color
      };
      const newCat = addCategory(category);
      finalCategoryId = newCat.id;
    }

    addTask({
      title: title.trim(),
      description: description.trim(),
      dueDate: new Date().toISOString().split('T')[0],
      priority,
      categoryId: finalCategoryId,
      completed: false,
      estimatedPomodoros,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategoryId('');
    setEstimatedPomodoros(1);
    setNewCategory('');
    setIsAddingCategory(false);
    setIsOpen(false);
  };

  const handleCancelNewCategory = () => {
    setNewCategory('');
    setIsAddingCategory(false);
  };

  const handleSaveNewCategory = () => {
    if (!newCategory.trim()) return;

    const category = {
      name: newCategory.trim(),
      color: '#3b82f6', // Default color
    };
    const newCat = addCategory(category);
    setCategoryId(newCat.id);
    setNewCategory('');
    setIsAddingCategory(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 text-left text-gray-500 hover:text-gray-900 bg-white rounded-lg border border-dashed border-gray-200 hover:border-gray-300 transition-colors"
      >
        <Plus className="w-6 h-6 inline-block mr-2" />
        <span className="text-lg">Add new task</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          rows={2}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Estimated Pomodoros
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={estimatedPomodoros}
              onChange={(e) => setEstimatedPomodoros(Math.max(1, parseInt(e.target.value)))}
              className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            Category
          </label>
          {!isAddingCategory ? (
            <div className="space-y-2">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsAddingCategory(true)}
                className="text-base text-gray-500 hover:text-gray-700"
              >
                + Add new category
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
                className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancelNewCategory}
                  className="px-6 py-3 text-base text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNewCategory}
                  className="px-6 py-3 text-base bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Save Category
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-6 py-3 text-base text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 text-base bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Add Task
          </button>
        </div>
      </div>
    </form>
  );
}