import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = 'StrellerMinds - Blockchain Education Platform';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage:
            'radial-gradient(circle at 25px 25px, #1a1a1a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1a1a 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
            zIndex: 1,
          }}
        >
          {/* Logo/Brand Icon - Using emoji as placeholder */}
          <div
            style={{
              fontSize: 120,
              marginBottom: 40,
              filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.5))',
            }}
          >
            🧠
          </div>

          {/* Main Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              background:
                'linear-gradient(to right, #6366f1, #a855f7, #ec4899)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            StrellerMinds
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 32,
              color: '#e5e7eb',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: 1.4,
            }}
          >
            Empowering minds through blockchain education
          </div>

          {/* Decorative Elements */}
          <div
            style={{
              display: 'flex',
              marginTop: 60,
              gap: 40,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#9ca3af',
                fontSize: 24,
              }}
            >
              <span style={{ marginRight: 10 }}>🔗</span>
              DeFi
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#9ca3af',
                fontSize: 24,
              }}
            >
              <span style={{ marginRight: 10 }}>📜</span>
              Smart Contracts
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#9ca3af',
                fontSize: 24,
              }}
            >
              <span style={{ marginRight: 10 }}>🌐</span>
              Web3
            </div>
          </div>
        </div>

        {/* Bottom Brand Strip */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)',
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
