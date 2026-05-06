import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearAllRecords,
  deleteRecord,
  getAllRecords,
  saveRecord
} from '../src/utils/recordStore.js';

const createStorageMock = () => {
  let store = {};

  return {
    getItem: vi.fn((key) => (key in store ? store[key] : null)),
    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
};

beforeEach(() => {
  global.localStorage = createStorageMock();
});

describe('recordStore', () => {
  it('saves and returns active records sorted by date descending', async () => {
    await saveRecord({ id: '1', date: '2026-05-01', isActive: true, coffeeName: 'A' });
    await saveRecord({ id: '2', date: '2026-05-03', isActive: true, coffeeName: 'B' });
    await saveRecord({ id: '3', date: '2026-05-02', isActive: false, coffeeName: 'C' });

    const records = await getAllRecords();

    expect(records.map((record) => record.id)).toEqual(['2', '1']);
  });

  it('updates an existing record instead of duplicating it', async () => {
    await saveRecord({ id: '1', date: '2026-05-01', isActive: true, coffeeName: 'First' });
    await saveRecord({ id: '1', date: '2026-05-01', isActive: true, coffeeName: 'Updated' });

    const records = await getAllRecords();

    expect(records).toHaveLength(1);
    expect(records[0].coffeeName).toBe('Updated');
  });

  it('soft deletes a record', async () => {
    await saveRecord({ id: '1', date: '2026-05-01', isActive: true, coffeeName: 'A' });

    await deleteRecord('1');

    const records = await getAllRecords();
    expect(records).toEqual([]);
  });

  it('clears all records', async () => {
    await saveRecord({ id: '1', date: '2026-05-01', isActive: true, coffeeName: 'A' });

    await clearAllRecords();

    const records = await getAllRecords();
    expect(records).toEqual([]);
  });
});
