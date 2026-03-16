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
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }

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

      <div className="section-label" style={{ color: '#AAA' }}>Bucket List Prices</div>

      <div className="settings-card">
        <div className="settings-row">
          <span className="settings-row-label">Beer price</span>
          <input type="number" className="settings-input" min="0.1" step="0.1"
            value={data.settings.beerPrice}
            onChange={(e) => set('settings.beerPrice', parseFloat(e.target.value) || 4.5)} />
          <span className="settings-unit">€</span>
        </div>
      </div>
      <div className="settings-card">
        <div className="settings-row">
          <span className="settings-row-label">Wine price</span>
          <input type="number" className="settings-input" min="0.1" step="0.1"
            value={data.settings.winePrice}
            onChange={(e) => set('settings.winePrice', parseFloat(e.target.value) || 4.5)} />
          <span className="settings-unit">€</span>
        </div>
      </div>

      <div className="about-block">
        <div className="about-logo">Accro <span>Track</span><span className="about-tm">™</span></div>
        <div className="about-author">by Lorenzo Aloe</div>
        <div className="about-version">Version 1.0</div>
      </div>
    </div>
  );
}
