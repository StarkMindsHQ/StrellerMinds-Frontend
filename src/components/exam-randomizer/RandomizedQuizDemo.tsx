'use client';

import { Question, useRandomizedExam } from '@/hooks/UseRandomizedExam';
/**
 * FILE: src/components/exam-randomizer/RandomizedQuizDemo.tsx
 *
 * Demonstrates useRandomizedExam with a live preview.
 * Swap in your real question bank and wire up answer submission.
 */

import { useState } from 'react';

const QUESTION_BANK: Question[] = [
  {
    id: 'q1',
    type: 'mcq',
    points: 5,
    text: 'What is the primary purpose of a blockchain?',
    options: [
      'Store images',
      'Decentralized record-keeping',
      'Run machine learning',
      'Compress data',
    ],
    correctAnswers: ['Decentralized record-keeping'],
  },
  {
    id: 'q2',
    type: 'mcq',
    points: 5,
    text: 'Which consensus mechanism does Bitcoin use?',
    options: [
      'Proof of Stake',
      'Delegated PoS',
      'Proof of Work',
      'Proof of Authority',
    ],
    correctAnswers: ['Proof of Work'],
  },
  {
    id: 'q3',
    type: 'true-false',
    points: 3,
    text: 'Smart contracts can execute automatically without human intervention.',
    correctAnswer: true,
  },
  {
    id: 'q4',
    type: 'mcq',
    points: 5,
    text: 'Which data structure do blockchains fundamentally rely on?',
    options: [
      'Hash maps',
      'Binary trees',
      'Linked lists of hashed blocks',
      'Adjacency matrices',
    ],
    correctAnswers: ['Linked lists of hashed blocks'],
  },
  {
    id: 'q5',
    type: 'text',
    points: 10,
    text: 'Explain the concept of a 51% attack and its implications.',
  },
];

interface QuizDemoInnerProps {
  debugSeed?: number;
}

function QuizDemoInner({ debugSeed }: QuizDemoInnerProps) {
  const { questions, seed } = useRandomizedExam(QUESTION_BANK, debugSeed);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [current, setCurrent] = useState(0);

  const q = questions[current];
  const displayOptions = q.shuffledOptions ?? q.options ?? [];

  const handleSelect = (val: string) => {
    if (q.type === 'multi') {
      const prev = (answers[q.id] as string[]) || [];
      const next = prev.includes(val)
        ? prev.filter((v) => v !== val)
        : [...prev, val];
      setAnswers({ ...answers, [q.id]: next });
    } else {
      setAnswers({ ...answers, [q.id]: val });
    }
  };

  const isSelected = (val: string) => {
    const a = answers[q.id];
    if (Array.isArray(a)) return a.includes(val);
    return a === val;
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        minHeight: '100vh',
        background: '#0f1117',
        color: '#e2e8f0',
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid #1e293b',
          padding: '16px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: '#f1f5f9',
            }}
          >
            Randomized Quiz
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: '#475569',
              fontFamily: 'monospace',
            }}
          >
            seed: {seed}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: 30,
                height: 30,
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                borderColor:
                  i === current
                    ? '#6366f1'
                    : answers[questions[i].id]
                      ? '#22c55e'
                      : '#1e293b',
                background:
                  i === current
                    ? '#6366f1'
                    : answers[questions[i].id]
                      ? '#14532d'
                      : '#1e293b',
                color:
                  i === current
                    ? '#fff'
                    : answers[questions[i].id]
                      ? '#86efac'
                      : '#64748b',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '36px 24px' }}>
        {/* Question */}
        <div
          style={{
            background: '#1e293b',
            borderRadius: 14,
            padding: '28px 28px 24px',
            border: '1px solid #334155',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: '#64748b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Q{current + 1} · {q.type.replace('-', ' ')}
            </span>
            <span style={{ fontSize: 12, color: '#6366f1', fontWeight: 600 }}>
              {q.points} pts
            </span>
          </div>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              margin: '0 0 24px',
              color: '#f1f5f9',
            }}
          >
            {q.text}
          </p>

          {(q.type === 'mcq' ||
            q.type === 'true-false' ||
            q.type === 'multi') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {displayOptions.map((opt) => {
                const sel = isSelected(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      border: `1px solid ${sel ? '#6366f1' : '#334155'}`,
                      borderRadius: 10,
                      cursor: 'pointer',
                      textAlign: 'left',
                      background: sel ? 'rgba(99,102,241,0.15)' : 'transparent',
                      color: sel ? '#a5b4fc' : '#cbd5e1',
                      fontSize: 15,
                      fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: q.type === 'multi' ? 4 : '50%',
                        border: `2px solid ${sel ? '#6366f1' : '#475569'}`,
                        background: sel ? '#6366f1' : 'transparent',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {sel && (
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: q.type === 'multi' ? 2 : '50%',
                            background: '#fff',
                          }}
                        />
                      )}
                    </div>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {q.type === 'text' && (
            <textarea
              value={(answers[q.id] as string) || ''}
              onChange={(e) =>
                setAnswers({ ...answers, [q.id]: e.target.value })
              }
              placeholder="Write your answer…"
              style={{
                width: '100%',
                minHeight: 140,
                background: '#0f1117',
                border: '1px solid #334155',
                borderRadius: 10,
                padding: '12px 14px',
                color: '#e2e8f0',
                fontSize: 15,
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          )}
        </div>

        {/* Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 20,
          }}
        >
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: current === 0 ? '#334155' : '#94a3b8',
              borderRadius: 8,
              padding: '9px 20px',
              fontSize: 14,
              cursor: current === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Prev
          </button>
          <button
            onClick={() =>
              setCurrent((c) => Math.min(questions.length - 1, c + 1))
            }
            disabled={current === questions.length - 1}
            style={{
              background: '#6366f1',
              border: 'none',
              color: '#fff',
              borderRadius: 8,
              padding: '9px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor:
                current === questions.length - 1 ? 'not-allowed' : 'pointer',
              opacity: current === questions.length - 1 ? 0.4 : 1,
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

// Wrapper — toggles debug mode
export default function RandomizedQuizDemo() {
  const [debugMode, setDebugMode] = useState(false);
  const [seed, setSeed] = useState('12345');
  const [key, setKey] = useState(0); // force remount for new random seed

  return (
    <>
      {/* Debug toolbar */}
      <div
        style={{
          background: '#020617',
          borderBottom: '1px solid #1e293b',
          padding: '10px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <span
          style={{ fontSize: 12, color: '#475569', fontFamily: 'monospace' }}
        >
          🛠 Debug mode
        </span>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={debugMode}
            onChange={(e) => setDebugMode(e.target.checked)}
          />
          <span style={{ fontSize: 12, color: '#64748b' }}>
            Use deterministic seed
          </span>
        </label>
        {debugMode && (
          <input
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="Seed number"
            style={{
              background: '#0f1117',
              border: '1px solid #334155',
              color: '#e2e8f0',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: 12,
              fontFamily: 'monospace',
              width: 120,
            }}
          />
        )}
        <button
          onClick={() => setKey((k) => k + 1)}
          style={{
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#94a3b8',
            borderRadius: 6,
            padding: '5px 12px',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          🔀 Re-shuffle
        </button>
      </div>
      <QuizDemoInner
        key={key}
        debugSeed={debugMode ? parseInt(seed) || 0 : undefined}
      />
    </>
  );
}
