import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  if (body.archive === true) {
    db.prepare(`
      UPDATE tasks SET archived_at = datetime('now'), updated_at = datetime('now')
      WHERE id = ?
    `).run(id);
  }
  if (body.archive === false) {
    db.prepare(`
      UPDATE tasks SET archived_at = NULL, updated_at = datetime('now')
      WHERE id = ?
    `).run(id);
  }

  const editable = ['title', 'description', 'due_date', 'topic', 'status'];
  const fieldsToUpdate = editable.filter((f) => body[f] !== undefined);

  if (fieldsToUpdate.length > 0) {
    const setClause = fieldsToUpdate.map((f) => `${f} = ?`).join(', ');
    const values = fieldsToUpdate.map((f) => body[f]);

    db.prepare(`
      UPDATE tasks SET ${setClause}, updated_at = datetime('now')
      WHERE id = ?
    `).run(...values, id);
  }

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  return NextResponse.json(updated);
}