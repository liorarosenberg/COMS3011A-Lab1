import { createTask, getTasks } from '@/lib/tasks';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const showArchived = searchParams.get('archived') === 'true';
  return NextResponse.json(getTasks(showArchived));
}

export async function POST(request) {
  const body = await request.json();
  const { title, description, due_date, topic } = body;

  if (!title || !topic) {
    return NextResponse.json({ error: 'title and topic are required' }, { status: 400 });
  }

  const newTask = createTask({ title, description, due_date, topic });
  return NextResponse.json(newTask, { status: 201 });
}