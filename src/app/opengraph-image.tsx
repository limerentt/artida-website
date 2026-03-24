import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'АРТИДА — Производство электроники'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0F2A4A 0%, #1E4D8C 50%, #2B6CB0 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            opacity: 0.08,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {/* Logo text */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '0.1em',
            }}
          >
            АРТИДА
          </div>

          {/* Divider */}
          <div
            style={{
              width: 80,
              height: 3,
              background: 'rgba(255,255,255,0.5)',
              borderRadius: 2,
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 400,
            }}
          >
            Производство электроники
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 600,
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            Бесконтактные кнопки • Устройства доступа • Контрактное производство
          </div>
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 50,
            fontSize: 20,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.05em',
          }}
        >
          artida.by
        </div>
      </div>
    ),
    { ...size }
  )
}
