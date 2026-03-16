import { BeerIcon, WineIcon, CigIcon, DiscoIcon } from './icons';

function ThresholdCard({ icon, name, yellowVal, redVal, onYellowChange, onRedChange }) {
  return (
    <div className="settings-card">
      <div className="settings-cat-header">
        {icon}
        <span className="settings-cat-name">{name}</span>
      </div>
      <div className="threshold-row">
        <div className="threshold-dot" style={{ background: '#F1C40F' }} />
        <span className="threshold-label">Warning at</span>
        <input type="number" className="threshold-input" min="0" value={yellowVal}
          onChange={(e) => onYellowChange(parseFloat(e.target.value) || 0)} />
        <span className="settings-unit">€</span>
      </div>
      <div className="threshold-row">
        <div className="threshold-dot" style={{ background: '#E74C3C' }} />
        <span className="threshold-label">Danger at</span>
        <input type="number" className="threshold-input" min="0" value={redVal}
          onChange={(e) => onRedChange(parseFloat(e.target.value) || 0)} />
        <span className="settings-unit">€</span>
      </div>
    </div>
  );
}

export default function SettingsTab({ data, update }) {
  function set(path, value) {
    update((d) => {
      const next = JSON.parse(JSON.stringify(d));
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accro-track-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const budgets = data.settings?.weeklyBudgets || { beer: 30, wine: 30, cigs: 20, disco: 50 };

  return (
    <div className="tab-content active">
      <div className="section-label" style={{ color: '#AAA' }}>Profile</div>

      <div className="settings-card">
        <div className="settings-row">
          <span className="settings-row-label">Your Name</span>
          <input type="text" className="settings-input wide" style={{ width: 160 }}
            placeholder="Your name" value={data.settings.userName || ''}
            onChange={(e) => set('settings.userName', e.target.value)} />
        </div>
      </div>

      <div className="section-label" style={{ color: '#AAA' }}>Expense Thresholds</div>
      <p style={{ fontSize: 12, color: '#555', marginBottom: 12 }}>
        Set when amounts turn yellow (warning) and red (danger).
      </p>

      <ThresholdCard icon={<BeerIcon color="#E67E22" />} name="Beer"
        yellowVal={data.thresholds.beer.yellow} redVal={data.thresholds.beer.red}
        onYellowChange={(v) => set('thresholds.beer.yellow', v)}
        onRedChange={(v) => set('thresholds.beer.red', v)} />

      <ThresholdCard icon={<WineIcon color="#C0392B" />} name="Wine"
        yellowVal={data.thresholds.wine.yellow} redVal={data.thresholds.wine.red}
        onYellowChange={(v) => set('thresholds.wine.yellow', v)}
        onRedChange={(v) => set('thresholds.wine.red', v)} />

      <ThresholdCard icon={<CigIcon color="#E74C3C" />} name="Cigarettes"
        yellowVal={data.thresholds.cigs.yellow} redVal={data.thresholds.cigs.red}
        onYellowChange={(v) => set('thresholds.cigs.yellow', v)}
        onRedChange={(v) => set('thresholds.cigs.red', v)} />

      <ThresholdCard icon={<DiscoIcon color="#9B59B6" />} name="Disco / Clubs"
        yellowVal={data.thresholds.disco.yellow} redVal={data.thresholds.disco.red}
        onYellowChange={(v) => set('thresholds.disco.yellow', v)}
        onRedChange={(v) => set('thresholds.disco.red', v)} />

      <div className="section-label" style={{ color: '#AAA' }}>Weekly Budgets</div>
      <p style={{ fontSize: 12, color: '#555', marginBottom: 12 }}>
        Set your weekly spending limits per category.
      </p>

      <div className="settings-card">
        <div className="settings-row" style={{ marginBottom: 12 }}>
          <BeerIcon color="#E67E22" />
          <span className="settings-row-label">Beer</span>
          <input type="number" className="settings-input" min="0" step="5"
            value={budgets.beer}
            onChange={(e) => set('settings.weeklyBudgets.beer', parseFloat(e.target.value) || 0)} />
          <span className="settings-unit">€</span>
        </div>
        <div className="settings-row" style={{ marginBottom: 12 }}>
          <WineIcon color="#C0392B" />
          <span className="settings-row-label">Wine</span>
          <input type="number" className="settings-input" min="0" step="5"
            value={budgets.wine}
            onChange={(e) => set('settings.weeklyBudgets.wine', parseFloat(e.target.value) || 0)} />
          <span className="settings-unit">€</span>
        </div>
        <div className="settings-row" style={{ marginBottom: 12 }}>
          <CigIcon color="#E74C3C" />
          <span className="settings-row-label">Cigarettes</span>
          <input type="number" className="settings-input" min="0" step="5"
            value={budgets.cigs}
            onChange={(e) => set('settings.weeklyBudgets.cigs', parseFloat(e.target.value) || 0)} />
          <span className="settings-unit">€</span>
        </div>
        <div className="settings-row">
          <DiscoIcon color="#9B59B6" />
          <span className="settings-row-label">Disco / Clubs</span>
          <input type="number" className="settings-input" min="0" step="5"
            value={budgets.disco}
            onChange={(e) => set('settings.weeklyBudgets.disco', parseFloat(e.target.value) || 0)} />
          <span className="settings-unit">€</span>
        </div>
      </div>

      <div className="section-label" style={{ color: '#AAA' }}>Bucket List Prices</div>

      <div className="settings-card">
        <div className="settings-row">
          <span className="settings-row-label">Beer price</span>
          <input type="number" className="settings-input" min="0.1" step="0.1"
            value={data.settings.beerPrice}
            onChange={(e) => set('settings.beerPrice', parseFloat(e.target.value) || 0)} />
          <span className="settings-unit">€</span>
        </div>
      </div>
      <div className="settings-card">
        <div className="settings-row">
          <span className="settings-row-label">Wine price</span>
          <input type="number" className="settings-input" min="0.1" step="0.1"
            value={data.settings.winePrice}
            onChange={(e) => set('settings.winePrice', parseFloat(e.target.value) || 0)} />
          <span className="settings-unit">€</span>
        </div>
      </div>

      <div className="section-label" style={{ color: '#AAA' }}>Data</div>

      <div className="settings-card">
        <button className="export-btn" onClick={exportData}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, verticalAlign: -2 }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export Data as JSON
        </button>
      </div>

      <div className="about-block">
        <div className="about-logo">Accro <span>Track</span><span className="about-tm">™</span></div>
        <div className="about-author">by Lorenzo Aloe</div>
        <div className="about-version">Version 1.1</div>
      </div>
    </div>
  );
}
