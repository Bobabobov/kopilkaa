import type {
  ClipboardEvent,
  DragEvent,
  FormEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  TextareaHTMLAttributes,
} from "react";

export const MANUAL_INPUT_PASTE_BLOCKED_MESSAGE =
  "Вставка запрещена: введите текст вручную.";

type ManualInputElement = HTMLInputElement | HTMLTextAreaElement;

function isPasteShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (
    ((event.ctrlKey || event.metaKey) && key === "v") ||
    (event.shiftKey && event.key === "Insert")
  );
}

function isBlockedInputType(inputType: string): boolean {
  return (
    inputType === "insertFromPaste" ||
    inputType === "insertFromDrop" ||
    inputType === "insertFromClipboard"
  );
}

export function createManualTextInputHandlers(onBlocked: () => void): Pick<
  InputHTMLAttributes<ManualInputElement>,
  "onPaste" | "onDrop" | "onBeforeInput" | "onKeyDown"
> {
  return {
    onPaste: (event: ClipboardEvent<ManualInputElement>) => {
      event.preventDefault();
      onBlocked();
    },
    onDrop: (event: DragEvent<ManualInputElement>) => {
      event.preventDefault();
      onBlocked();
    },
    onBeforeInput: (event: FormEvent<ManualInputElement>) => {
      const inputType = (event.nativeEvent as InputEvent).inputType;
      if (isBlockedInputType(inputType)) {
        event.preventDefault();
        onBlocked();
      }
    },
    onKeyDown: (event: KeyboardEvent<ManualInputElement>) => {
      if (!isPasteShortcut(event)) return;
      event.preventDefault();
      onBlocked();
    },
  };
}

export function mergeManualTextInputProps<
  T extends InputHTMLAttributes<ManualInputElement> &
    TextareaHTMLAttributes<ManualInputElement>,
>(base: T | undefined, manual: ReturnType<typeof createManualTextInputHandlers>): T {
  return {
    ...base,
    onPaste: (event) => {
      manual.onPaste?.(event);
      if (!event.defaultPrevented) {
        base?.onPaste?.(event);
      }
    },
    onDrop: (event) => {
      manual.onDrop?.(event);
      if (!event.defaultPrevented) {
        base?.onDrop?.(event);
      }
    },
    onBeforeInput: (event) => {
      manual.onBeforeInput?.(event);
      if (!event.defaultPrevented) {
        base?.onBeforeInput?.(event);
      }
    },
    onKeyDown: (event) => {
      manual.onKeyDown?.(event);
      if (!event.defaultPrevented) {
        base?.onKeyDown?.(event);
      }
    },
  } as T;
}
