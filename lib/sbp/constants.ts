import { SBP_CROSS_BORDER_COUNTRY_NAMES } from '@/lib/sbp/sbpPhoneCountries';

const crossBorderList = SBP_CROSS_BORDER_COUNTRY_NAMES.join(', ');

const SBP_SCOPE_NOTICE =
  `Переводы возможны по СБП в России и в страны: ${crossBorderList}. ` +
  'К российской СБП подключено около 50 иностранных банков-партнёров. ' +
  'Убедитесь, что банк получателя принимает трансграничные переводы СБП.';

export const SBP_UNSUPPORTED_NOTICE =
  'Важно: отправить деньги в страны Европы, США или Канаду через СБП невозможно.';

/** Предупреждение при получении гонорара по СБП. */
export const SBP_BONUS_NOTICE = `Внимание! ${SBP_SCOPE_NOTICE}`;

/** Предупреждение при указании данных СБП для получения гонорара. */
export const SBP_APPLICATION_NOTICE = `Внимание! ${SBP_SCOPE_NOTICE}`;

export { SBP_CROSS_BORDER_COUNTRY_NAMES };
