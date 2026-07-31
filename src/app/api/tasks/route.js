import db from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/tasks - list all non-archived tasks
export async function GET() {
  const tasks = db.prepare(`
    SELECT * FROM tasks WHERE archived_at IS NULL ORDER BY due_date ASC
  `).all();

  return NextResponse.json(tasks);
}

export async function POST(request) {
  const body = await request.json();
  const { title, description, due_date, topic } = body;

  if (!title || !topic) {
    return NextResponse.json(
      { error: 'title and topic are required' },
      { status: 400 }
    );
  }

  const result = db.prepare(`
    INSERT INTO tasks (title, description, due_date, topic)
    VALUES (?, ?, ?, ?)
  `).run(title, description || null, due_date || null, topic);

  const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);

  return NextResponse.json(newTask, { status: 201 });
}