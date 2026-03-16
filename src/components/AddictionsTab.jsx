import { useState, useRef } from 'react';
import { WineIcon, BeerIcon, CigIcon, PeopleIcon, CigPackIcon, DiscoIcon } from './icons';
import AmountPicker from './AmountPicker';
import ConfirmDialog from './ConfirmDialog';

function CounterCard({ icon, label, value, onInc, onDec }) {
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

export default function AddictionsTab({ data, update }) {
  const [picker, setPicker] = useState({ open: false, cat: null, mode: null });
  const [confirmOpen, setConfirmOpen] = useState(false);

  function changeCounter(key, delta) {
    update((d) => ({
      ...d,
      counters: { ...d.counters, [key]: Math.max(0, (d.counters[key] || 0) + delta) },
    }));
    if (navigator.vibrate) navigator.vibrate(delta > 0 ? 15 : 8);
  }

  function changeMoney(cat, delta) {
    update((d) => {
      const newMoney = { ...d.money, [cat]: Math.max(0, Math.round(((d.money[cat] || 0) + delta) * 100) / 100) };
      const today = new Date().toISOString().split('T')[0];
      const log = [...d.expenseLog];
      const idx = log.findIndex((e) => e.date === today);
      const entry = { date: today, beer: newMoney.beer, wine: newMoney.wine, cigs: newMoney.cigs, disco: newMoney.disco };
      if (idx >= 0) log[idx] = entry;
      else log.push(entry);
      return { ...d, money: newMoney, expenseLog: log.slice(-90) };
    });
    if (navigator.vibrate) navigator.vibrate(delta > 0 ? 15 : 8);
  }

  function resetAll() {
    update((d) => ({
      ...d,
      counters: { wine: 0, beer: 0, cigs: 0, ons: 0 },
      money: { beer: 0, wine: 0, cigs: 0, disco: 0 },
    }));
    setConfirmOpen(false);
  }

  const total = (data.money.beer || 0) + (data.money.wine || 0) + (data.money.cigs || 0) + (data.money.disco || 0);

  return (
    <div className="tab-content active">
      <div className="section-label red">Counters</div>

      <CounterCard icon={<WineIcon />} label="Glasses of Wine" value={data.counters.wine}
        onInc={() => changeCounter('wine', 1)} onDec={() => changeCounter('wine', -1)} />
      <CounterCard icon={<BeerIcon />} label="Beers" value={data.counters.beer}
        onInc={() => changeCounter('beer', 1)} onDec={() => changeCounter('beer', -1)} />
      <CounterCard icon={<CigIcon />} label="Cigarettes" value={data.counters.cigs}
        onInc={() => changeCounter('cigs', 1)} onDec={() => changeCounter('cigs', -1)} />
      <CounterCard icon={<PeopleIcon />} label="One Night Stands" value={data.counters.ons}
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
