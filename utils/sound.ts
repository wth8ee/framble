import { playSound } from "@/lib/playSound";

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    } catch (e) {
      console.error("AudioContext not supported", e);
    }
  }
  // Resume context if it was suspended (browser policy)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Soft UI pop/tick
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03);
    
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.03);
  } catch (e) {}
}

export function playWheelTicking(durationMs: number) {
  let tickCount = 0;
  // Based on the spin degrees, we can approximate 40-50 ticks
  const maxTicks = 45; 
  
  const tick = () => {
    if (tickCount >= maxTicks) return;
    playTickSound();
    tickCount++;
    
    const progress = tickCount / maxTicks;
    // Delay increases exponentially to simulate wheel slowing down
    // At the start, it's very fast (~20ms), at the end it slows down significantly
    const delay = 15 + Math.pow(progress, 3.5) * 350;
    
    if (progress < 1) {
      setTimeout(tick, delay);
    }
  };
  
  tick();
}

export function playWinSound(multiplier: number) {
  if (multiplier <= 0) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  } else {
    playSound("diamond.ogg");
  }
}
