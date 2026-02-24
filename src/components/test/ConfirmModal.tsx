'use client';

import { useEffect } from 'react';

type Props = {
  isOpen: boolean;
  unanswered: number;
  total: number;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  isOpen,
  unanswered,
  total,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCancel();
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        onClick={onCancel}
        className="absolute inset-0 bg-black/50 animate-fade"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md animate-scale">
        <h2 className="text-xl font-semibold mb-4">Confirm Submission</h2>

        <p className="text-gray-600 mb-4">
          Are you sure you want to submit your test?
        </p>

        {unanswered > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-100 text-yellow-800">
            You have {unanswered} unanswered question
            {unanswered > 1 ? 's' : ''} out of {total}.
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
