import { describe, expect, it } from 'vitest';
import {
  formatCooldownIntervalLabel,
  formatCooldownRemaining,
  formatMaxAmountError,
  getApplicationCost,
  getApplicationCooldownHours,
  getLevelRules,
  getMaxApplicationAmount,
  getNextMeaningfulLevel,
  getLevelMilestoneDetails,
  resolveTierLevel,
  showsDesiredAmountField,
} from '@/lib/level-config';
import { getApplicationSubmitButtonLabel } from '@/lib/applications/applicationEconomy';

describe('level-config', () => {
  it('должен вернуть лимит 150 ₽ для уровня 1', () => {
    expect(getMaxApplicationAmount(1)).toBe(150);
  });

  it('должен использовать правила уровня 5 для уровней 6–9', () => {
    expect(getMaxApplicationAmount(7)).toBe(300);
    expect(getApplicationCost(8)).toBe(25);
    expect(getApplicationCooldownHours(9)).toBe(24);
    expect(resolveTierLevel(7)).toBe(5);
  });

  it('должен вернуть стоимость публикации по уровням 1–5', () => {
    expect(getApplicationCost(1)).toBe(50);
    expect(getApplicationCost(2)).toBe(40);
    expect(getApplicationCost(3)).toBe(35);
    expect(getApplicationCost(4)).toBe(30);
    expect(getApplicationCost(5)).toBe(25);
    expect(getApplicationCost(9)).toBe(25);
  });

  it('должен использовать правила уровня 10 для уровней 11–14', () => {
    expect(getMaxApplicationAmount(12)).toBe(400);
    expect(getApplicationCost(13)).toBe(70);
    expect(getApplicationCooldownHours(14)).toBe(48);
  });

  it('должен ограничивать уровень 20+ лимитом 500 ₽', () => {
    const rules = getLevelRules(22);
    expect(rules.maxApplicationAmount).toBe(500);
    expect(rules.inDevelopment).toBe(true);
  });

  it('должен вернуть следующий значимый уровень только до 5', () => {
    expect(getNextMeaningfulLevel(4)).toBe(5);
    expect(getNextMeaningfulLevel(5)).toBeNull();
    expect(getNextMeaningfulLevel(15)).toBeNull();
  });

  it('должен помечать вехи 10 и 15 как в разработке', () => {
    expect(getLevelRules(10).inDevelopment).toBe(true);
    expect(getLevelRules(15).inDevelopment).toBe(true);
    expect(getLevelRules(5).inDevelopment).toBe(false);
  });

  it('должен форматировать интервал кулдауна', () => {
    expect(formatCooldownIntervalLabel(24)).toBe('1 раз в сутки');
    expect(formatCooldownIntervalLabel(48)).toBe('раз в 2 суток');
    expect(formatCooldownIntervalLabel(72)).toBe('раз в 3 суток');
  });

  it('должен форматировать оставшееся время кулдауна', () => {
    expect(formatCooldownRemaining(90 * 60_000)).toBe('1 ч. 30 мин.');
  });

  it('должен показывать желаемую сумму с 2-го уровня', () => {
    expect(showsDesiredAmountField(1)).toBe(false);
    expect(showsDesiredAmountField(2)).toBe(true);
    expect(showsDesiredAmountField(10)).toBe(true);
  });

  it('должен форматировать ошибку лимита суммы', () => {
    expect(formatMaxAmountError(150)).toBe(
      'На вашем уровне доступен гонорар до 150 ₽.',
    );
  });

  it('должен включить бесплатную первую историю в перки уровня 1', () => {
    const levelOne = getLevelMilestoneDetails().find((item) => item.level === 1);
    expect(levelOne?.newPerks[0]).toBe('Первая история — бесплатно');
    expect(levelOne?.hints).toHaveLength(2);
    expect(levelOne?.quest?.targetBonuses).toBe(50);
    expect(levelOne?.newPerks[2]).toBe('Со 2-й истории — публикация: 50 бон.');
  });

  it('должен описать гибкую публикацию и скидку на уровне 2', () => {
    const levelTwo = getLevelMilestoneDetails().find((item) => item.level === 2);
    expect(levelTwo?.newPerks[0]).toBe(
      'Поле «Желаемая сумма»: лимит 200 ₽, но можно попросить 350 ₽ — модератор решит',
    );
    expect(levelTwo?.newPerks[1]).toBe('Публикация за 40 бон. (на 1 ур. — 50)');
    expect(levelTwo?.upcomingHighlight).toBe('На 3 уровне — вывод гонорара');
  });

  it('должен описать вывод на СБП и обучение на уровне 3', () => {
    const levelThree = getLevelMilestoneDetails().find(
      (item) => item.level === 3,
    );
    expect(levelThree?.newPerks[0]).toBe(
      'Вывод бонусов от 100 бон. · комиссия 10%',
    );
    expect(levelThree?.newPerks[1]).toBe(
      '+15 бон. на баланс при достижении 3 уровня',
    );
    expect(levelThree?.newPerks[2]).toBe(
      'Подарок +30 бон. после первого вывода — заберите в профиле',
    );
    expect(levelThree?.education?.title).toBe(
      'Вложить в уровень или вывести?',
    );
    expect(levelThree?.education?.items).toHaveLength(2);
    expect(levelThree?.education?.items[1].description).toContain('Комиссия 10%');
  });

  it('должен описать максимальный активный уровень на 5', () => {
    const levelFive = getLevelMilestoneDetails().find((item) => item.level === 5);
    expect(levelFive?.newPerks).toContain(
      'Максимальный активный уровень — дальше в разработке',
    );
  });

  it('должен показать снижение комиссии на уровне 4', () => {
    const levelFour = getLevelMilestoneDetails().find((item) => item.level === 4);
    expect(levelFour?.newPerks[1]).toBe(
      'Комиссия на вывод: 8% (на 3 уровне — 10%)',
    );
  });

  it('должен вернуть текст кнопки отправки', () => {
    expect(getApplicationSubmitButtonLabel({ submitCost: 0 })).toBe(
      'Отправить (бесплатно)',
    );
    expect(getApplicationSubmitButtonLabel({ submitCost: 30 })).toBe(
      'Отправить за 30 бонусов',
    );
    expect(
      getApplicationSubmitButtonLabel({ submitCost: 100, isAdmin: true }),
    ).toBe('Отправить историю');
  });
});
