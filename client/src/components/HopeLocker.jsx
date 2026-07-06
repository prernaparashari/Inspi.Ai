import React, { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import PersonalDiary from './PersonalDiary';
import DailyTodoList from './DailyTodoList';

const MOODS = [
  { id: 'calm', label: 'Calm night', file: '/sounds/calm-night.mp3' },
  { id: 'focus', label: 'Focus flow', file: '/sounds/focus-flow.mp3' },
  { id: 'morning', label: 'Morning energy', file: '/sounds/morning-energy.mp3' },
  { id: 'rain', label: 'Rain & quiet', file: '/sounds/rain-quiet.mp3' },
];

function MoodSoundBar() {
  const [activeMood, setActiveMood] = useState(null);
  const audioRef = useRef(null);

  const toggleMood = (mood) => {
    if (activeMood === mood.id) {
      audioRef.current?.pause();
      setActiveMood(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.src = mood.file;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {
      
      });
    }
    setActiveMood(mood.id);
  };

  return (
    <div
      className="rounded-2xl p-4 border mb-6"
      style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
    >
      <audio ref={audioRef} />
      <div className="flex items-center gap-2 mb-3">
        {activeMood ? (
          <Volume2 className="w-4 h-4" style={{ color: '#c4b5fd' }} />
        ) : (
          <VolumeX className="w-4 h-4" style={{ color: '#8f89b8' }} />
        )}
        <p className="text-sm font-medium" style={{ color: '#e9e6ff' }}>Set the mood</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            type="button"
            onClick={() => toggleMood(mood)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
            style={
              activeMood === mood.id
                ? { background: 'linear-gradient(90deg,#818cf8,#a78bfa)', color: '#140f2b', borderColor: 'transparent' }
                : { background: 'rgba(0,0,0,0.2)', color: '#c9c4e6', borderColor: 'rgba(255,255,255,0.12)' }
            }
          >
            {mood.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function HopeLocker() {
  const [tab, setTab] = useState('diary'); 

  return (
    <div className="max-w-3xl w-full mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">Personal Space</h1>
        <p className="text-sm" style={{ color: '#b9b3d9' }}>
          The words only you know, and the days you're building — all kept right here.
        </p>
      </div>

      <MoodSoundBar />

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setTab('diary')}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={
            tab === 'diary'
              ? { background: 'linear-gradient(90deg,#818cf8,#a78bfa)', color: '#140f2b' }
              : { background: 'rgba(255,255,255,0.06)', color: '#c9c4e6' }
          }
        >
          My Diary
        </button>
        <button
          type="button"
          onClick={() => setTab('todo')}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={
            tab === 'todo'
              ? { background: 'linear-gradient(90deg,#818cf8,#a78bfa)', color: '#140f2b' }
              : { background: 'rgba(255,255,255,0.06)', color: '#c9c4e6' }
          }
        >
          To-Do List
        </button>
      </div>

      {tab === 'diary' ? <PersonalDiary /> : <DailyTodoList />}
    </div>
  );
}