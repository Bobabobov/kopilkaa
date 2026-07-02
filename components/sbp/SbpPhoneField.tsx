'use client';

import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SBP_UNSUPPORTED_NOTICE } from '@/lib/sbp/constants';
import {
  countSbpPhoneDigits,
  detectSbpPhoneCountry,
  formatSbpPhone,
  formatSbpPhonePartial,
  getSbpPhoneDigitLimit,
  getSbpPhoneError,
  isValidSbpPhone,
  SBP_PHONE_COUNTRIES,
  type SbpPhoneCountryId,
} from '@/lib/sbp/validatePhone';
import { normalizeSbpDigits } from '@/lib/sbp/sbpPhoneCountries';

interface SbpPhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
  onCountryChange?: (countryId: SbpPhoneCountryId) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  delay?: number;
  className?: string;
}

function moveCursorToEnd(input: HTMLInputElement | null | undefined) {
  if (!input) return;
  const end = input.value.length;
  input.setSelectionRange(end, end);
}

export function SbpPhoneField({
  value,
  onChange,
  onCountryChange,
  error,
  required = false,
  disabled = false,
  delay = 0,
  className = '',
}: SbpPhoneFieldProps) {
  const [touched, setTouched] = useState(false);
  const [countryId, setCountryId] = useState<SbpPhoneCountryId>(() =>
    value.trim() ? detectSbpPhoneCountry(value) : 'RU',
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const country = useMemo(
    () => SBP_PHONE_COUNTRIES.find((c) => c.id === countryId) ?? SBP_PHONE_COUNTRIES[0]!,
    [countryId],
  );

  const digitCount = countSbpPhoneDigits(value, countryId);
  const digitLimit = getSbpPhoneDigitLimit(countryId);

  const displayError = useMemo(() => {
    if (error) return error;
    if (!touched || digitCount === 0) return undefined;
    return getSbpPhoneError(value, countryId) ?? undefined;
  }, [error, touched, digitCount, value, countryId]);

  const inputBackgroundColor =
    displayError || (required && digitCount === 0 && touched)
      ? 'rgba(225, 97, 98, 0.08)'
      : digitCount > 0
        ? 'rgba(171, 209, 198, 0.05)'
        : 'rgba(0, 70, 67, 0.5)';

  const inputBorderClass =
    displayError || (required && digitCount === 0 && touched)
      ? 'border-[#e16162]/60 focus:ring-[#e16162]/30'
      : digitCount > 0
        ? 'border-[#abd1c6]/60 focus:ring-[#f9bc60]/50'
        : 'border-[#abd1c6]/30 focus:ring-[#f9bc60]/50';

  const setFormattedValue = (next: string) => {
    onChange(next);
    requestAnimationFrame(() => {
      moveCursorToEnd(inputRef.current);
    });
  };

  const formatFromDigits = (digits: string) => {
    if (!digits) {
      setFormattedValue('');
      return;
    }
    if (country.dialCode === '7' && (digits === '7' || digits === '8')) {
      setFormattedValue('');
      return;
    }
    setFormattedValue(formatSbpPhonePartial(countryId, digits));
  };

  const extractDigits = (raw: string) => normalizeSbpDigits(countryId, raw);

  const removeLastDigit = () => {
    formatFromDigits(extractDigits(value).slice(0, -1));
  };

  const handleChange = (next: string) => {
    formatFromDigits(extractDigits(next));
  };

  const handleCountryChange = (nextCountryId: SbpPhoneCountryId) => {
    setCountryId(nextCountryId);
    onCountryChange?.(nextCountryId);
    setFormattedValue('');
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleBlur = () => {
    setTouched(true);
    if (isValidSbpPhone(value, countryId)) {
      const formatted = formatSbpPhone(value, countryId);
      if (formatted !== value) {
        onChange(formatted);
      }
    }
  };

  return (
    <motion.div
      className={cn('space-y-2', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <label
        className="block text-sm font-medium"
        style={{ color: '#abd1c6' }}
      >
        Номер телефона
        {required && <span className="ml-1 text-[#e16162]">*</span>}
      </label>

      <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 sm:w-[11.5rem] sm:shrink-0">
          <select
            value={countryId}
            disabled={disabled}
            onChange={(e) => handleCountryChange(e.target.value as SbpPhoneCountryId)}
            className="kopilka-field-input w-full appearance-none rounded-xl border-2 border-[#abd1c6]/30 px-3 py-3 pr-9 text-sm outline-none transition-all focus:border-[#abd1c6]/60 focus:ring-2 focus:ring-[#f9bc60]/50 disabled:opacity-50"
            style={{
              color: '#fffffe',
              backgroundColor: 'rgba(0, 70, 67, 0.5)',
            }}
            aria-label="Страна номера СБП"
          >
            {SBP_PHONE_COUNTRIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.dialDisplay} {item.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[#94a1b2]">
            ▾
          </div>
        </div>

        <div className="relative min-w-0 flex-1">
          <input
            ref={inputRef}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="done"
            disabled={disabled}
            value={value}
            placeholder={country.placeholder}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            onFocus={(event) => {
              const input = event.currentTarget;
              requestAnimationFrame(() => {
                moveCursorToEnd(inputRef.current ?? input);
              });
            }}
            onClick={(event) => {
              const input = event.currentTarget;
              if (input.selectionStart === input.selectionEnd) {
                moveCursorToEnd(input);
              }
            }}
            onPaste={(event) => {
              event.preventDefault();
              const pasted = event.clipboardData.getData('text');
              const detected = detectSbpPhoneCountry(pasted, countryId);
              const digits = normalizeSbpDigits(detected, pasted);
              if (detected !== countryId) {
                setCountryId(detected);
                onCountryChange?.(detected);
              }
              setFormattedValue(formatSbpPhonePartial(detected, digits));
            }}
            onKeyDown={(event) => {
              if (event.ctrlKey || event.metaKey || event.altKey) return;

              if (event.key === 'Backspace' || event.key === 'Delete') {
                event.preventDefault();
                removeLastDigit();
                return;
              }

              const allowed = new Set([
                'ArrowLeft',
                'ArrowRight',
                'ArrowUp',
                'ArrowDown',
                'Home',
                'End',
                'Tab',
                'Enter',
              ]);
              if (allowed.has(event.key)) return;
              if (event.key === '+') return;
              if (/^\d$/.test(event.key)) return;
              event.preventDefault();
            }}
            className={cn(
              'kopilka-field-input w-full min-w-0 rounded-xl border-2 px-4 py-3 outline-none transition-all duration-300 placeholder:text-[#abd1c6]/70 focus:ring-2',
              inputBorderClass,
            )}
            style={{
              color: '#fffffe',
              caretColor: '#f9bc60',
              backgroundColor: inputBackgroundColor,
            }}
          />

          {digitCount > 0 && !displayError && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-[#abd1c6]">✓</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1 text-xs">
        {digitCount > 0 && (
          <div className="flex justify-end">
            <span className="tabular-nums text-[#94a1b2]">
              {digitCount} / {digitLimit}
            </span>
          </div>
        )}
        <p className="text-amber-200/90">{SBP_UNSUPPORTED_NOTICE}</p>
      </div>

      {displayError && (
        <p className="flex items-center gap-1.5 text-sm text-[#e16162]">
          <span aria-hidden>!</span>
          {displayError}
        </p>
      )}
    </motion.div>
  );
}
