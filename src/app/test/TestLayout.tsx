'use client';

import { TestProvider, useTest } from '../../components/test/testStore';
import SidebarNavigation from '../../components/test/SidebarNavigation';
import QuestionCard from '../../components/test/QuestionCard';
import Timer from '../../components/test/Timer';
import ResultScreen from '../../components/test/ResultScreen';
import ConfirmModal from '../../components/test/ConfirmModal';
import { useState } from 'react';

function TestContent() {
  const { state, dispatch } = useTest();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFirst = state.currentIndex === 0;
  const isLast = state.currentIndex === state.questions.length - 1;
  const unanswered = state.questions.length - Object.keys(state.answers).length;

  if (state.isSubmitted) {
    return <ResultScreen />;
  }

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Test</h1>
        <Timer />
      </div>

      <div className="flex flex-col-reverse lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <SidebarNavigation />
        </div>

        <div className="lg:w-3/4">
          <QuestionCard />

          <div className="mt-8 flex justify-between items-center">
            {/* Previous */}
            <div className="flex gap-5">
              <button
                onClick={() =>
                  dispatch({
                    type: 'GO_TO_QUESTION',
                    payload: state.currentIndex - 1,
                  })
                }
                disabled={isFirst}
                className={`px-6 py-3 rounded-lg transition 
      ${
        isFirst
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-gray-300 text-black hover:bg-blue-200'
      }`}
              >
                Previous
              </button>

              {/* Next */}
              <button
                onClick={() =>
                  dispatch({
                    type: 'GO_TO_QUESTION',
                    payload: state.currentIndex + 1,
                  })
                }
                disabled={isLast}
                className={`px-6 py-3 rounded-lg transition 
        ${
          isLast
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-200 text-black hover:bg-blue-300'
        }`}
              >
                Next
              </button>
            </div>
            <div>
              {/* Submit */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-blue-600 text-black rounded-lg hover:bg-blue-500 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        unanswered={unanswered}
        total={state.questions.length}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          dispatch({ type: 'SUBMIT' });
        }}
      />
    </div>
  );
}

export default function TestLayout() {
  return (
    <TestProvider>
      <TestContent />
    </TestProvider>
  );
}
