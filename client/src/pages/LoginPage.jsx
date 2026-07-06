import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const STAR_SEED = Array.from({ length: 60 }).map((_, i) => ({
  id: i,
  top: Math.random() * 60,
  left: Math.random() * 100,
  size: Math.random() * 1.6 + 0.6,
  delay: Math.random() * 4,
}));

export default function LoginPage() {
  const navigate = useNavigate();
  const stars = useMemo(() => STAR_SEED, []);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden"
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

      <svg
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        viewBox="0 0 1200 260"
        preserveAspectRatio="none"
        style={{ height: '30%' }}
      >
        <path
          d="M0,180 C150,140 300,200 450,160 C600,120 750,190 900,150 C1000,125 1100,150 1200,140 L1200,260 L0,260 Z"
          fill="#241a4a"
          opacity="0.9"
        />
        <path
          d="M0,220 C180,190 320,240 500,210 C680,180 820,230 1000,205 C1080,195 1140,205 1200,200 L1200,260 L0,260 Z"
          fill="#1a1235"
        />
      </svg>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }
      `}</style>

      <div
        className="relative z-10 w-full max-w-md rounded-3xl p-8 backdrop-blur-xl border"
        style={{
          background: 'rgba(255,255,255,0.06)',
          borderColor: 'rgba(255,255,255,0.12)',
          boxShadow: '0 20px 60px rgba(10,5,30,0.6)',
        }}
      >
        <AuthForm onSuccess={() => navigate('/chat')} />
      </div>
    </div>
  );
}