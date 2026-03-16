import { useState } from 'react';
import { ClockIcon, CalendarIcon } from './icons';
import ConfirmDialog from './ConfirmDialog';

function StreakCard({ icon, label, streak, onIncrement, onReset }) {
  const today = new Date();
  const dots = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    dots.push({ date: dateStr, active: streak.history.includes(dateStr) });
  }

  return (
    <div className="card">
      <div className="streak-card">
        <div className="counter-icon green">{icon}</div>
        <div className="streak-info">
          <div className="streak-label">{label}</div>
          <div className="streak-value">
            <span>{streak.count}</span> <span>days</span>
          </div>
          <div className="streak-dots">
            {dots.map((dot) => (
              <div key={dot.date} className={`streak-dot${dot.active ? ' active' : ''}`} title={dot.date} />
            ))}
          </div>
        </div>
        <div className="streak-actions">
          <button className="streak-btn" onClick={onIncrement}>+1 Day</button>
          <button className="streak-btn reset-streak" onClick={onReset}>Reset</button>
        </div>
      </div>
    </div>
  );
}

export default function PositivesTab({ data, update }) {
  const [confirm, setConfirm] = useState({ open: false, key: null, all: false });

  function incrementStreak(key) {
    update((d) => {
      const streak = { ...d.streaks[key] };
      streak.count++;
      const today = new Date().toISOString().split('T')[0];
      if (!streak.history.includes(today)) streak.history = [...streak.history, today];
      if (streak.history.length > 7) streak.history = streak.history.slice(-7);
      return { ...d, streaks: { ...d.streaks, [key]: streak } };
    });
    if (navigator.vibrate) navigator.vibrate([15, 50, 15]);
  }

  function doReset() {
    if (confirm.all) {
      update((d) => ({
        ...d,
        streaks: {
          nofap: { count: 0, history: [] },
          nohang: { count: 0, history: [] },
        },
      }));
    } else if (confirm.key) {
      update((d) => ({
        ...d,
        streaks: { ...d.streaks, [confirm.key]: { count: 0, history: [] } },
      }));
    }
    setConfirm({ open: false, key: null, all: false });
  }

  return (
    <div className="tab-content active">
      <div className="section-label green">Streaks</div>

      <StreakCard icon={<ClockIcon />} label="Days without Masturbating"
        streak={data.streaks.nofap}
        onIncrement={() => incrementStreak('nofap')}
        onReset={() => setConfirm({ open: true, key: 'nofap', all: false })} />

      <StreakCard icon={<CalendarIcon />} label="Weekdays without Hanging Out"
        streak={data.streaks.nohang}
        onIncrement={() => incrementStreak('nohang')}
        onReset={() => setConfirm({ open: true, key: 'nohang', all: false })} />

      <div className="reset-section-wrap">
        <button className="reset-section-btn" onClick={() => setConfirm({ open: true, key: null, all: true })}>
          Reset All Streaks
        </button>
      </div>

      <ConfirmDialog open={confirm.open}
        message={confirm.all ? 'This will reset all streak counters to zero.' : 'Reset this streak to zero?'}
        onConfirm={doReset} onCancel={() => setConfirm({ open: false, key: null, all: false })} />
    </div>
  );
}
