export function detectPattern(events: { type: string; duration: number }[]) {
  const avg = events.reduce((a, b) => a + b.duration, 0) / events.length;

  if (avg < 5) return 'fast';
  if (avg > 15) return 'deep';
  return 'balanced';
}
