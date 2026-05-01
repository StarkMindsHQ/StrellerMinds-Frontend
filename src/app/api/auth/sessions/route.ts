import { NextRequest, NextResponse } from 'next/server';

type ActiveSession = {
  id: string;
  createdAt: string;
  lastSeenAt: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  isCurrent: boolean;
};

const activeSessionsStore: ActiveSession[] = [
  {
    id: 'session-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    lastSeenAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    device: 'MacBook Pro',
    browser: 'Safari',
    ip: '192.168.0.27',
    location: 'San Francisco, CA',
    isCurrent: true,
  },
  {
    id: 'session-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    lastSeenAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    device: 'Windows PC',
    browser: 'Chrome',
    ip: '172.16.12.8',
    location: 'Austin, TX',
    isCurrent: false,
  },
  {
    id: 'session-3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    lastSeenAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    device: 'iPhone',
    browser: 'Mobile Safari',
    ip: '203.0.113.10',
    location: 'New York, NY',
    isCurrent: false,
  },
];

export async function GET() {
  return NextResponse.json(activeSessionsStore);
}

export async function DELETE(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('id');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session id is required' },
      { status: 400 },
    );
  }

  const sessionIndex = activeSessionsStore.findIndex(
    (session) => session.id === sessionId,
  );

  if (sessionIndex === -1) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  if (activeSessionsStore[sessionIndex].isCurrent) {
    return NextResponse.json(
      { error: 'Cannot terminate the current active session' },
      { status: 403 },
    );
  }

  activeSessionsStore.splice(sessionIndex, 1);
  return NextResponse.json({ ok: true });
}
