export function logLearningEvent(event: { type: string; details: any }) {
  const events = JSON.parse(localStorage.getItem('learning_events') || '[]');

  events.push({ ...event, time: Date.now() });
  localStorage.setItem('learning_events', JSON.stringify(events));
}
