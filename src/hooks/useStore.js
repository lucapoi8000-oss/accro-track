import { useState, useCallback } from 'react';

const STORE_KEY = 'accro_track_data';

function defaultStore() {
  return {
    counters: { wine: 0, beer: 0, cigs: 0, ons: 0 },
    money: { beer: 0, wine: 0, cigs: 0, disco: 0 },
    streaks: {
      nofap: { count: 0, history: [] },
      nohang: { count: 0, history: [] },
    },
    bucket: [],
    settings: { beerPrice: 4.5, winePrice: 4.5, userName: 'Lorenzo Aloe' },
    thresholds: {
      beer: { yellow: 20, red: 50 },
      wine: { yellow: 20, red: 50 },
      cigs: { yellow: 15, red: 40 },
      disco: { yellow: 30, red: 80 },
    },
    expenseLog: [],
  };
}

function loadStore() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    const def = defaultStore();
    return {
      ...def,
      ...raw,
      settings: { ...def.settings, ...(raw.settings || {}) },
      thresholds: { ...def.thresholds, ...(raw.thresholds || {}) },
      money: { ...def.money, ...(raw.money || {}) },
      counters: { ...def.counters, ...(raw.counters || {}) },
      streaks: {
        nofap: { ...def.streaks.nofap, ...((raw.streaks || {}).nofap || {}) },
        nohang: { ...def.streaks.nohang, ...((raw.streaks || {}).nohang || {}) },
      },
      bucket: raw.bucket || [],
      expenseLog: raw.expenseLog || [],
    };
  } catch {
    return defaultStore();
  }
}

export function useStore() {
  const [data, setData] = useState(loadStore);

  const update = useCallback((updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return [data, update];
}

export { defaultStore };
