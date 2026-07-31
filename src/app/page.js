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
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

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

  const startEdit = (task) => {
  setEditingId(task.id);
  setEditForm({
    title: task.title,
    description: task.description || '',
    due_date: task.due_date || '',
    topic: task.topic,
    status: task.status,
  });
};

const cancelEdit = () => {
  setEditingId(null);
  setEditForm({});
};

const saveEdit = async (id) => {
  await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editForm),
  });
  setEditingId(null);
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
        <li key={task.id} className="border rounded p-3">
  {editingId === task.id ? (
    <div className="space-y-2">
      <input
        className="w-full border rounded p-2"
        value={editForm.title}
        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
      />
      <textarea
        className="w-full border rounded p-2"
        value={editForm.description}
        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
      />
      <div className="flex gap-2">
        <input
          type="date"
          className="border rounded p-2 flex-1"
          value={editForm.due_date}
          onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
        />
        <input
          className="border rounded p-2 flex-1"
          value={editForm.topic}
          onChange={(e) => setEditForm({ ...editForm, topic: e.target.value })}
        />
        <select
          className="border rounded p-2"
          value={editForm.status}
          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
        >
          <option value="todo">todo</option>
          <option value="in_progress">in_progress</option>
          <option value="complete">complete</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => saveEdit(task.id)}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Save
        </button>
        <button
          onClick={cancelEdit}
          className="text-gray-600 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <div className="flex justify-between items-start">
      <div>
        <div className="font-semibold">{task.title}</div>
        <div className="text-sm text-gray-600">{task.description}</div>
        <div className="text-xs text-gray-400 mt-1">
          {task.topic} · {task.status} · due {task.due_date || 'no date'}
        </div>
      </div>
      <div className="flex gap-3 ml-4 shrink-0">
        <button
          onClick={() => startEdit(task)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Edit
        </button>
        <button
          onClick={() => (showArchived ? unarchiveTask(task.id) : archiveTask(task.id))}
          className={`text-sm ${
            showArchived ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'
          }`}
        >
          {showArchived ? 'Unarchive' : 'Archive'}
        </button>
      </div>
    </div>
  )}
</li>
      ))}
    </ul>
  </main>
);
}