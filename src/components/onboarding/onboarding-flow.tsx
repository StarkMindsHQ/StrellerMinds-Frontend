'use client';
import { useState } from 'react';

const STEPS = [
  {
    id: 1,
    title: 'Welcome to StrellerMinds',
    subtitle: "Let's get you set up in just a few steps.",
    icon: '✦',
    fields: [
      {
        label: 'Full Name',
        type: 'text',
        placeholder: 'Jane Doe',
        key: 'name',
      },
      {
        label: 'Role',
        type: 'select',
        options: ['Student', 'Educator', 'Professional', 'Other'],
        key: 'role',
      },
    ],
  },
  {
    id: 2,
    title: 'Your Learning Goals',
    subtitle: 'Help us personalize your experience.',
    icon: '◎',
    fields: [
      {
        label: 'Primary Goal',
        type: 'select',
        options: [
          'Career Switch',
          'Skill Upgrade',
          'Academic',
          'Personal Growth',
        ],
        key: 'goal',
      },
      {
        label: 'Weekly Hours Available',
        type: 'select',
        options: ['< 2 hrs', '2–5 hrs', '5–10 hrs', '10+ hrs'],
        key: 'hours',
      },
    ],
  },
  {
    id: 3,
    title: 'Pick Your Interests',
    subtitle: "We'll curate content just for you.",
    icon: '⬡',
    multiSelect: [
      'Web Development',
      'Data Science',
      'Design',
      'AI & ML',
      'Business',
      'Cybersecurity',
      'Cloud',
      'Mobile',
    ],
    key: 'interests',
  },
  {
    id: 4,
    title: "You're all set!",
    subtitle: 'Your profile is ready. Start exploring your dashboard.',
    icon: '★',
    final: true,
  },
];

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: '',
    role: '',
    goal: '',
    hours: '',
    interests: [],
  });
  const [saved, setSaved] = useState(false);

  const current = STEPS[step];
  const progress = (step / (STEPS.length - 1)) * 100;

  const toggleInterest = (item) => {
    setData((d) => ({
      ...d,
      interests: d.interests.includes(item)
        ? d.interests.filter((i) => i !== item)
        : [...d.interests, item],
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        maxWidth: 560,
        margin: '0 auto',
        padding: '2rem 1rem',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');
        .ob-step-btn { background: #0f172a; color: #fff; border: none; border-radius: 10px; padding: 12px 28px; font-size: 15px; font-weight: 500; cursor: pointer; transition: opacity 0.15s; }
        .ob-step-btn:hover { opacity: 0.85; }
        .ob-back-btn { background: transparent; color: #64748b; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 12px 28px; font-size: 15px; cursor: pointer; transition: background 0.15s; }
        .ob-back-btn:hover { background: #f8fafc; }
        .ob-input { width: 100%; box-sizing: border-box; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 11px 14px; font-size: 15px; outline: none; font-family: inherit; color: #0f172a; background: #fff; transition: border-color 0.15s; }
        .ob-input:focus { border-color: #6366f1; }
        .ob-pill { border: 1.5px solid #e2e8f0; border-radius: 100px; padding: 8px 18px; font-size: 14px; cursor: pointer; transition: all 0.15s; background: #fff; color: #334155; display: inline-block; user-select: none; }
        .ob-pill.active { background: #0f172a; color: #fff; border-color: #0f172a; }
        .ob-pill:hover { border-color: #94a3b8; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              color: '#0f172a',
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}
          >
            StrellerMinds
          </span>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
        {/* Progress bar */}
        <div
          style={{
            height: 4,
            background: '#f1f5f9',
            borderRadius: 100,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              borderRadius: 100,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 0, marginTop: 8 }}>
          {STEPS.map((s, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background:
                    i < step ? '#0f172a' : i === step ? '#6366f1' : '#f1f5f9',
                  color: i <= step ? '#fff' : '#94a3b8',
                  fontSize: 11,
                  fontWeight: 600,
                  transition: 'all 0.3s',
                }}
              >
                {i < step ? '✓' : i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card */}
      <div
        style={{
          background: '#fff',
          border: '1.5px solid #e2e8f0',
          borderRadius: 16,
          padding: '2rem',
          marginBottom: '1.5rem',
          minHeight: 300,
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12, lineHeight: 1 }}>
          {current.icon}
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 24,
            fontWeight: 700,
            color: '#0f172a',
            margin: '0 0 6px',
            letterSpacing: '-0.5px',
          }}
        >
          {current.title}
        </h2>
        <p
          style={{
            color: '#64748b',
            fontSize: 15,
            margin: '0 0 1.75rem',
            lineHeight: 1.6,
          }}
        >
          {current.subtitle}
        </p>

        {current.final ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
            <p
              style={{
                color: '#334155',
                fontSize: 15,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Welcome, <strong>{data.name || 'learner'}</strong>! Your journey
              begins now.
            </p>
            {data.interests.length > 0 && (
              <div
                style={{
                  marginTop: 16,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                  justifyContent: 'center',
                }}
              >
                {data.interests.map((i) => (
                  <span
                    key={i}
                    style={{
                      background: '#f1f5f9',
                      color: '#334155',
                      padding: '4px 12px',
                      borderRadius: 100,
                      fontSize: 13,
                    }}
                  >
                    {i}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : current.multiSelect ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {current.multiSelect.map((item) => (
              <span
                key={item}
                className={`ob-pill${data.interests.includes(item) ? ' active' : ''}`}
                onClick={() => toggleInterest(item)}
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {current.fields.map((f) =>
              f.type === 'select' ? (
                <div key={f.key}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#374151',
                      marginBottom: 6,
                    }}
                  >
                    {f.label}
                  </label>
                  <select
                    className="ob-input"
                    value={data[f.key]}
                    onChange={(e) =>
                      setData({ ...data, [f.key]: e.target.value })
                    }
                  >
                    <option value="">Select…</option>
                    {f.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div key={f.key}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#374151',
                      marginBottom: 6,
                    }}
                  >
                    {f.label}
                  </label>
                  <input
                    className="ob-input"
                    type="text"
                    placeholder={f.placeholder}
                    value={data[f.key]}
                    onChange={(e) =>
                      setData({ ...data, [f.key]: e.target.value })
                    }
                  />
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 10 }}>
          {step > 0 && !current.final && (
            <button className="ob-back-btn" onClick={() => setStep(step - 1)}>
              ← Back
            </button>
          )}
          <button
            className="ob-back-btn"
            onClick={handleSave}
            style={{ fontSize: 14, padding: '12px 20px' }}
          >
            {saved ? '✓ Saved' : 'Save Progress'}
          </button>
        </div>
        {!current.final ? (
          <button className="ob-step-btn" onClick={() => setStep(step + 1)}>
            {step === STEPS.length - 2 ? 'Finish →' : 'Next →'}
          </button>
        ) : (
          <button
            className="ob-step-btn"
            onClick={() => setStep(0)}
            style={{ background: '#6366f1' }}
          >
            Start Over
          </button>
        )}
      </div>
    </div>
  );
}
