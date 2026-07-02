import { describe, expect, it, vi } from "vitest";

import { createManualTextInputHandlers } from "@/lib/forms/manualTextInput";

describe("createManualTextInputHandlers", () => {
  it("должно вызвать onBlocked при paste", () => {
    const onBlocked = vi.fn();
    const handlers = createManualTextInputHandlers(onBlocked);
    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.ClipboardEvent<HTMLInputElement>;

    handlers.onPaste?.(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(onBlocked).toHaveBeenCalled();
  });

  it("должно вызвать onBlocked при drop", () => {
    const onBlocked = vi.fn();
    const handlers = createManualTextInputHandlers(onBlocked);
    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.DragEvent<HTMLInputElement>;

    handlers.onDrop?.(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(onBlocked).toHaveBeenCalled();
  });

  it("должно блокировать Ctrl+V", () => {
    const onBlocked = vi.fn();
    const handlers = createManualTextInputHandlers(onBlocked);
    const event = {
      key: "v",
      ctrlKey: true,
      metaKey: false,
      shiftKey: false,
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    handlers.onKeyDown?.(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(onBlocked).toHaveBeenCalled();
  });
});
