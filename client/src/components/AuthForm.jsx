import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import SparkMark from './SparkMark';
import { useAuth } from '../context/AuthContext';

export default function AuthForm({ onSuccess }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login'); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState('idle'); 
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && !name.trim()) {
      setError('Tell us what to call you.');
      setStatus('error');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError('Enter your email and password to continue.');
      setStatus('error');
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      setError('That email address doesn\u2019t look right.');
      setStatus('error');
      return;
    }
    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      if (mode === 'signup') {
        await signup(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      setStatus('success');
      setTimeout(() => onSuccess?.(email.trim()), 700);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <CheckCircle2 className="w-12 h-12 mb-3" style={{ color: '#a7f3d0' }} />
        <h2 className="text-2xl font-bold text-white mb-1">You&apos;re in</h2>
        <p className="text-sm" style={{ color: '#b9b3d9' }}>
          Welcome back to Inspi.Ai{email ? `, ${email.split('@')[0]}` : ''}.
        </p>
        <p className="text-xs mt-4" style={{ color: '#8f89b8' }}>Taking you to your chat…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col items-center text-center mb-6">
        <SparkMark pulsing={status === 'loading'} />
        <h1 className="text-3xl font-bold text-white mt-2">
          Welcome to <span style={{ color: '#c4b5fd' }}>Inspi.Ai</span>
        </h1>
        <p className="text-sm mt-2" style={{ color: '#b9b3d9' }}>
          {mode === 'signup'
            ? 'Create an account to start your journey.'
            : 'Sign in to pick up your ideas right where you left them.'}
        </p>
      </div>

      {error && (
        <div
          className="mb-4 text-sm rounded-xl px-4 py-2 border"
          style={{ color: '#fecaca', background: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.25)' }}
        >
          {error}
        </div>
      )}

      {mode === 'signup' && (
        <>
          <label className="block text-xs mb-1.5" style={{ color: '#c9c4e6' }}>Name</label>
          <div className="relative mb-4">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8f89b8' }} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What should we call you?"
              className="w-full pl-10 pr-3 py-3 rounded-xl text-white text-sm outline-none border transition-all focus:border-indigo-300"
              style={{ background: 'rgba(0,0,0,0.25)', borderColor: 'rgba(255,255,255,0.1)' }}
            />
          </div>
        </>
      )}

      <label className="block text-xs mb-1.5" style={{ color: '#c9c4e6' }}>Email</label>
      <div className="relative mb-4">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8f89b8' }} />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full pl-10 pr-3 py-3 rounded-xl text-white text-sm outline-none border transition-all focus:border-indigo-300"
          style={{ background: 'rgba(0,0,0,0.25)', borderColor: 'rgba(255,255,255,0.1)' }}
        />
      </div>

      <label className="block text-xs mb-1.5" style={{ color: '#c9c4e6' }}>Password</label>
      <div className="relative mb-4">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8f89b8' }} />
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
          className="w-full pl-10 pr-10 py-3 rounded-xl text-white text-sm outline-none border transition-all focus:border-indigo-300"
          style={{ background: 'rgba(0,0,0,0.25)', borderColor: 'rgba(255,255,255,0.1)' }}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: '#8f89b8' }}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {mode === 'login' && (
        <div className="flex items-center justify-between mb-6 text-xs">
          <label className="flex items-center gap-2 cursor-pointer" style={{ color: '#c9c4e6' }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="accent-indigo-400 w-3.5 h-3.5"
            />
            Remember me
          </label>
          <button
            type="button"
            className="hover:underline"
            style={{ color: '#c4b5fd' }}
            onClick={() => setError('Password reset isn\u2019t wired up yet.')}
          >
            Forgot password?
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
        style={{ background: 'linear-gradient(90deg,#818cf8,#a78bfa)', color: '#140f2b' }}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> {mode === 'signup' ? 'Creating account…' : 'Signing in…'}
          </>
        ) : mode === 'signup' ? (
          'Sign up'
        ) : (
          'Log in'
        )}
      </button>

      <p className="text-center text-xs mt-6" style={{ color: '#a29cc7' }}>
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              className="font-semibold hover:underline"
              style={{ color: '#c4b5fd' }}
              onClick={() => {
                setMode('signup');
                setError('');
              }}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              className="font-semibold hover:underline"
              style={{ color: '#c4b5fd' }}
              onClick={() => {
                setMode('login');
                setError('');
              }}
            >
              Log in
            </button>
          </>
        )}
      </p>
    </form>
  );
}