/**
 * Полифилл Array.prototype.findLast для старых браузерах (в т.ч. часть Android).
 * ES2023, без него на /applications падает "r.findLast is not a function".
 */
export function applyFindLastPolyfill(): void {
  if (typeof Array.prototype.findLast === "function") return;
  Array.prototype.findLast = function findLast<T>(
    this: T[],
    predicate: (value: T, index: number, array: T[]) => unknown,
  ): T | undefined {
    for (let i = this.length - 1; i >= 0; i--) {
      if (predicate(this[i], i, this)) return this[i];
    }
    return undefined;
  };
}
