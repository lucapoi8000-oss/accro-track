import { useState } from 'react';

const AMOUNTS = [1, 2, 5, 10, 20, 50];
const CAT_NAMES = { beer: 'Beer', wine: 'Wine', cigs: 'Cigarettes', disco: 'Disco' };

export default function AmountPicker({ open, cat, mode, onApply, onClose }) {
  const [customVal, setCustomVal] = useState('');
  if (!open || !cat) return null;

  const isAdd = mode === 'add';

  function apply(amt) {
    onApply(cat, isAdd ? amt : -amt);
    onClose();
  }

  function applyCustom() {
    const val = parseFloat(customVal);
    if (!val || val <= 0) return;
    apply(val);
    setCustomVal('');
  }

  return (
    <div className="picker-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="picker-sheet">
        <div className="picker-header">
          <div className="picker-title">
            {isAdd ? 'Add to ' : 'Subtract from '}
            <span className="picker-cat">{CAT_NAMES[cat]}</span>
          </div>
          <button className="picker-close" onClick={onClose}>&times;</button>
        </div>
        <div className="picker-amounts">
          {AMOUNTS.map((amt) => (
            <button
              key={amt}
              className={`picker-amt-btn ${isAdd ? 'add' : 'sub'}`}
              onClick={() => apply(amt)}
            >
              {isAdd ? '+' : '−'}€{amt}
            </button>
          ))}
        </div>
        <div className="picker-custom">
          <input
            type="number"
            className="picker-custom-input"
            placeholder="Custom amount"
            min="0"
            step="0.5"
            value={customVal}
            onChange={(e) => setCustomVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyCustom()}
          />
          <button
            className={`picker-custom-btn ${isAdd ? 'add' : 'sub'}`}
            onClick={applyCustom}
          >
            {isAdd ? '+' : '−'}
          </button>
        </div>
      </div>
    </div>
  );
}
