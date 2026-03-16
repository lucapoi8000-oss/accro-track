import { useState, useRef, useEffect } from 'react';
import { WineIcon, BeerIcon, CigIcon, PeopleIcon, CigPackIcon, DiscoIcon } from './icons';
import AmountPicker from './AmountPicker';
import ConfirmDialog from './ConfirmDialog';
import { getMonday } from '../hooks/useStore';

function CounterCard({ icon, label, value, todayValue, onInc, onDec }) {
  const valRef = useRef(null);
  function pop() {
    const el = valRef.current;
    if (!el) return;
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  }
  return (
    <div className="card counter-card">
      <div className="counter-icon red">{icon}</div>
      <div className="counter-info">
        <div className="counter-label">{label}</div>
        <div className="counter-value" ref={valRef}>{value}</div>
        {todayValue > 0 && (
          <div className="counter-today">Today: <span>{todayValue}</span></div>
        )}
      </div>
      <div className="counter-buttons">
        <button className="counter-btn minus" onClick={() => { onDec(); pop(); }}>−</button>
        <button className="counter-btn plus red" onClick={() => { onInc(); pop(); }}>+</button>
      </div>
    </div>
  );
}

function getMoneyColor(val, cat, thresholds) {
  const th = thresholds[cat];
  if (!th) return 'money-val-green';
  if (val >= th.red) return 'money-val-red';
  if (val >= th.yellow) return 'money-val-yellow';
  return 'money-val-green';
}

function ExpenseCard({ icon, label, value, colorClass, onPlus, onMinus }) {
  const valRef = useRef(null);
  function pop() {
    const el = valRef.current;
    if (!el) return;
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  }
  return (
    <div className="card counter-card">
      <div className="counter-icon red">{icon}</div>
      <div className="counter-info">
        <div className="counter-label">{label}</div>
        <div className="counter-value" ref={valRef}>
          <span className={colorClass}>€{value}</span>
        </div>
      </div>
      <div className="counter-buttons">
        <button className="counter-btn minus" onClick={() => { onMinus(); pop(); }}>−</button>
        <button className="counter-btn plus red" onClick={() => { onPlus(); pop(); }}>+</button>
      </div>
    </div>
  );
}

function BudgetBar({ icon, label, spent, budget, color }) {
  const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const barColor = pct >= 100 ? '#E74C3C' : pct >= 75 ? '#F1C40F' : '#27AE60';
  return (
    <div className="card budget-card">
      <div className="budget-header">
        <div className="counter-icon" style={{ background: color + '22' }}>{icon}</div>
        <div className="budget-info">
          <div className="budget-label">{label}</div>
          <div className="budget-amounts">
            <span style={{ color: barColor }}>€{spent.toFixed(0)}</span>
            <span className="budget-separator">/</span>
            <span className="budget-total">€{budget}</span>
          </div>
        </div>
        <div className="budget-pct" style={{ color: barColor }}>{Math.round(pct)}%</div>
      </div>
      <div className="budget-bar-track">
        <div className="budget-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
      </div>
    </div>
  );
}

export default function AddictionsTab({ data, update }) {
  const [picker, setPicker] = useState({ open: false, cat: null, mode: null });
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Reset today's counters if date changed
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (data.countersDate !== today) {
      update((d) => ({
        ...d,
        countersToday: { wine: 0, beer: 0, cigs: 0, ons: 0 },
        countersDate: today,
      }));
    }
  }, []);

  // Reset weekly spending if week changed
  useEffect(() => {
    const monday = getMonday();
    if (data.weeklySpending?.weekOf !== monday) {
      update((d) => ({
        ...d,
        weeklySpending: { weekOf: monday, beer: 0, wine: 0, cigs: 0, disco: 0 },
      }));
    }
  }, []);

  function changeCounter(key, delta) {
    const today = new Date().toISOString().split('T')[0];
    update((d) => {
      const ct = d.countersDate === today
        ? { ...d.countersToday }
        : { wine: 0, beer: 0, cigs: 0, ons: 0 };
      ct[key] = Math.max(0, (ct[key] || 0) + delta);
      return {
        ...d,
        counters: { ...d.counters, [key]: Math.max(0, (d.counters[key] || 0) + delta) },
        countersToday: ct,
        countersDate: today,
      };
    });
    if (navigator.vibrate) navigator.vibrate(delta > 0 ? 15 : 8);
  }

  function changeMoney(cat, delta) {
    update((d) => {
      const newMoney = { ...d.money, [cat]: Math.max(0, Math.round(((d.money[cat] || 0) + delta) * 100) / 100) };
      const today = new Date().toISOString().split('T')[0];
      const log = [...d.expenseLog];
      const idx = log.findIndex((e) => e.date === today);
      if (idx >= 0) {
        log[idx] = { ...log[idx], [cat]: Math.max(0, (log[idx][cat] || 0) + delta) };
      } else {
        log.push({ date: today, beer: 0, wine: 0, cigs: 0, disco: 0, [cat]: Math.max(0, delta) });
      }

      // Weekly spending
      const monday = getMonday();
      let ws = d.weeklySpending && d.weeklySpending.weekOf === monday
        ? { ...d.weeklySpending }
        : { weekOf: monday, beer: 0, wine: 0, cigs: 0, disco: 0 };
      ws[cat] = Math.max(0, (ws[cat] || 0) + delta);

      return { ...d, money: newMoney, expenseLog: log.slice(-90), weeklySpending: ws };
    });
    if (navigator.vibrate) navigator.vibrate(delta > 0 ? 15 : 8);
  }

  function resetAll() {
    update((d) => ({
      ...d,
      counters: { wine: 0, beer: 0, cigs: 0, ons: 0 },
      countersToday: { wine: 0, beer: 0, cigs: 0, ons: 0 },
      countersDate: new Date().toISOString().split('T')[0],
      money: { beer: 0, wine: 0, cigs: 0, disco: 0 },
      weeklySpending: { weekOf: getMonday(), beer: 0, wine: 0, cigs: 0, disco: 0 },
    }));
    setConfirmOpen(false);
  }

  const total = (data.money.beer || 0) + (data.money.wine || 0) + (data.money.cigs || 0) + (data.money.disco || 0);
  const ws = data.weeklySpending || { beer: 0, wine: 0, cigs: 0, disco: 0 };
  const budgets = data.settings?.weeklyBudgets || { beer: 30, wine: 30, cigs: 20, disco: 50 };
  const today = new Date().toISOString().split('T')[0];
  const todayCounters = data.countersDate === today
    ? (data.countersToday || {})
    : { wine: 0, beer: 0, cigs: 0, ons: 0 };

  return (
    <div className="tab-content active">
      <div className="section-label red">Counters</div>

      <CounterCard icon={<WineIcon />} label="Glasses of Wine" value={data.counters.wine}
        todayValue={todayCounters.wine || 0}
        onInc={() => changeCounter('wine', 1)} onDec={() => changeCounter('wine', -1)} />
      <CounterCard icon={<BeerIcon />} label="Beers" value={data.counters.beer}
        todayValue={todayCounters.beer || 0}
        onInc={() => changeCounter('beer', 1)} onDec={() => changeCounter('beer', -1)} />
      <CounterCard icon={<CigIcon />} label="Cigarettes" value={data.counters.cigs}
        todayValue={todayCounters.cigs || 0}
        onInc={() => changeCounter('cigs', 1)} onDec={() => changeCounter('cigs', -1)} />
      <CounterCard icon={<PeopleIcon />} label="One Night Stands" value={data.counters.ons}
        todayValue={todayCounters.ons || 0}
        onInc={() => changeCounter('ons', 1)} onDec={() => changeCounter('ons', -1)} />

      <div className="section-label red">Expenses</div>

      <ExpenseCard icon={<BeerIcon />} label="Spent on Beer" value={data.money.beer}
        colorClass={getMoneyColor(data.money.beer, 'beer', data.thresholds)}
        onPlus={() => setPicker({ open: true, cat: 'beer', mode: 'add' })}
        onMinus={() => setPicker({ open: true, cat: 'beer', mode: 'sub' })} />
      <ExpenseCard icon={<WineIcon />} label="Spent on Wine" value={data.money.wine}
        colorClass={getMoneyColor(data.money.wine, 'wine', data.thresholds)}
        onPlus={() => setPicker({ open: true, cat: 'wine', mode: 'add' })}
        onMinus={() => setPicker({ open: true, cat: 'wine', mode: 'sub' })} />
      <ExpenseCard icon={<CigPackIcon />} label="Spent on Cigarettes" value={data.money.cigs}
        colorClass={getMoneyColor(data.money.cigs, 'cigs', data.thresholds)}
        onPlus={() => setPicker({ open: true, cat: 'cigs', mode: 'add' })}
        onMinus={() => setPicker({ open: true, cat: 'cigs', mode: 'sub' })} />
      <ExpenseCard icon={<DiscoIcon />} label="Spent on Disco / Clubs" value={data.money.disco}
        colorClass={getMoneyColor(data.money.disco, 'disco', data.thresholds)}
        onPlus={() => setPicker({ open: true, cat: 'disco', mode: 'add' })}
        onMinus={() => setPicker({ open: true, cat: 'disco', mode: 'sub' })} />

      <div className="card total-card">
        <div className="total-label">Total Spent</div>
        <div className="total-value">€{total}</div>
      </div>

      <div className="section-label red">Weekly Budget</div>

      <BudgetBar icon={<BeerIcon color="#E67E22" />} label="Beer" spent={ws.beer || 0} budget={budgets.beer} color="#E67E22" />
      <BudgetBar icon={<WineIcon color="#C0392B" />} label="Wine" spent={ws.wine || 0} budget={budgets.wine} color="#C0392B" />
      <BudgetBar icon={<CigIcon color="#E74C3C" />} label="Cigarettes" spent={ws.cigs || 0} budget={budgets.cigs} color="#E74C3C" />
      <BudgetBar icon={<DiscoIcon color="#9B59B6" />} label="Disco / Clubs" spent={ws.disco || 0} budget={budgets.disco} color="#9B59B6" />

      <div className="reset-section-wrap">
        <button className="reset-section-btn" onClick={() => setConfirmOpen(true)}>Reset Addictions</button>
      </div>

      <AmountPicker open={picker.open} cat={picker.cat} mode={picker.mode}
        onApply={changeMoney} onClose={() => setPicker({ open: false, cat: null, mode: null })} />

      <ConfirmDialog open={confirmOpen} message="This will reset all counters and expenses to zero."
        onConfirm={resetAll} onCancel={() => setConfirmOpen(false)} />
    </div>
  );
}
