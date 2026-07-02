export type ApplicationSubmitCostResult = {
  submitCost: number;
  standardCost: number;
  discountLabel: string | null;
};

/**
 * Стоимость публикации: бесплатная первая история только на 1 уровне.
 */
export function resolveApplicationSubmitCost(params: {
  userLevel: number;
  priorApplicationCount: number;
  baseCost: number;
}): ApplicationSubmitCostResult {
  const { userLevel, priorApplicationCount, baseCost } = params;

  if (userLevel === 1 && priorApplicationCount === 0) {
    return { submitCost: 0, standardCost: baseCost, discountLabel: null };
  }

  return { submitCost: baseCost, standardCost: baseCost, discountLabel: null };
}

/** Текст стоимости публикации со 2-й истории для текущего уровня */
export function formatPublicationCostByLevelPerk(applicationCost: number): string {
  return `Со 2-й истории — публикация: ${applicationCost} бон.`;
}

export function formatPublicationCostDecreasePerk(
  applicationCost: number,
  previousCost: number,
  previousLevel: number,
): string {
  return `Публикация за ${applicationCost} бон. (на ${previousLevel} ур. — ${previousCost})`;
}

/** Пример суммы для иллюстрации поля «Желаемая сумма» */
export function getDesiredAmountExample(maxApplicationAmount: number): number {
  return Math.round(maxApplicationAmount * 1.75);
}

/** Перк и подсказка: желаемая сумма выше лимита уровня */
export function formatDesiredAmountPerk(maxApplicationAmount: number): string {
  const exampleAmount = getDesiredAmountExample(maxApplicationAmount);
  return `Поле «Желаемая сумма»: лимит ${maxApplicationAmount} ₽, но можно попросить ${exampleAmount} ₽ — модератор решит`;
}

/** Короткая подсказка для формы заявки */
export function formatDesiredAmountFieldHint(maxApplicationAmount: number): string {
  const exampleAmount = getDesiredAmountExample(maxApplicationAmount);
  return `Лимит ${maxApplicationAmount} ₽, но можно попросить ${exampleAmount} ₽ — модератор решит. Одобрение не гарантировано.`;
}
