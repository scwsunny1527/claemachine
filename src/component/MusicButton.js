// component/MusicButton.js
import { useRef, useEffect } from 'react';

export default function MusicButton({ isPlaying, toggleMusic }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/bg.mp3');
      audioRef.current.loop = true;
    }
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        // 自動播放被阻擋時忽略錯誤
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: '#fff',
        border: '4px solid #000',
        boxShadow: '2px 2px 0 #222',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
      }}
      onClick={toggleMusic}
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
      aria-label={isPlaying ? '暫停音樂' : '播放音樂'}
    >
      <img
        src={isPlaying ? '/31.webp' : '/32.webp'}
        alt={isPlaying ? '音樂播放中' : '音樂暫停'}
        style={{
          width: 42,
          height: 42,
          imageRendering: 'pixelated',
          display: 'block',
        }}
      />
    </div>
  );
}
