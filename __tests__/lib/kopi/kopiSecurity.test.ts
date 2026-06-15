import { describe, expect, it } from 'vitest';
import {
  KOPI_MAX_QUERY_LENGTH,
  isAllowedKopiExternalUrl,
  isAllowedKopiRoute,
  sanitizeKopiExternalLink,
  sanitizeKopiNavigateTarget,
  sanitizeKopiUserQuery,
} from '@/lib/kopi/kopiSecurity';
import { KOPI_TELEGRAM_GROUP_URL } from '@/lib/kopi/kopiScenarios';

describe('sanitizeKopiUserQuery', () => {
  it('должно обрезать слишком длинный вопрос', () => {
    const long = 'а'.repeat(KOPI_MAX_QUERY_LENGTH + 50);
    expect(sanitizeKopiUserQuery(long)).toHaveLength(KOPI_MAX_QUERY_LENGTH);
  });

  it('должно убирать пробелы по краям', () => {
    expect(sanitizeKopiUserQuery('  заявка  ')).toBe('заявка');
  });
});

describe('isAllowedKopiRoute', () => {
  it('должно разрешать маршруты экскурсии и навигации', () => {
    expect(isAllowedKopiRoute('/applications')).toBe(true);
    expect(isAllowedKopiRoute('/profile/referrals')).toBe(true);
  });

  it('должно запрещать админку и произвольные пути', () => {
    expect(isAllowedKopiRoute('/admin')).toBe(false);
    expect(isAllowedKopiRoute('https://evil.example')).toBe(false);
  });
});

describe('isAllowedKopiExternalUrl', () => {
  it('должно разрешать только whitelist Telegram', () => {
    expect(isAllowedKopiExternalUrl(KOPI_TELEGRAM_GROUP_URL)).toBe(true);
  });

  it('должно отклонять javascript: и посторонние HTTPS', () => {
    expect(isAllowedKopiExternalUrl('javascript:alert(1)')).toBe(false);
    expect(isAllowedKopiExternalUrl('https://evil.example')).toBe(false);
    expect(isAllowedKopiExternalUrl('http://t.me/test')).toBe(false);
  });
});

describe('sanitizeKopiExternalLink', () => {
  it('должно вернуть null для неразрешённой ссылки', () => {
    expect(
      sanitizeKopiExternalLink({
        href: 'https://phishing.example',
        label: 'Клик',
      }),
    ).toBeNull();
  });
});

describe('sanitizeKopiNavigateTarget', () => {
  it('должно отфильтровать неразрешённый маршрут', () => {
    expect(
      sanitizeKopiNavigateTarget('/admin/users' as '/admin', 'Админка'),
    ).toBeNull();
  });
});
