// HintBox.tsx
import React from 'react';

interface Props {
  hint?: string;
  revealed: boolean;
  onReveal: () => void;
  penalty?: number;
}

const HintBox: React.FC<Props> = ({
  hint,
  revealed,
  onReveal,
  penalty = 0,
}) => {
  if (!hint) return null;

  return (
    <div className="mt-3">
      {!revealed ? (
        <button
          onClick={onReveal}
          className="text-sm text-yellow-400 hover:underline"
        >
          💡 Show Hint {penalty > 0 && `( -${penalty} pts )`}
        </button>
      ) : (
        <div className="bg-yellow-500/10 border border-yellow-500 p-3 rounded-md text-sm text-yellow-200">
          {hint}
        </div>
      )}
    </div>
  );
};

export default HintBox;