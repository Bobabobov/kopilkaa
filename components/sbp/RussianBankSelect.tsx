'use client';

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { LucideIcons } from '@/components/ui/LucideIcons';
import { cn } from '@/lib/utils';
import {
  filterSbpBanks,
  getSbpBankCountryLabel,
  isSbpBank,
} from '@/lib/sbp/sbpBanks';
import type { SbpPhoneCountryId } from '@/lib/sbp/sbpPhoneCountries';

interface RussianBankSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  countryId?: SbpPhoneCountryId;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const DROPDOWN_MAX_HEIGHT = 288;
const DROPDOWN_GAP = 6;

type DropdownPlacement = {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
  maxHeight: number;
};

function getDropdownPlacement(input: HTMLInputElement): DropdownPlacement {
  const rect = input.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom - DROPDOWN_GAP;
  const spaceAbove = rect.top - DROPDOWN_GAP;
  const openAbove = spaceBelow < 180 && spaceAbove > spaceBelow;
  const maxHeight = Math.min(
    DROPDOWN_MAX_HEIGHT,
    Math.max(120, openAbove ? spaceAbove : spaceBelow),
  );

  return {
    left: rect.left,
    width: rect.width,
    ...(openAbove
      ? { bottom: window.innerHeight - rect.top + DROPDOWN_GAP, maxHeight }
      : { top: rect.bottom + DROPDOWN_GAP, maxHeight }),
  };
}

export function RussianBankSelect({
  label = 'Банк',
  value,
  onChange,
  countryId = 'RU',
  error,
  required = false,
  disabled = false,
  className = '',
}: RussianBankSelectProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [placement, setPlacement] = useState<DropdownPlacement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const options = useMemo(
    () => filterSbpBanks(query, countryId),
    [query, countryId],
  );
  const hasQuery = query.trim().length > 0;
  const showError = Boolean(error);
  const countryLabel = getSbpBankCountryLabel(countryId);
  const searchPlaceholder =
    countryId === 'RU'
      ? 'Например: сбер, тбанк, вайлдберриз'
      : `Поиск банка (${countryLabel})`;

  const prevCountryRef = useRef(countryId);

  useEffect(() => {
    if (prevCountryRef.current === countryId) return;
    prevCountryRef.current = countryId;
    if (value.trim() && !isSbpBank(value, countryId)) {
      onChange('');
      setQuery('');
    }
  }, [countryId, onChange, value]);

  const updatePlacement = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;
    setPlacement(getDropdownPlacement(input));
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setPlacement(null);
      return;
    }
    updatePlacement();
    window.addEventListener('resize', updatePlacement);
    window.addEventListener('scroll', updatePlacement, true);
    return () => {
      window.removeEventListener('resize', updatePlacement);
      window.removeEventListener('scroll', updatePlacement, true);
    };
  }, [open, options.length, updatePlacement]);

  useEffect(() => {
    const onDocPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if ((target as HTMLElement).closest?.('[data-bank-select-dropdown]')) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onDocPointerDown);
    return () => document.removeEventListener('pointerdown', onDocPointerDown);
  }, []);

  const pickBank = (bank: string) => {
    onChange(bank);
    setQuery(bank);
    setOpen(false);
    inputRef.current?.blur();
  };

  const toggleList = () => {
    if (disabled) return;
    setOpen((current) => !current);
    if (!open) {
      inputRef.current?.focus();
    }
  };

  const clearQuery = () => {
    setQuery('');
    onChange('');
    setOpen(true);
    inputRef.current?.focus();
  };

  const inputBorderClass = showError
    ? 'border-[#e16162]/60 focus:ring-[#e16162]/30'
    : hasQuery
      ? 'border-[#abd1c6]/60 focus:ring-[#f9bc60]/50'
      : 'border-[#abd1c6]/30 focus:ring-[#f9bc60]/50';

  const inputBackgroundColor = showError
    ? 'rgba(225, 97, 98, 0.08)'
    : hasQuery
      ? 'rgba(171, 209, 198, 0.05)'
      : 'rgba(0, 70, 67, 0.5)';

  const inputPaddingRight =
    query && showError ? 'pr-[7.5rem]' : query ? 'pr-[5.5rem]' : 'pr-12';

  const dropdown =
    open && !disabled && placement && mounted
      ? createPortal(
          <div
            id={listboxId}
            role="listbox"
            data-bank-select-dropdown
            style={{
              position: 'fixed',
              left: placement.left,
              width: placement.width,
              top: placement.top,
              bottom: placement.bottom,
              maxHeight: placement.maxHeight,
              zIndex: 10050,
            }}
            className="custom-scrollbar flex min-w-0 flex-col overflow-hidden rounded-xl border-2 border-[#abd1c6]/30 bg-[#001e1d] shadow-[0_18px_48px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
          >
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#abd1c6]/15 bg-[#001e1d] px-3 py-2">
              <span className="min-w-0 truncate text-xs text-[#94a1b2]">
                {hasQuery
                  ? `Найдено: ${options.length}`
                  : 'Все банки — прокрутите или введите название'}
              </span>
              <button
                type="button"
                className="shrink-0 text-xs font-medium text-[#f9bc60] hover:underline"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setOpen(false);
                  inputRef.current?.blur();
                }}
              >
                Свернуть
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {hasQuery && options.length === 0 ? (
                <p className="px-3 py-3 text-sm text-[#94a1b2]">
                  Банк не найден. Попробуйте «тбанк», «сбер», «вайлдберриз»
                </p>
              ) : (
                <div className="py-1" role="presentation">
                  {options.map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      role="option"
                      aria-selected={bank === value}
                      className={cn(
                        'w-full px-3 py-2.5 text-left text-sm text-[#fffffe] transition-colors hover:bg-white/10',
                        bank === value && 'bg-[#f9bc60]/15 text-[#f9bc60]',
                      )}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pickBank(bank)}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('relative space-y-2', className)}
    >
      <label
        className="block text-sm font-medium"
        style={{ color: '#abd1c6' }}
      >
        {label}
        {required && <span className="ml-1 text-[#e16162]">*</span>}
      </label>

      <div className="relative min-w-0">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          value={query}
          disabled={disabled}
          placeholder={searchPlaceholder}
          autoComplete="off"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange('');
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && options[0]) {
              e.preventDefault();
              pickBank(options[0]);
            }
            if (e.key === 'Escape') {
              e.preventDefault();
              setOpen(false);
              inputRef.current?.blur();
            }
          }}
          className={cn(
            'kopilka-field-input w-full min-w-0 rounded-xl border-2 px-4 py-3 outline-none transition-all duration-300 placeholder:text-[#abd1c6]/70 focus:ring-2',
            inputPaddingRight,
            inputBorderClass,
          )}
          style={{
            color: '#fffffe',
            caretColor: '#f9bc60',
            backgroundColor: inputBackgroundColor,
          }}
        />

        <div className="absolute inset-y-0 right-2 flex items-center gap-0.5">
          {showError ? (
            <LucideIcons.XCircle size="sm" className="pointer-events-none text-[#e16162]" />
          ) : value ? (
            <LucideIcons.CheckCircle size="sm" className="pointer-events-none text-[#abd1c6]" />
          ) : null}
          {query && !disabled && (
            <button
              type="button"
              aria-label="Очистить"
              className="rounded-lg p-1.5 text-[#94a1b2] transition-colors hover:bg-white/10 hover:text-[#fffffe]"
              onMouseDown={(e) => e.preventDefault()}
              onClick={clearQuery}
            >
              <LucideIcons.X size="sm" />
            </button>
          )}
          <button
            type="button"
            aria-label={open ? 'Свернуть список банков' : 'Развернуть список банков'}
            aria-expanded={open}
            disabled={disabled}
            onClick={toggleList}
            className="rounded-lg p-1.5 text-[#94a1b2] transition-colors hover:bg-white/10 hover:text-[#f9bc60] disabled:opacity-50"
          >
            {open ? (
              <LucideIcons.ChevronUp size="sm" />
            ) : (
              <LucideIcons.ChevronDown size="sm" />
            )}
          </button>
        </div>
      </div>

      <p className="text-xs text-[#94a1b2]">
        Банки {countryLabel}, подключённые к трансграничному СБП.
        {countryId === 'RU' ? ' Можно вводить: «тбанк», «сбер», «вайлдберриз».' : ''}
      </p>

      {showError && (
        <p className="flex items-center gap-1.5 text-sm text-[#e16162]">
          <LucideIcons.Alert size="xs" />
          {error}
        </p>
      )}

      {dropdown}
    </motion.div>
  );
}
