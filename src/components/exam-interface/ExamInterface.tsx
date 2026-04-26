'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface Question {
  id: string;
  text: string;
  type: 'mcq' | 'text';
  options?: string[];
  points: number;
}

interface ExamConfig {
  id: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
}

const EXAM: ExamConfig = {
  id: 'exam-001',
  title: 'Introduction to Machine Learning – Final Exam',
  durationMinutes: 45,
  questions: [
    {
      id: 'q1',
      type: 'mcq',
      points: 5,
      text: 'Which of the following is NOT a supervised learning algorithm?',
      options: [
        'Linear Regression',
        'K-Means Clustering',
        'Support Vector Machine',
        'Decision Tree',
      ],
    },
    {
      id: 'q2',
      type: 'mcq',
      points: 5,
      text: "What does the 'bias-variance tradeoff' refer to in machine learning?",
      options: [
        'Training speed vs accuracy',
        'Model complexity vs generalization',
        'Data size vs model size',
        'Precision vs recall',
      ],
    },
    {
      id: 'q3',
      type: 'text',
      points: 10,
      text: 'Explain the difference between overfitting and underfitting. Provide an example of each.',
    },
    {
      id: 'q4',
      type: 'mcq',
      points: 5,
      text: 'Which activation function is most commonly used in hidden layers of deep neural networks?',
      options: ['Sigmoid', 'Tanh', 'ReLU', 'Softmax'],
    },
    {
      id: 'q5',
      type: 'text',
      points: 15,
      text: 'Describe the steps of the gradient descent optimization algorithm and explain how learning rate affects convergence.',
    },
  ],
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}
function formatTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

const STORAGE_KEY = `exam_${EXAM.id}_answers`;
const TIME_KEY = `exam_${EXAM.id}_time`;

export default function ExamInterface() {
  const totalSecs = EXAM.durationMinutes * 60;
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  });
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const saved = parseInt(localStorage.getItem(TIME_KEY) || '');
    return isNaN(saved) ? totalSecs : saved;
  });
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showLeaveWarn, setShowLeaveWarn] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [saveIndicator, setSaveIndicator] = useState<'saved' | 'saving' | null>(
    null,
  );
  const [offline, setOffline] = useState(!navigator.onLine);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Timer tick
  useEffect(() => {
    if (submitted) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        const next = t - 1;
        localStorage.setItem(TIME_KEY, String(next));
        if (next <= 0) {
          clearInterval(id);
          handleAutoSubmit();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [submitted]);

  // Navigation guard
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!submitted) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [submitted]);

  // Online/offline
  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  const autosave = useCallback((newAnswers: Record<string, string>) => {
    setSaveIndicator('saving');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAnswers));
      setSaveIndicator('saved');
      setTimeout(() => setSaveIndicator(null), 1500);
    }, 600);
  }, []);

  const handleAnswer = (qid: string, value: string) => {
    const next = { ...answers, [qid]: value };
    setAnswers(next);
    autosave(next);
  };

  const handleAutoSubmit = useCallback(() => {
    setSubmitted(true);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TIME_KEY);
  }, []);

  const handleSubmit = () => {
    setShowSubmitConfirm(false);
    handleAutoSubmit();
  };

  const q = EXAM.questions[current];
  const answered = Object.keys(answers).length;
  const pct = Math.round((answered / EXAM.questions.length) * 100);
  const danger = timeLeft <= 300;
  const urgent = timeLeft <= 60;

  if (submitted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#f0fdf4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#14532d',
              margin: '0 0 8px',
            }}
          >
            Exam Submitted
          </h1>
          <p style={{ color: '#166534', fontSize: 16 }}>
            Your answers have been recorded. You answered {answered} of{' '}
            {EXAM.questions.length} questions.
          </p>
          <div
            style={{
              marginTop: 24,
              padding: '14px 24px',
              background: '#dcfce7',
              borderRadius: 10,
              display: 'inline-block',
              fontSize: 14,
              color: '#15803d',
              fontWeight: 500,
            }}
          >
            Submission ID: {EXAM.id}-{Date.now().toString(36).toUpperCase()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        minHeight: '100vh',
        background: '#f8fafc',
        color: '#0f172a',
      }}
    >
      {/* Offline banner */}
      {offline && (
        <div
          style={{
            background: '#ef4444',
            color: '#fff',
            textAlign: 'center',
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          ⚠️ You are offline. Answers are saved locally and will sync when
          reconnected.
        </div>
      )}

      {/* Top bar */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: '#fff',
          borderBottom: `2px solid ${urgent ? '#ef4444' : danger ? '#f59e0b' : '#e2e8f0'}`,
          padding: '0 24px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: 15,
              maxWidth: 340,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {EXAM.title}
          </span>
          {saveIndicator && (
            <span
              style={{
                fontSize: 11,
                color: saveIndicator === 'saved' ? '#22c55e' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {saveIndicator === 'saving' ? '💾 Saving…' : '✓ Saved'}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Timer */}
          <div
            style={{
              background: urgent ? '#fef2f2' : danger ? '#fffbeb' : '#f1f5f9',
              border: `1px solid ${urgent ? '#fca5a5' : danger ? '#fcd34d' : '#e2e8f0'}`,
              borderRadius: 8,
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              animation: urgent ? 'pulse 1s infinite' : 'none',
            }}
          >
            <span style={{ fontSize: 16 }}>
              {urgent ? '🚨' : danger ? '⏰' : '⏱'}
            </span>
            <span
              style={{
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 700,
                fontSize: 18,
                color: urgent ? '#dc2626' : danger ? '#d97706' : '#374151',
              }}
            >
              {formatTime(timeLeft)}
            </span>
          </div>

          <button
            onClick={() => setShowSubmitConfirm(true)}
            style={{
              background: '#0f172a',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Submit Exam
          </button>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          padding: '28px 20px',
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: 24,
        }}
      >
        {/* Question nav sidebar */}
        <div>
          <div
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              overflow: 'hidden',
              position: 'sticky',
              top: 80,
            }}
          >
            <div
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid #e2e8f0',
                fontSize: 12,
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Questions
            </div>
            <div
              style={{
                padding: '10px 12px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
              }}
            >
              {EXAM.questions.map((qs, i) => {
                const done = Boolean(answers[qs.id]);
                const active = i === current;
                return (
                  <button
                    key={qs.id}
                    onClick={() => setCurrent(i)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: active
                        ? '#0f172a'
                        : done
                          ? '#22c55e'
                          : '#e2e8f0',
                      background: active
                        ? '#0f172a'
                        : done
                          ? '#f0fdf4'
                          : '#fff',
                      color: active ? '#fff' : done ? '#15803d' : '#64748b',
                    }}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            {/* Progress */}
            <div
              style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  color: '#94a3b8',
                  marginBottom: 6,
                }}
              >
                <span>Progress</span>
                <span>
                  {answered}/{EXAM.questions.length}
                </span>
              </div>
              <div
                style={{
                  background: '#e2e8f0',
                  borderRadius: 4,
                  height: 6,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: '#22c55e',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Question area */}
        <div>
          <div
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                Question {current + 1} of {EXAM.questions.length}
              </span>
              <span
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  fontSize: 12,
                  padding: '3px 10px',
                  borderRadius: 20,
                  fontWeight: 500,
                }}
              >
                {q.points} pts
              </span>
            </div>
            <div style={{ padding: '28px 28px 24px' }}>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.7,
                  fontWeight: 500,
                  margin: '0 0 24px',
                  color: '#0f172a',
                }}
              >
                {q.text}
              </p>

              {q.type === 'mcq' && q.options ? (
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  {q.options.map((opt, oi) => {
                    const selected = answers[q.id] === opt;
                    return (
                      <label
                        key={oi}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '12px 16px',
                          border: `2px solid ${selected ? '#0f172a' : '#e2e8f0'}`,
                          borderRadius: 10,
                          cursor: 'pointer',
                          background: selected ? '#f8fafc' : '#fff',
                          transition: 'border-color 0.15s, background 0.15s',
                        }}
                      >
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            border: `2px solid ${selected ? '#0f172a' : '#cbd5e1'}`,
                            background: selected ? '#0f172a' : '#fff',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {selected && (
                            <div
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: '#fff',
                              }}
                            />
                          )}
                        </div>
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={selected}
                          onChange={() => handleAnswer(q.id, opt)}
                          style={{ display: 'none' }}
                        />
                        <span
                          style={{
                            fontSize: 15,
                            color: selected ? '#0f172a' : '#374151',
                          }}
                        >
                          {opt}
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  placeholder="Type your answer here…"
                  style={{
                    width: '100%',
                    minHeight: 180,
                    border: '2px solid #e2e8f0',
                    borderRadius: 10,
                    padding: '14px 16px',
                    fontSize: 15,
                    lineHeight: 1.7,
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    color: '#0f172a',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0f172a';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                  }}
                />
              )}
            </div>

            {/* Nav buttons */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <button
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                style={{
                  background: 'transparent',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '9px 20px',
                  fontSize: 14,
                  cursor: current === 0 ? 'not-allowed' : 'pointer',
                  color: current === 0 ? '#cbd5e1' : '#374151',
                }}
              >
                ← Previous
              </button>
              {current < EXAM.questions.length - 1 ? (
                <button
                  onClick={() => setCurrent((c) => c + 1)}
                  style={{
                    background: '#0f172a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '9px 20px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  style={{
                    background: '#15803d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '9px 20px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Submit Exam ✓
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit confirm modal */}
      {showSubmitConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 32,
              maxWidth: 400,
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
          >
            <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700 }}>
              Submit Exam?
            </h2>
            <p
              style={{
                color: '#64748b',
                fontSize: 14,
                lineHeight: 1.6,
                margin: '0 0 20px',
              }}
            >
              You've answered{' '}
              <strong>
                {answered} of {EXAM.questions.length}
              </strong>{' '}
              questions.
              {answered < EXAM.questions.length &&
                ` ${EXAM.questions.length - answered} question(s) unanswered.`}{' '}
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowSubmitConfirm(false)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '10px',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  flex: 1,
                  background: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }`}</style>
    </div>
  );
}
