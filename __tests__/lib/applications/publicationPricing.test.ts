import { describe, expect, it } from 'vitest';

import {
  formatDesiredAmountFieldHint,
  formatDesiredAmountPerk,
  resolveApplicationSubmitCost,
} from '@/lib/applications/publicationPricing';

import { buildApplicationEligibility } from '@/lib/applications/applicationEconomy';



describe('publicationPricing', () => {

  it('должно сделать первую историю бесплатной только на 1 уровне', () => {

    const result = resolveApplicationSubmitCost({

      userLevel: 1,

      priorApplicationCount: 0,

      baseCost: 50,

    });

    expect(result.submitCost).toBe(0);

    expect(result.discountLabel).toBeNull();

  });



  it('должно брать полную стоимость за первую историю на 2+ уровне', () => {

    const result = resolveApplicationSubmitCost({

      userLevel: 2,

      priorApplicationCount: 0,

      baseCost: 40,

    });

    expect(result.submitCost).toBe(40);

    expect(result.discountLabel).toBeNull();

  });



  it('должно брать полную стоимость за вторую историю без скидок', () => {

    const result = resolveApplicationSubmitCost({

      userLevel: 2,

      priorApplicationCount: 1,

      baseCost: 40,

    });

    expect(result.submitCost).toBe(40);

    expect(result.standardCost).toBe(40);

    expect(result.discountLabel).toBeNull();

  });



  it('должно вернуть полную стоимость в eligibility на 2 уровне', () => {

    const eligibility = buildApplicationEligibility({

      userId: 'u1',

      userLevel: 2,

      priorApplicationCount: 1,

      lastApplicationCreatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),

      availableBonuses: 40,

    });

    expect(eligibility.submitCost).toBe(40);

    expect(eligibility.standardSubmitCost).toBe(40);

    expect(eligibility.publishDiscountLabel).toBeNull();

    expect(eligibility.canSubmit).toBe(true);

  });

  it('должно описать желаемую сумму с примером для лимита уровня', () => {
    expect(formatDesiredAmountPerk(200)).toBe(
      'Поле «Желаемая сумма»: лимит 200 ₽, но можно попросить 350 ₽ — модератор решит',
    );
    expect(formatDesiredAmountFieldHint(200)).toBe(
      'Лимит 200 ₽, но можно попросить 350 ₽ — модератор решит. Одобрение не гарантировано.',
    );
  });

});


