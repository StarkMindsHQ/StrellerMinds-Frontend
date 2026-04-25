import { NextResponse } from 'next/server';

type DeviceActivityEntry = {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  firstSeenAt: string;
  lastSeenAt: string;
  suspicious: boolean;
  reason?: string;
};

const deviceHistory: DeviceActivityEntry[] = [
  {
    id: 'device-1',
    device: 'MacBook Air',
    browser: 'Safari',
    ip: '198.51.100.22',
    location: 'San Francisco, CA',
    firstSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    lastSeenAt: new Date(Date.now() - 1000 * 60 * 21).toISOString(),
    suspicious: false,
  },
  {
    id: 'device-2',
    device: 'Windows Laptop',
    browser: 'Chrome',
    ip: '203.0.113.47',
    location: 'New York, NY',
    firstSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    lastSeenAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    suspicious: false,
  },
  {
    id: 'device-3',
    device: 'Android Phone',
    browser: 'Chrome Mobile',
    ip: '192.0.2.14',
    location: 'Moscow, Russia',
    firstSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    lastSeenAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    suspicious: true,
    reason: 'Unusual location detected',
  },
];

export async function GET() {
  return NextResponse.json(deviceHistory);
}
