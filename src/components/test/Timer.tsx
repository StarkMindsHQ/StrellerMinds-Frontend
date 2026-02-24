import { useEffect } from 'react';
import { useTest } from './testStore';

export default function Timer() {
  const { state, dispatch } = useTest();

  useEffect(() => {
    if (state.isSubmitted) return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isSubmitted]);

  useEffect(() => {
    if (state.timeLeft <= 0) {
      dispatch({ type: 'SUBMIT' });
    }
  }, [state.timeLeft]);

  const minutes = Math.floor(state.timeLeft / 60);
  const seconds = state.timeLeft % 60;

  return (
    <div className="text-xl font-bold text-green-600">
      {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}
