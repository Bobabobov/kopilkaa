import { useEffect, useRef } from 'react';
import { recordFeedbackMeaningfulAction } from '@/lib/feedback/promptStorage';

/** Фиксирует осмысленное действие для отложенного показа формы обратной связи. */
export function useFeedbackMeaningfulOnResult(active: boolean): void {
  const recordedRef = useRef(false);

  useEffect(() => {
    if (!active || recordedRef.current) return;
    recordedRef.current = true;
    recordFeedbackMeaningfulAction();
  }, [active]);
}
