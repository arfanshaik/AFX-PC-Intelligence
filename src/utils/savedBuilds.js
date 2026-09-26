const KEY = 'afx-saved-builds';
const LIMIT = 12;
const sessionData = new Map();
const sessionStorage = {getItem:key=>sessionData.get(key)??null,setItem:(key,value)=>sessionData.set(key,value)};
let selectedStorage;

function browserStorage() {
  if (selectedStorage) return selectedStorage;
  try {
    if (globalThis.__AFX_INLINE_PREVIEW__) return selectedStorage=sessionStorage;
    const storage=globalThis.localStorage;
    if (!storage) return selectedStorage=sessionStorage;
    storage.setItem('afx-storage-test','1');storage.removeItem('afx-storage-test');
    return selectedStorage=storage;
  } catch { return selectedStorage=sessionStorage; }
}
export const savedBuildStorageMode=()=>browserStorage()===sessionStorage?'session':'device';

function isSavedBuild(value) {
  return value && typeof value.id === 'string' && typeof value.name === 'string' &&
    value.build && typeof value.build === 'object' && Number.isFinite(Number(value.total));
}

export function loadSavedBuilds(storage = browserStorage()) {
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage.getItem(KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(isSavedBuild).slice(0, LIMIT) : [];
  } catch {
    return [];
  }
}

export function saveBuild({build, total, budget, purpose}, storage = browserStorage()) {
  if (!storage || !build || !Number.isFinite(Number(total))) return null;
  const savedAt = new Date().toISOString();
  const name = `${purpose || 'PC'} build · ₹${Number(budget || total).toLocaleString('en-IN')}`;
  const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const item = {id, name, savedAt, build, total:Number(total), budget:Number(budget || total), purpose:purpose || 'Gaming'};
  try {
    storage.setItem(KEY, JSON.stringify([item, ...loadSavedBuilds(storage)].slice(0, LIMIT)));
    return item;
  } catch {
    return null;
  }
}

export function deleteSavedBuild(id, storage = browserStorage()) {
  if (!storage || typeof id !== 'string') return false;
  try {
    const next = loadSavedBuilds(storage).filter(item => item.id !== id);
    storage.setItem(KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}
