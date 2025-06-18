'use client';
import { useState } from 'react';

function HamburgerIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" style={{ display: 'block' }}>
      <rect x="6" y="9" width="20" height="3" rx="1.5" fill="#222" />
      <rect x="6" y="15" width="20" height="3" rx="1.5" fill="#222" />
      <rect x="6" y="21" width="20" height="3" rx="1.5" fill="#222" />
    </svg>
  );
}

export default function FloatingWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#fff',
          border: '4px solid #000',
          boxShadow: '2px 2px 0 #222',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: 28,
          zIndex: 2000,
          padding: 0,
          transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#e0f7fa';
          e.currentTarget.style.boxShadow = '8px 8px 0 #222';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#fff';
          e.currentTarget.style.boxShadow = '4px 4px 0 #222';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        aria-label={open ? '關閉視窗' : '開啟視窗'}
      >
        {open ? 'Ｘ' : <HamburgerIcon />}
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            top: 92,
            left: 24,
            width: 280,
            minHeight: 120,
            background: '#fff',
            border: '4px solid #000',
            boxShadow: '4px 4px 0 #222',
            borderRadius: 12,
            zIndex: 1999,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            fontFamily: 'system-ui, sans-serif',
            fontSize: 14,
            color: '#222',
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Bear Hunter‘s Manual</div>
          <div>
            使用鍵盤的上下左右鍵操控爪子，按下空白鍵來抓取熊熊！<br />
            「懶懶熊」、「胖胖熊」、「酷酷熊」正等著你來發現，但是如果運氣不好的話，可能會一直遇到“消失熊”喔！
          </div>
        </div>
      )}
    </>
  );
}
