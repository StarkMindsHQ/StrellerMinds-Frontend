import { useTest, calculateScore } from './testStore';

export default function ResultScreen() {
  const { state, dispatch } = useTest();
  const score = calculateScore(state);
  const percentage = (score / state.questions.length) * 100;
  const passed = percentage >= 50;

  return (
    <div className="text-center p-10 text-black">
      <h1 className="text-2xl font-bold">Test Completed</h1>

      <p className="text-xl mt-4">
        Score: {score} / {state.questions.length}
      </p>

      <p
        className={`text-2xl font-bold mt-4 
        ${passed ? 'text-green-600' : 'text-red-600'}`}
      >
        {passed ? 'PASS' : 'FAIL'}
      </p>

      <button
        onClick={() => dispatch({ type: 'RESET' })}
        className="mt-6 px-6 py-3 bg-blue-600 text-black rounded-lg hover:bg-blue-500 transition"
      >
        Retry
      </button>
    </div>
  );
}
