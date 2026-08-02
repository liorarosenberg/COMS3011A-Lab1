import db from './db';

export function createTask({ title, description, due_date, topic }) {
  const result = db.prepare(`
    INSERT INTO tasks (title, description, due_date, topic)
    VALUES (?, ?, ?, ?)
  `).run(title, description || null, due_date || null, topic);

  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
}

export function getTasks(archived = false) {
  return archived
    ? db.prepare(`SELECT * FROM tasks WHERE archived_at IS NOT NULL ORDER BY due_date ASC`).all()
    : db.prepare(`SELECT * FROM tasks WHERE archived_at IS NULL ORDER BY due_date ASC`).all();
}

export function archiveTask(id) {
  db.prepare(`
    UPDATE tasks SET archived_at = datetime('now'), updated_at = datetime('now')
    WHERE id = ?
  `).run(id);
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
}

export function unarchiveTask(id) {
  db.prepare(`
    UPDATE tasks SET archived_at = NULL, updated_at = datetime('now')
    WHERE id = ?
  `).run(id);
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
}