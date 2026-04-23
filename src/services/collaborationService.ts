import io from 'socket.io-client';

const socket = io('/collaboration');

export function connectEditor(courseId: string, onUpdate: (content: string) => void) {
  socket.emit('join', courseId);
  socket.on('update', onUpdate);
  return () => socket.off('update', onUpdate);
}

export function applyChange(courseId: string, content: string) {
  socket.emit('change', { courseId, content });
}
