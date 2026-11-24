import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top Brand Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                fontWeight: 900,
              }}
            >
              T
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.03em' }}>Tranvas</span>
              <span style={{ fontSize: '15px', color: '#a5b4fc', fontWeight: 600 }}>THE UNIFIED LIFE OS</span>
            </div>
          </div>
          <div
            style={{
              padding: '10px 22px',
              borderRadius: '999px',
              background: 'rgba(99, 102, 241, 0.25)',
              border: '1px solid rgba(165, 180, 252, 0.4)',
              fontSize: '18px',
              fontWeight: 700,
              color: '#e0e7ff',
            }}
          >
            8 Modules • 1 Workspace
          </div>
        </div>

        {/* Center Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '980px' }}>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              color: '#ffffff',
            }}
          >
            Master Your Focus, Habits, Finance &amp; Goals in One OS.
          </div>
          <div
            style={{
              fontSize: '26px',
              lineHeight: 1.4,
              color: '#cbd5e1',
              fontWeight: 500,
            }}
          >
            Replace 6 fragmented apps with Daily Planner, 28-Day Habit Matrix, Zero-Based Finance, WOOP Goals, Career Pipeline, Journal, Study &amp; Calendar.
          </div>
        </div>

        {/* Bottom Module Pills & Domain */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['Planner', 'Habits', 'Finance', 'WOOP Goals', 'Journal', 'Calendar'].map((m) => (
              <div
                key={m}
                style={{
                  padding: '8px 18px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  fontSize: '17px',
                  fontWeight: 700,
                  color: '#e2e8f0',
                }}
              >
                {m}
              </div>
            ))}
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#818cf8' }}>tranvas.com</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      },
    }
  );
}
