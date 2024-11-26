import React from 'react';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task } from './Task';
import { useTaskStore } from '../store/taskStore';
import { TaskFilters } from './TaskFilters';
import { AddTask } from './AddTask';

export function TaskList() {
  const { tasks, filter, sort, reorderTasks } = useTaskStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredTasks = tasks
    .filter((task) => {
      if (filter.status === 'completed') return task.completed;
      if (filter.status === 'active') return !task.completed;
      return true;
    })
    .filter((task) => {
      if (filter.category) return task.categoryId === filter.category;
      return true;
    })
    .filter((task) => {
      if (filter.priority) return task.priority === filter.priority;
      return true;
    });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const direction = sort.direction === 'asc' ? 1 : -1;
    switch (sort.by) {
      case 'priority':
        const priorityOrder = { high: 2, medium: 1, low: 0 };
        return (
          (priorityOrder[a.priority] - priorityOrder[b.priority]) * direction
        );
      case 'dueDate':
        return (
          (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) *
          direction
        );
      case 'category':
        return (a.categoryId.localeCompare(b.categoryId)) * direction;
      default:
        return (a.order - b.order) * direction;
    }
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((task) => task.id === active.id);
    const newIndex = tasks.findIndex((task) => task.id === over.id);

    const newTasks = arrayMove(tasks, oldIndex, newIndex).map((task, index) => ({
      ...task,
      order: index,
    }));

    reorderTasks(newTasks);
  };

  return (
    <div className="space-y-6">
      <TaskFilters />
      <AddTask />
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sortedTasks.map((task) => (
              <Task key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}