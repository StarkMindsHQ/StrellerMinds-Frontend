import { useTest } from './testStore';

interface OptionItemProps {
  index: number;
  text: string;
  questionId: number;
}

export default function OptionItem({
  index,
  text,
  questionId,
}: OptionItemProps) {
  const { state, dispatch } = useTest();
  const selected = state.answers[questionId] === index;

  return (
    <button
      onClick={() =>
        dispatch({
          type: 'SELECT_ANSWER',
          payload: { questionId, optionIndex: index },
        })
      }
      className={`w-full p-3 rounded-lg border transition-all
        ${selected ? 'bg-blue-100 text-black border-blue-200' : 'bg-white text-black border-gray-200'}
      `}
    >
      {text}
    </button>
  );
}
