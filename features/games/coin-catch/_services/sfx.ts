const STORAGE_KEY = "coinCatchAudio";

let cachedButtonAudio: HTMLAudioElement | null = null;
let cachedCoinAudio: HTMLAudioElement | null = null;
let lastButtonPlayAt = 0;
let settings = { muted: false, volume: 0.6 };

function clampVolume(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function resolveVolume(base: number): number {
  if (settings.muted) return 0;
  return clampVolume(base * settings.volume);
}

export function loadAudioSettings(): { muted: boolean; volume: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { muted?: boolean; volume?: number };
    if (typeof parsed.volume === "number")
      settings.volume = clampVolume(parsed.volume);
    if (typeof parsed.muted === "boolean") settings.muted = parsed.muted;
    return { muted: settings.muted, volume: settings.volume };
  } catch {
    return null;
  }
}

export function setAudioSettings(next: {
  muted: boolean;
  volume: number;
}): void {
  settings = { muted: next.muted, volume: clampVolume(next.volume) };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }
}

export function getMusicVolume(base: number): number {
  return resolveVolume(base);
}

export function playButtonSound(): void {
  if (typeof Audio === "undefined") return;
  const now = Date.now();
  if (now - lastButtonPlayAt < 120) return;
  lastButtonPlayAt = now;
  if (!cachedButtonAudio) {
    cachedButtonAudio = new Audio(
      "/coin/muzaka/knopki/cassette-player-button.mp3",
    );
    cachedButtonAudio.preload = "auto";
    cachedButtonAudio.load();
  } else {
    try {
      cachedButtonAudio.currentTime = 0;
    } catch {
      // ignore
    }
  }
  cachedButtonAudio.volume = resolveVolume(0.55);
  cachedButtonAudio.play().catch(() => {
    // ignore autoplay restrictions
  });
}

export function playCoinCollectSound(): void {
  if (typeof Audio === "undefined") return;
  if (!cachedCoinAudio) {
    cachedCoinAudio = new Audio(
      "/coin/muzaka/knopki/the-sound-of-adding-coins-in-a-computer-game.mp3",
    );
  } else {
    try {
      cachedCoinAudio.currentTime = 0;
    } catch {
      // ignore
    }
  }
  cachedCoinAudio.volume = resolveVolume(0.45);
  cachedCoinAudio.play().catch(() => {
    // ignore autoplay restrictions
  });
}
