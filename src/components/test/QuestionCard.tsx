import { useTest } from './testStore';
import OptionItem from './OptionItem';

export default function QuestionCard() {
  const { state } = useTest();
  const question = state.questions[state.currentIndex];

  return (
    <div className="p-6 rounded-xl shadow-lg bg-white animate-fade">
      <h2 className="text-lg font-semibold mb-4">{question.question}</h2>

      <div className="space-y-3">
        {question.options.map((opt: string, i: number) => (
          <OptionItem key={i} index={i} text={opt} questionId={question.id} />
        ))}
      </div>
    </div>
  );
}
