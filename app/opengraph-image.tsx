 import { ImageResponse } from 'next/og';

export const alt = 'Bazaa — Buy & Sell Marketplace';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          color: '#F7F5F0',
          position: 'relative',
          background: 'linear-gradient(135deg, #19182B 0%, #1F1E35 100%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -120,
            top: -120,
            width: 520,
            height: 520,
            borderRadius: 260,
            background: 'rgba(217,144,36,0.18)',
          }}
        />
        <div style={{ display: 'flex', fontSize: 120, fontWeight: 700 }}>
          Baz<span style={{ color: '#D99024' }}>aa</span>
        </div>
        <div style={{ fontSize: 52, marginTop: 24, lineHeight: 1.2 }}>
          Buy and sell anything,
        </div>
        <div style={{ fontSize: 52, color: '#D99024', lineHeight: 1.2 }}>
          right in your area.
        </div>
      </div>
    ),
    { ...size },
  );
}
