// ===================================================
// AUDIO SERVICE - Sintetizador Web Audio API para alertas
// ===================================================

let audioCtx = null;
let soundEnabled = true;

function playAlertSound() {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.28); // D6
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.45);
  } catch (e) {
    console.log('Audio error:', e);
  }
}

function initAudioControls() {
  const btn = document.getElementById('btn-sound-toggle');
  if (!btn) return;
  btn.addEventListener('click', function() {
    soundEnabled = !soundEnabled;
    const span = this.querySelector('span');
    if (span) span.textContent = soundEnabled ? 'Sonido: ON' : 'Sonido: OFF';
    showToast(soundEnabled ? '🔔 Alertas sonoras activadas' : '🔕 Alertas sonoras silenciadas');
    if (soundEnabled) playAlertSound();
  });
}

window.playAlertSound = playAlertSound;
window.initAudioControls = initAudioControls;
