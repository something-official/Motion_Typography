/* Motion Typography: readable canvas type driven by pointer, scroll, and bounded noise. */
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
const status = document.querySelector('#status');
const pauseButton = document.querySelector('#pause');
const resetButton = document.querySelector('#reset');
const saveButton = document.querySelector('#save');
const pointer = { x: .5, y: .5 };
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let paused = false;
let scrollProgress = 0;
let animationFrame;
function resize() { const ratio = Math.min(devicePixelRatio || 1, 2); canvas.width = Math.max(1, Math.round(canvas.clientWidth * ratio)); canvas.height = Math.max(1, Math.round(canvas.clientHeight * ratio)); context.setTransform(ratio, 0, 0, ratio, 0, 0); }
function updatePointer(event) { const rect = canvas.getBoundingClientRect(); pointer.x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)); pointer.y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)); }
function render(time) { const width = canvas.clientWidth || 760; const height = canvas.clientHeight || 420; const motionTime = paused || reducedMotion ? 0 : time; const noise = Math.sin(motionTime * .0012) * (reducedMotion ? 0 : 8); context.fillStyle = '#201427'; context.fillRect(0, 0, width, height); context.textAlign = 'center'; context.textBaseline = 'middle'; const scale = .75 + pointer.x * .42; const fontSize = Math.max(32, Math.min(110, width * .13 * scale)); context.font = `900 ${fontSize}px Inter, ui-sans-serif, sans-serif`; context.letterSpacing = `${(pointer.y * 8 - 2).toFixed(1)}px`; context.save(); context.translate(width * (.5 + (pointer.x - .5) * .14), height * (.5 + (pointer.y - .5) * .14)); context.rotate((pointer.x - .5) * .22 + noise * .004 + scrollProgress * .08); context.fillStyle = `hsl(${285 + pointer.x * 65}, 88%, 78%)`; context.shadowBlur = 24; context.shadowColor = '#f0abfc'; context.fillText('MOVE / NOTICE', 0, 0); context.restore(); context.font = '700 13px ui-monospace, monospace'; context.fillStyle = '#d9bfd8'; context.fillText(`scale ${(scale).toFixed(2)} · scroll ${(scrollProgress).toFixed(2)} · ${paused ? 'paused' : 'live'}`, width / 2, height - 28); status.textContent = `Pointer ${Math.round(pointer.x * 100)}% · scroll ${Math.round(scrollProgress * 100)}% · ${paused ? 'motion paused' : 'motion live'}`; animationFrame = requestAnimationFrame(render); }
function updateScroll() { const max = Math.max(1, document.documentElement.scrollHeight - innerHeight); scrollProgress = Math.max(0, Math.min(1, scrollY / max)); }
function togglePause() { paused = !paused; pauseButton.textContent = paused ? 'Resume motion' : 'Pause motion'; }
function reset() { pointer.x = .5; pointer.y = .5; scrollProgress = 0; scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }); status.textContent = 'Phrase reset to its neutral state.'; }
function savePng() { const link = document.createElement('a'); link.download = 'motion-typography.png'; link.href = canvas.toDataURL('image/png'); link.click(); status.textContent = 'PNG prepared locally.'; }
window.addEventListener('resize', resize); window.addEventListener('scroll', updateScroll, { passive: true }); canvas.addEventListener('pointermove', updatePointer); canvas.addEventListener('pointerdown', updatePointer); pauseButton.addEventListener('click', togglePause); resetButton.addEventListener('click', reset); saveButton.addEventListener('click', savePng); resize(); render(performance.now());
