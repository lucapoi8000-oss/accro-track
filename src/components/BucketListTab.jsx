import { useState } from 'react';
import { BeerIcon, WineIcon } from './icons';
import ConfirmDialog from './ConfirmDialog';

export default function BucketListTab({ data, update }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const bp = data.settings.beerPrice || 4.5;
  const wp = data.settings.winePrice || 4.5;

  function addItem() {
    const trimmed = name.trim();
    if (!trimmed) return;
    update((d) => ({
      ...d,
      bucket: [...d.bucket, { name: trimmed, price: parseFloat(price) || 0, done: false, id: Date.now() }],
    }));
    setName('');
    setPrice('');
    if (navigator.vibrate) navigator.vibrate(15);
  }

  function toggleItem(id) {
    update((d) => ({
      ...d,
      bucket: d.bucket.map((b) => (b.id === id ? { ...b, done: !b.done } : b)),
    }));
  }

  function deleteItem(id) {
    update((d) => ({ ...d, bucket: d.bucket.filter((b) => b.id !== id) }));
  }

  function clearAll() {
    update((d) => ({ ...d, bucket: [] }));
    setConfirmOpen(false);
  }

  return (
    <div className="tab-content active">
      <div className="section-label" style={{ color: '#3498DB' }}>Bucket List</div>

      <div className="bucket-form">
        <input type="text" className="bucket-input" placeholder="Item name..." value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && document.getElementById('bucket-price-input').focus()} />
        <input type="number" className="bucket-input bucket-input-price" id="bucket-price-input"
          placeholder="€ Price" min="0" step="0.01" value={price}
          onChange={(e) => setPrice(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()} />
        <button className="bucket-add-btn" onClick={addItem}>+</button>
      </div>

      <div>
        {data.bucket.length === 0 ? (
          <div className="bucket-empty">No items yet. Add something you want!</div>
        ) : (
          data.bucket.map((item) => {
            const beers = item.price > 0 ? Math.round(item.price / bp) : 0;
            const wines = item.price > 0 ? Math.round(item.price / wp) : 0;
            return (
              <div key={item.id} className={`bucket-item${item.done ? ' done' : ''}`}>
                <div className="bucket-item-top">
                  <button className={`bucket-check${item.done ? ' checked' : ''}`} onClick={() => toggleItem(item.id)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                  <span className="bucket-item-name">{item.name}</span>
                  <span style={{ color: '#3498DB', fontWeight: 700, fontSize: 15 }}>€{item.price.toFixed(2)}</span>
                  <button className="bucket-delete" onClick={() => deleteItem(item.id)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className="bucket-equiv">
                  <span className="equiv-tag">
                    <BeerIcon color="#C0392B" />
                    <span className="equiv-num">{beers}</span> beers
                  </span>
                  <span className="equiv-tag">
                    <WineIcon color="#C0392B" />
                    <span className="equiv-num">{wines}</span> wines
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="reset-section-wrap">
        <button className="reset-section-btn" onClick={() => setConfirmOpen(true)}>Clear Bucket List</button>
      </div>

      <ConfirmDialog open={confirmOpen} message="This will delete all bucket list items."
        onConfirm={clearAll} onCancel={() => setConfirmOpen(false)} />
    </div>
  );
}
