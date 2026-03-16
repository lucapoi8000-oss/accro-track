import { useRef, useEffect, useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

const CHART_COLORS = { beer: '#E67E22', wine: '#C0392B', cigs: '#E74C3C', disco: '#9B59B6' };
const CHART_LABELS = { beer: 'Beer', wine: 'Wine', cigs: 'Cigarettes', disco: 'Disco / Clubs' };
const CATS = ['beer', 'wine', 'cigs', 'disco'];

function getDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function getMonthLabel(monthStr) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const idx = parseInt(monthStr.split('-')[1], 10) - 1;
  return months[idx];
}

function getMondayOf(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff).toISOString().split('T')[0];
}

function aggregateByWeek(log) {
  const weeks = {};
  log.forEach(entry => {
    const monday = getMondayOf(entry.date);
    if (!weeks[monday]) weeks[monday] = { date: monday, beer: 0, wine: 0, cigs: 0, disco: 0 };
    CATS.forEach(c => { weeks[monday][c] += entry[c] || 0; });
  });
  return Object.values(weeks).sort((a, b) => a.date.localeCompare(b.date));
}

function aggregateByMonth(log) {
  const months = {};
  log.forEach(entry => {
    const month = entry.date.slice(0, 7);
    if (!months[month]) months[month] = { date: month, beer: 0, wine: 0, cigs: 0, disco: 0 };
    CATS.forEach(c => { months[month][c] += entry[c] || 0; });
  });
  return Object.values(months).sort((a, b) => a.date.localeCompare(b.date));
}

export default function StatsTab({ data, update }) {
  const [selectedCat, setSelectedCat] = useState('beer');
  const [timeRange, setTimeRange] = useState('daily');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const timelineRef = useRef(null);
  const pieRef = useRef(null);

  function getFilteredLog() {
    const log = data.expenseLog || [];
    if (timeRange === 'daily') {
      const cutoff = getDaysAgo(7);
      return log.filter(e => e.date >= cutoff);
    }
    if (timeRange === 'weekly') {
      const cutoff = getDaysAgo(30);
      return log.filter(e => e.date >= cutoff);
    }
    return log;
  }

  function getChartData() {
    const filtered = getFilteredLog();
    if (timeRange === 'daily') {
      return [...filtered].sort((a, b) => a.date.localeCompare(b.date));
    }
    if (timeRange === 'weekly') {
      return aggregateByWeek(filtered);
    }
    return aggregateByMonth(filtered);
  }

  function getChartLabels(chartData) {
    return chartData.map(entry => {
      if (timeRange === 'monthly') return getMonthLabel(entry.date);
      return entry.date.slice(5);
    });
  }

  useEffect(() => {
    drawTimeline();
    drawPie();
  }, [data, selectedCat, timeRange]);

  function drawTimeline() {
    const canvas = timelineRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.width * 0.5 * dpr;
    canvas.style.height = rect.width * 0.5 + 'px';
    ctx.scale(dpr, dpr);
    const W = rect.width, H = rect.width * 0.5;
    const chartData = getChartData();
    const cat = selectedCat;
    const color = CHART_COLORS[cat];
    ctx.clearRect(0, 0, W, H);

    if (chartData.length === 0) return;

    const labels = getChartLabels(chartData);
    let cumValues = [], cumTotal = 0;
    chartData.forEach((entry) => {
      cumTotal += entry[cat] || 0;
      cumValues.push(cumTotal);
    });

    const maxVal = Math.max(...cumValues, 1);
    const pad = { top: 20, right: 16, bottom: 30, left: 44 };
    const cw = W - pad.left - pad.right;
    const ch = H - pad.top - pad.bottom;

    ctx.strokeStyle = '#222'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (ch / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
      ctx.fillStyle = '#555'; ctx.font = '10px Inter, sans-serif'; ctx.textAlign = 'right';
      ctx.fillText('€' + Math.round(maxVal - (maxVal / 4) * i), pad.left - 6, y + 4);
    }

    ctx.fillStyle = '#555'; ctx.font = '9px Inter, sans-serif'; ctx.textAlign = 'center';
    const step = Math.max(1, Math.floor(labels.length / 6));
    labels.forEach((l, i) => {
      if (i % step === 0 || i === labels.length - 1) {
        const x = pad.left + (i / Math.max(labels.length - 1, 1)) * cw;
        ctx.fillText(l, x, H - 8);
      }
    });

    // Area
    ctx.beginPath();
    cumValues.forEach((v, i) => {
      const x = pad.left + (i / Math.max(cumValues.length - 1, 1)) * cw;
      const y = pad.top + ch - (v / maxVal) * ch;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo(pad.left + ((cumValues.length - 1) / Math.max(cumValues.length - 1, 1)) * cw, pad.top + ch);
    ctx.lineTo(pad.left, pad.top + ch);
    ctx.closePath();
    ctx.fillStyle = color + '18'; ctx.fill();

    // Line
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath();
    cumValues.forEach((v, i) => {
      const x = pad.left + (i / Math.max(cumValues.length - 1, 1)) * cw;
      const y = pad.top + ch - (v / maxVal) * ch;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dots
    cumValues.forEach((v, i) => {
      const x = pad.left + (i / Math.max(cumValues.length - 1, 1)) * cw;
      const y = pad.top + ch - (v / maxVal) * ch;
      ctx.fillStyle = '#1A1A1A'; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
    });

    if (cumValues.length > 0) {
      const lastV = cumValues[cumValues.length - 1];
      const lastX = pad.left + ((cumValues.length - 1) / Math.max(cumValues.length - 1, 1)) * cw;
      const lastY = pad.top + ch - (lastV / maxVal) * ch;
      ctx.fillStyle = color; ctx.font = '600 11px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('€' + lastV.toFixed(0), lastX, lastY - 10);
    }
  }

  function drawPie() {
    const canvas = pieRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 280;
    canvas.width = size * dpr; canvas.height = size * dpr;
    canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    const filtered = getFilteredLog();
    const totals = { beer: 0, wine: 0, cigs: 0, disco: 0 };
    filtered.forEach((e) => { CATS.forEach((c) => { totals[c] += e[c] || 0; }); });
    const sum = CATS.reduce((s, c) => s + totals[c], 0);
    if (sum === 0) return;

    const cx = size / 2, cy = size / 2, r = 110, innerR = 60;
    let startAngle = -Math.PI / 2;
    const slices = CATS.filter((k) => totals[k] > 0);

    slices.forEach((key) => {
      const val = totals[key];
      const slice = (val / sum) * Math.PI * 2;
      const endAngle = startAngle + slice;
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = CHART_COLORS[key]; ctx.fill();
      const pct = Math.round((val / sum) * 100);
      if (pct >= 8) {
        const midAngle = startAngle + slice / 2;
        const labelR = (r + innerR) / 2;
        ctx.fillStyle = '#FFF'; ctx.font = '600 12px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(pct + '%', cx + Math.cos(midAngle) * labelR, cy + Math.sin(midAngle) * labelR);
      }
      startAngle = endAngle;
    });

    ctx.fillStyle = '#E0E0E0'; ctx.font = '700 18px Inter, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('€' + sum.toFixed(0), cx, cy - 6);
    ctx.fillStyle = '#666'; ctx.font = '500 10px Inter, sans-serif';
    ctx.fillText('TOTAL', cx, cy + 12);
  }

  const filtered = getFilteredLog();
  const totals = { beer: 0, wine: 0, cigs: 0, disco: 0 };
  filtered.forEach((e) => { CATS.forEach((c) => { totals[c] += e[c] || 0; }); });
  const sum = CATS.reduce((s, c) => s + totals[c], 0);
  const slices = CATS.filter((k) => totals[k] > 0);
  const rangeLabel = timeRange === 'daily' ? 'Last 7 days' : timeRange === 'weekly' ? 'Last 30 days' : 'All time';

  return (
    <div className="tab-content active">
      <div className="time-range-pills">
        {['daily', 'weekly', 'monthly'].map(r => (
          <button key={r} className={`time-pill${timeRange === r ? ' active' : ''}`}
            onClick={() => setTimeRange(r)}>
            {r === 'daily' ? 'Daily' : r === 'weekly' ? 'Weekly' : 'Monthly'}
          </button>
        ))}
        <span className="time-range-label">{rangeLabel}</span>
      </div>

      <div className="section-label" style={{ color: '#9B59B6' }}>Expense Timeline</div>

      <div className="chart-card">
        <div className="chart-title">Spending Over Time</div>
        <div className="chart-tabs">
          {CATS.map((cat) => (
            <button key={cat}
              className={`chart-tab${selectedCat === cat ? ' active' : ''}`}
              style={{ '--tab-color': CHART_COLORS[cat] }}
              onClick={() => setSelectedCat(cat)}>
              {CHART_LABELS[cat]}
            </button>
          ))}
        </div>
        <div className="chart-canvas-wrap">
          <canvas ref={timelineRef} />
        </div>
        {filtered.length === 0 && <div className="stats-empty">Log expenses to see your timeline.</div>}
      </div>

      <div className="section-label" style={{ color: '#9B59B6' }}>Expense Breakdown</div>

      <div className="chart-card">
        <div className="chart-title">By Category</div>
        <div className="chart-canvas-wrap" style={{ maxWidth: 280, margin: '0 auto' }}>
          <canvas ref={pieRef} />
        </div>
        {sum === 0 && <div className="stats-empty">No expenses recorded yet.</div>}
        {sum > 0 && (
          <div className="pie-legend">
            {slices.map((key) => (
              <div key={key} className="pie-legend-item">
                <div className="pie-legend-dot" style={{ background: CHART_COLORS[key] }} />
                {CHART_LABELS[key]} — €{totals[key].toFixed(2)}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="reset-section-wrap">
        <button className="reset-section-btn" onClick={() => setConfirmOpen(true)}>Clear Expense History</button>
      </div>

      <ConfirmDialog open={confirmOpen} message="This will clear all expense history used for charts."
        onConfirm={() => { update((d) => ({ ...d, expenseLog: [] })); setConfirmOpen(false); }}
        onCancel={() => setConfirmOpen(false)} />
    </div>
  );
}
