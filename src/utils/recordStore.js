export const RECORD_STORAGE_KEY = 'coffee_history';

const loadAll = () => {
  try {
    const records = JSON.parse(localStorage.getItem(RECORD_STORAGE_KEY) || '[]');
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
};

const saveAll = (records) => {
  localStorage.setItem(RECORD_STORAGE_KEY, JSON.stringify(records));
};

export const initRecordStore = async () => null;

export const getAllRecords = async () => {
  return loadAll()
    .filter(record => record.isActive !== false)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const saveRecord = async (record) => {
  const records = loadAll();
  const existingIndex = records.findIndex(item => item.id === record.id);

  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }

  saveAll(records);
};

export const deleteRecord = async (id) => {
  const records = loadAll();
  const existingRecord = records.find(record => record.id === id);

  if (!existingRecord) return;

  existingRecord.isActive = false;
  existingRecord.updatedAt = new Date().toISOString();
  saveAll(records);
};

export const clearAllRecords = async () => {
  localStorage.removeItem(RECORD_STORAGE_KEY);
};

export const getStorageQuota = async () => {
  const rawRecords = localStorage.getItem(RECORD_STORAGE_KEY) || '';
  const bytes = new Blob([rawRecords]).size;
  const usageMB = (bytes / 1024 / 1024).toFixed(2);
  const quotaBytes = 5 * 1024 * 1024;

  return {
    usageMB,
    quotaMB: '5.00',
    percentage: ((bytes / quotaBytes) * 100).toFixed(1)
  };
};

export const migrateFromLocalStorage = async () => {
  // User records are already stored under RECORD_STORAGE_KEY.
};

export const getFlavorTaxonomy = async () => [];
