import { useTest, Question } from './testStore';

export default function SidebarNavigation() {
  const { state, dispatch } = useTest();

  return (
    <div className="grid grid-cols-5 gap-2">
      {state.questions.map((q: Question, i: number) => {
        const answered = state.answers[q.id] !== undefined;
        const active = i === state.currentIndex;

        return (
          <button
            key={q.id}
            onClick={() => dispatch({ type: 'GO_TO_QUESTION', payload: i })}
            className={`p-2 rounded 
              ${
                active
                  ? 'bg-blue-200 text-black border-blue-300'
                  : answered
                    ? 'bg-green-200 text-black border-green-300'
                    : 'bg-white text-black border-gray-100'
              }`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
