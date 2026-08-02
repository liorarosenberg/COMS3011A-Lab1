import { describe, it, expect } from 'vitest';
import { createTask, getTasks, archiveTask, unarchiveTask } from '@/lib/tasks';
import { isOverdue } from '@/lib/overdue';

describe('createTask', () => {
  it('creates a task with correct defaults', () => {
    const task = createTask({ title: 'Test task', description: 'desc', due_date: '2026-08-10', topic: 'Test' });
    expect(task.title).toBe('Test task');
    expect(task.status).toBe('todo');
    expect(task.archived_at).toBeNull();
  });
});

describe('archiveTask', () => {
  it('sets archived_at instead of deleting the row', () => {
    const task = createTask({ title: 'To archive', topic: 'Test' });
    const archived = archiveTask(task.id);

    expect(archived.archived_at).not.toBeNull();

    const active = getTasks(false);
    expect(active.find((t) => t.id === task.id)).toBeUndefined();

    const archivedList = getTasks(true);
    expect(archivedList.find((t) => t.id === task.id)).toBeDefined();
  });

  it('can be reversed with unarchiveTask', () => {
    const task = createTask({ title: 'Round trip', topic: 'Test' });
    archiveTask(task.id);
    const restored = unarchiveTask(task.id);

    expect(restored.archived_at).toBeNull();
    const active = getTasks(false);
    expect(active.find((t) => t.id === task.id)).toBeDefined();
  });
});

describe('isOverdue', () => {
  it('flags a past due_date with status todo as overdue', () => {
    const task = { due_date: '2020-01-01', status: 'todo' };
    expect(isOverdue(task)).toBe(true);
  });

  it('does not flag a completed task even if past due_date', () => {
    const task = { due_date: '2020-01-01', status: 'complete' };
    expect(isOverdue(task)).toBe(false);
  });

  it('does not flag a task with no due_date', () => {
    const task = { due_date: null, status: 'todo' };
    expect(isOverdue(task)).toBe(false);
  });

  it('does not flag a task due today', () => {
    const today = new Date().toISOString().slice(0, 10);
    const task = { due_date: today, status: 'todo' };
    expect(isOverdue(task)).toBe(false);
  });
});