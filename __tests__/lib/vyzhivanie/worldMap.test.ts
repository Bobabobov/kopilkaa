import { describe, expect, it } from 'vitest';
import {
  getGraveNickname,
  layoutGraveScattered,
} from '@/lib/vyzhivanie/graveyard';

describe('graveyard layout', () => {
  it('должно раскладывать могилы в разные позиции', () => {
    const first = layoutGraveScattered(0);
    const second = layoutGraveScattered(1);

    expect(first.x).not.toBe(second.x);
    expect(first.y).toBeGreaterThan(0);
    expect(second.y).toBeGreaterThan(0);
  });

  it('должно выбирать имя, иначе username', () => {
    expect(getGraveNickname({ username: 'ghost', name: 'Имя' })).toBe('Имя');
    expect(getGraveNickname({ username: 'ghost', name: null })).toBe('ghost');
    expect(getGraveNickname({ username: null, name: null })).toBe('Игрок');
  });
});
