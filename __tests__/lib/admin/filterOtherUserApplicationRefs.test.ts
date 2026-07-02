import { describe, expect, it } from 'vitest';

import {
  countOtherUserApplicationRefs,
  filterOtherUserApplicationRefs,
} from '@/lib/admin/filterOtherUserApplicationRefs';

describe('filterOtherUserApplicationRefs', () => {
  const refs = [
    {
      id: 'a1',
      createdAt: '2026-01-01',
      user: { id: 'u1', email: 'a@test', name: 'A' },
    },
    {
      id: 'a2',
      createdAt: '2026-01-02',
      user: { id: 'u2', email: 'b@test', name: 'B' },
    },
  ];

  it('должно исключить заявки текущего автора', () => {
    expect(filterOtherUserApplicationRefs(refs, 'u1')).toHaveLength(1);
    expect(filterOtherUserApplicationRefs(refs, 'u1')[0]?.user.id).toBe('u2');
    expect(countOtherUserApplicationRefs(refs, 'u1')).toBe(1);
    expect(countOtherUserApplicationRefs(refs, 'u2')).toBe(1);
  });
});
