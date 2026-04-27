let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }
  if (audioContext) {
    return audioContext;
  }

  const AudioCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  audioContext = AudioCtor ? new AudioCtor() : null;
  return audioContext;
}

function playTone(frequency: number, durationMs: number, type: OscillatorType) {
  const audio = getAudioContext();
  if (!audio) {
    return;
  }

  if (audio.state === "suspended") {
    void audio.resume();
  }

  const now = audio.currentTime;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start(now);
  oscillator.stop(now + durationMs / 1000);
}

export function playDinoJumpSfx() {
  playTone(640, 60, "square");
}

export function playDinoCrashSfx() {
  playTone(200, 220, "sawtooth");
}

export function playDinoReviveSfx() {
  playTone(420, 60, "triangle");
  setTimeout(() => playTone(620, 90, "triangle"), 40);
}

export function playDinoSubmitSfx() {
  playTone(880, 80, "triangle");
}
