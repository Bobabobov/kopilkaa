export type AdminNavItem = {
  href: string;
  label: string;
  /** Ключ счётчика из AdminDashboardCounts */
  badgeKey?:
    | 'applicationsPending'
    | 'feedbackNew'
    | 'goodDeedsPending'
    | 'withdrawalsPending'
    | 'adRequestsNew';
  matchNested?: boolean;
};

export type AdminNavGroup = {
  id: string;
  label: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    id: 'queue',
    label: 'Очередь',
    items: [
      {
        href: '/admin/applications',
        label: 'Заявки',
        badgeKey: 'applicationsPending',
        matchNested: true,
      },
      {
        href: '/admin/feedback',
        label: 'Отзывы',
        badgeKey: 'feedbackNew',
        matchNested: true,
      },
    ],
  },
  {
    id: 'people',
    label: 'Люди',
    items: [
      { href: '/admin/users', label: 'Пользователи', matchNested: true },
      { href: '/admin/referrals', label: 'Рефералы', matchNested: true },
    ],
  },
  {
    id: 'good-deeds',
    label: 'Добрые дела',
    items: [
      {
        href: '/admin/good-deeds',
        label: 'Добрые дела',
        badgeKey: 'goodDeedsPending',
        matchNested: true,
      },
    ],
  },
  {
    id: 'money',
    label: 'Деньги',
    items: [
      {
        href: '/admin/bonuses',
        label: 'Бонусы',
        badgeKey: 'withdrawalsPending',
        matchNested: true,
      },
      { href: '/admin/balance', label: 'Баланс копилки' },
    ],
  },
  {
    id: 'content',
    label: 'Контент',
    items: [
      {
        href: '/admin/ads',
        label: 'Реклама',
        badgeKey: 'adRequestsNew',
        matchNested: true,
      },
      { href: '/admin/heroes', label: 'Герои' },
    ],
  },
];

export function isAdminNavItemActive(
  pathname: string,
  item: AdminNavItem,
): boolean {
  if (item.href === '/admin/applications') {
    return (
      pathname === '/admin/applications' ||
      pathname.startsWith('/admin/applications/')
    );
  }
  if (item.matchNested) {
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }
  return pathname === item.href;
}
