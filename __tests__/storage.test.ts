import {
  saveHistoryItem,
  getHistory,
  getHistoryItemById,
  deleteHistoryItem,
  clearAllHistory,
} from '../src/services/storage/historyStorage';
import { AnalysisResult } from '../src/types';

describe('historyStorage', () => {
  beforeEach(async () => {
    await clearAllHistory();
  });

  const createMockResult = (id: string, score: number): AnalysisResult => ({
    id,
    type: 'url',
    inputPreview: 'https://example.com/' + id,
    score,
    level: score > 50 ? 'high' : 'safe-indicative',
    summary: 'Summary ' + id,
    indicators: [],
    recommendations: ['Rekomendasi 1'],
    sources: ['Uji Coba'],
    isDemo: true,
    createdAt: new Date().toISOString(),
  });

  it('should save and retrieve history items', async () => {
    const item1 = createMockResult('item_1', 10);
    const item2 = createMockResult('item_2', 80);

    await saveHistoryItem(item1);
    await saveHistoryItem(item2);

    const history = await getHistory();
    expect(history.length).toBe(2);
    expect(history[0].id).toBe('item_2'); // Newest first
    expect(history[1].id).toBe('item_1');
  });

  it('should find history item by id', async () => {
    const item = createMockResult('find_me', 65);
    await saveHistoryItem(item);

    const found = await getHistoryItemById('find_me');
    expect(found).not.toBeNull();
    expect(found?.id).toBe('find_me');

    const notFound = await getHistoryItemById('non_existent');
    expect(notFound).toBeNull();
  });

  it('should delete a single history item', async () => {
    await saveHistoryItem(createMockResult('del_1', 20));
    await saveHistoryItem(createMockResult('del_2', 70));

    await deleteHistoryItem('del_1');

    const history = await getHistory();
    expect(history.length).toBe(1);
    expect(history[0].id).toBe('del_2');
  });

  it('should clear all history items', async () => {
    await saveHistoryItem(createMockResult('c1', 10));
    await saveHistoryItem(createMockResult('c2', 20));

    await clearAllHistory();

    const history = await getHistory();
    expect(history).toEqual([]);
  });

  it('should cap history items to MAX_HISTORY_ITEMS (100)', async () => {
    for (let i = 0; i < 105; i++) {
      await saveHistoryItem(createMockResult(`cap_${i}`, i % 100));
    }

    const history = await getHistory();
    expect(history.length).toBe(100);
    expect(history[0].id).toBe('cap_104');
  });
});
