'use client';
import { useState } from 'react';

export default function ResetButton({ onClick, disabled }) {
  const [hover, setHover] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: disabled ? '#9ec9e9' : hover ? '#e0f7fa' : '#fff',
          border: '4px solid #000',
          boxShadow: '2px 2px 0 #222',
          cursor: disabled ? 'not-allowed' : 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s, box-shadow 0.2s, transform 0.1s',
          userSelect: 'none',
          transform: hover ? 'scale(1.05)' : 'scale(1)',
          willChange: 'transform',
        }}
        aria-label="重置爪子位置"
      >
        <img
          src="/33.webp"
          alt="重置爪子位置"
          style={{
            width: 42,
            height: 42,
            imageRendering: 'pixelated',
            display: 'block',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          draggable={false}
        />
      </button>

      {/* Tooltip 往下顯示 */}
      {hover && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',  // 改成往下顯示
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#fff',
            border: '4px solid #000',
            boxShadow: '4px 4px 0 #222',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 'bold',
            color: '#000',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            zIndex: 9999,
            fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
              Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`,
          }}
        >
          重置爪子按鈕
        </div>
      )}
    </div>
  );
}
