'use client';

import { useState, useEffect } from 'react';
import { isOverdue } from '@/lib/overdue';

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
    if (sortBy === 'topic') return a.topic.localeCompare(b.topic);
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
    <div className="binder-margin min-h-screen">
      <main className="max-w-2xl mx-auto px-8 py-12 pl-16 md:pl-20">
        <div className="mb-10">
          <p className="font-mono text-xs tracking-widest text-ink-soft uppercase mb-1">
            COMS3011A · Lab 1
          </p>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Task Log
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-line rounded-sm p-5 mb-10 shadow-[2px_2px_0_rgba(32,38,31,0.05)] space-y-3"
        >
          <p className="font-mono text-xs tracking-widest text-ink-soft uppercase">
            New entry
          </p>
          <input
            className="w-full border border-line rounded-sm p-2 bg-paper focus:bg-white"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full border border-line rounded-sm p-2 bg-paper focus:bg-white"
            placeholder="Description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-3">
            <input
              type="date"
              className="border border-line rounded-sm p-2 flex-1 bg-paper focus:bg-white font-mono text-sm"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <input
              className="border border-line rounded-sm p-2 flex-1 bg-paper focus:bg-white"
              placeholder="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-teal text-white px-4 py-2 rounded-sm font-medium hover:opacity-90 transition-opacity"
          >
            Add entry
          </button>
        </form>

        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-lg font-semibold text-ink">
            {showArchived ? 'Archived entries' : 'Active entries'}
          </h2>
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="font-mono text-xs border border-line rounded-sm p-1 bg-white"
            >
              <option value="due_date">Sort: due date</option>
              <option value="topic">Sort: topic</option>
              <option value="status">Sort: status</option>
            </select>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="font-mono text-xs text-teal hover:opacity-70 underline underline-offset-2"
            >
              {showArchived ? 'active →' : 'archived →'}
            </button>
          </div>
        </div>

        <ul className="space-y-3">
          {sortedTasks.map((task) => {
            const overdue = isOverdue(task);
            return (
              <li
                key={task.id}
                className={`entry-card status-${task.status} ${overdue ? 'is-overdue' : ''} rounded-sm p-4`}
              >
                {editingId === task.id ? (
                  <div className="space-y-2">
                    <input
                      className="w-full border border-line rounded-sm p-2"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                    <textarea
                      className="w-full border border-line rounded-sm p-2"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <input
                        type="date"
                        className="border border-line rounded-sm p-2 flex-1 font-mono text-sm"
                        value={editForm.due_date}
                        onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                      />
                      <input
                        className="border border-line rounded-sm p-2 flex-1"
                        value={editForm.topic}
                        onChange={(e) => setEditForm({ ...editForm, topic: e.target.value })}
                      />
                      <select
                        className="border border-line rounded-sm p-2 font-mono text-sm"
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      >
                        <option value="todo">todo</option>
                        <option value="in_progress">in_progress</option>
                        <option value="complete">complete</option>
                      </select>
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={() => saveEdit(task.id)}
                        className="bg-teal text-white px-3 py-1 rounded-sm text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-ink-soft text-sm hover:text-ink"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="font-display font-semibold text-ink">
                        {task.title}
                      </div>
                      <div className="text-sm text-ink-soft mt-0.5">
                        {task.description}
                      </div>
                      <div className="font-mono text-xs text-ink-soft mt-2 flex items-center flex-wrap gap-x-2">
                        <span>{task.topic}</span>
                        <span>·</span>
                        <span className={`status-dot status-${task.status}`} />
                        <span>{task.status}</span>
                        <span>·</span>
                        <span>due {task.due_date || 'no date'}</span>
                        {overdue && (
                          <span className="text-overdue font-semibold ml-1">
                            overdue
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3 shrink-0 font-mono text-xs">
                      <button
                        onClick={() => startEdit(task)}
                        className="text-teal hover:opacity-70 underline underline-offset-2"
                      >
                        edit
                      </button>
                      <button
                        onClick={() =>
                          showArchived ? unarchiveTask(task.id) : archiveTask(task.id)
                        }
                        className="text-overdue hover:opacity-70 underline underline-offset-2"
                      >
                        {showArchived ? 'unarchive' : 'archive'}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}