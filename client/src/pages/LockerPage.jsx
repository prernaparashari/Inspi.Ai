import React, { useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import HopeLocker from '../components/HopeLocker';

const STAR_SEED = Array.from({ length: 60 }).map((_, i) => ({
  id: i,
  top: Math.random() * 60,
  left: Math.random() * 100,
  size: Math.random() * 1.6 + 0.6,
  delay: Math.random() * 4,
}));

export default function LockerPage() {
  const stars = useMemo(() => STAR_SEED, []);

  return (
    <div
      className="min-h-screen w-full flex relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0b0a1f 0%, #1a1440 35%, #2f2160 65%, #4a2f6e 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((s) => (
          <span
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: 0.8,
              animation: `twinkle 3.5s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }
      `}</style>

      <Sidebar />
      <div className="relative z-10 flex-1 overflow-y-auto">
        <HopeLocker />
      </div>
    </div>
  );
}