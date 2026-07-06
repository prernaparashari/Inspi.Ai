import React from 'react';


export default function SparkMark({ pulsing = false, size = 14 }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size * 4, height: size * 4 }}
    >
      <svg viewBox="0 0 48 48" style={{ width: size * 2.85, height: size * 2.85 }} className="relative z-10">
        <defs>
          <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        <path
          d="M24 2 C25 14 26 22 44 24 C26 26 25 34 24 46 C23 34 22 26 4 24 C22 22 23 14 24 2 Z"
          fill="url(#sparkGrad)"
        />
      </svg>
      <span
        className="absolute w-1.5 h-1.5 rounded-full"
        style={{
          background: '#fbbf24',
          boxShadow: '0 0 6px 1px rgba(251,191,36,0.8)',
          animation: pulsing ? 'orbit 1.1s linear 1' : 'orbit 3.2s linear infinite',
        }}
      />
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(17px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(17px) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}