'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [topic, setTopic] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [sortBy, setSortBy] = useState('due_date');

  const fetchTasks = async (archived = showArchived) => {
    const res = await fetch(`/api/tasks?archived=${archived}`);
    const data = await res.json();
    setTasks(data);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
  if (sortBy === 'due_date') {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date) - new Date(b.due_date);
  }
  if (sortBy === 'topic') {
    return a.topic.localeCompare(b.topic);
  }
  if (sortBy === 'status') {
    const order = { todo: 0, in_progress: 1, complete: 2 };
    return order[a.status] - order[b.status];
  }
  return 0;
  });

  useEffect(() => {
  fetchTasks(showArchived);
  }, [showArchived]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, due_date: dueDate, topic }),
    });
    setTitle('');
    setDescription('');
    setDueDate('');
    setTopic('');
    fetchTasks();
  };

  const archiveTask = async (id) => {
  await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ archive: true }),
  });
  fetchTasks(showArchived);
  };

  const unarchiveTask = async (id) => {
  await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ archive: false }),
  });
  fetchTasks(showArchived);
  };

  return (
  <main className="max-w-2xl mx-auto p-8">
    <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

    <form onSubmit={handleSubmit} className="space-y-3 mb-8 border-b pb-6">
      <input className="w-full border rounded p-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea className="w-full border rounded p-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="flex gap-3">
        <input type="date" className="border rounded p-2 flex-1" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <input className="border rounded p-2 flex-1" placeholder="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} required />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add Task
      </button>
    </form>

    <div className="flex justify-between items-center mb-3">
  <h2 className="text-lg font-semibold">
    {showArchived ? 'Archived Tasks' : 'Active Tasks'}
  </h2>
  <div className="flex items-center gap-3">
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="text-sm border rounded p-1"
    >
      <option value="due_date">Sort by due date</option>
      <option value="topic">Sort by topic</option>
      <option value="status">Sort by status</option>
    </select>
    <button
      onClick={() => setShowArchived(!showArchived)}
      className="text-sm text-blue-600 hover:text-blue-800"
    >
      {showArchived ? 'Show active tasks' : 'Show archived tasks'}
    </button>
  </div>
</div>

    <ul className="space-y-2">
      {sortedTasks.map((task) => (
        <li key={task.id} className="border rounded p-3 flex justify-between items-start">
          <div>
            <div className="font-semibold">{task.title}</div>
            <div className="text-sm text-gray-600">{task.description}</div>
            <div className="text-xs text-gray-400 mt-1">
              {task.topic} · {task.status} · due {task.due_date || 'no date'}
            </div>
          </div>
          <button
            onClick={() => (showArchived ? unarchiveTask(task.id) : archiveTask(task.id))}
            className={`text-sm ml-4 shrink-0 ${
              showArchived ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'
            }`}
          >
            {showArchived ? 'Unarchive' : 'Archive'}
          </button>
        </li>
      ))}
    </ul>
  </main>
);
}