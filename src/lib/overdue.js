export function isOverdue(task) {
  if (!task.due_date || task.status === 'complete') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.due_date);
  return due < today;
}