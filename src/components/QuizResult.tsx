import React from 'react';

type QuestionResult = {
  question: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string;
  explanation: string;
};

interface Props {
  results: QuestionResult[];
}

const QuizResult: React.FC<Props> = ({ results }) => {
  const total = results.length;
  const correctCount = results.filter(
    (q) => q.selectedAnswer === q.correctAnswer
  ).length;

  const scorePercent = Math.round((correctCount / total) * 100);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl max-w-3xl mx-auto">
      {/* 🔹 Score Summary */}
      <div className="mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-xl font-semibold">Quiz Results</h2>
        <p className="text-sm text-gray-400 mt-1">
          You got <strong>{correctCount}</strong> out of{' '}
          <strong>{total}</strong> correct
        </p>

        <div className="mt-3">
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{ width: `${scorePercent}%` }}
            />
          </div>
          <p className="text-sm mt-1">{scorePercent}% Score</p>
        </div>
      </div>

      {/* 🔹 Questions Review */}
      <div className="space-y-6">
        {results.map((q, index) => {
          const isCorrect = q.selectedAnswer === q.correctAnswer;

          return (
            <div
              key={index}
              className="p-4 rounded-lg border border-gray-700"
            >
              <p className="font-medium mb-3">
                {index + 1}. {q.question}
              </p>

              <div className="space-y-2">
                {q.options.map((option, i) => {
                  const isSelected = option === q.selectedAnswer;
                  const isCorrectOption = option === q.correctAnswer;

                  let className = 'block px-3 py-2 rounded-md text-sm';

                  if (isCorrectOption) {
                    className += ' bg-green-600/30 border border-green-500';
                  } else if (isSelected && !isCorrect) {
                    className += ' bg-red-600/30 border border-red-500';
                  } else {
                    className += ' bg-gray-800';
                  }

                  return (
                    <div key={i} className={className}>
                      {option}
                    </div>
                  );
                })}
              </div>

              {/* 🔹 Explanation */}
              <div className="mt-3 text-sm text-gray-300">
                <p>
                  <strong>
                    {isCorrect ? 'Correct ✅' : 'Incorrect ❌'}
                  </strong>
                </p>
                <p className="mt-1 text-gray-400">
                  {q.explanation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizResult;