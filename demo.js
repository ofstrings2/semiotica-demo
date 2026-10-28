'use strict';
(() => {
  const canvas = document.querySelector('#canvas');
  const enter = document.querySelector('#enter');
  const loading = document.querySelector('#loading');
  const progress = document.querySelector('#progress');
  const status = document.querySelector('#status');
  const failure = document.querySelector('#failure');
  const retry = document.querySelector('#retry');
  const guide = document.querySelector('#guide');
  let started = false;
  let timeout;
  const errors = [];
  window.semioticaDiagnostics = { errors, phase: 'welcome' };

  function sizeCanvas() {
    const box = document.querySelector('#stage').getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(box.width * ratio));
    const height = Math.max(1, Math.round(box.height * ratio));
    canvas.style.width = `${box.width}px`;
    canvas.style.height = `${box.height}px`;
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
  }
  new ResizeObserver(sizeCanvas).observe(document.querySelector('#stage'));
  sizeCanvas();

  function fail(error) {
    clearTimeout(timeout);
    document.body.classList.remove('running');
    window.semioticaDiagnostics.phase = 'error';
    loading.hidden = true;
    enter.hidden = true;
    failure.textContent = error?.message || String(error);
    failure.hidden = false;
    retry.hidden = false;
    console.error('Semiotica could not start:', error);
  }

  window.addEventListener('semiotica-engine-error', event => fail(event.detail));
  window.addEventListener('unhandledrejection', event => {
    if (started && !document.body.classList.contains('running')) fail(event.reason);
  });

  enter.addEventListener('click', async () => {
    if (started) return;
    if (!window.Engine || !Engine.isWebGLAvailable(2)) {
      fail(new Error('This browser cannot open WebGL 2. Try a current browser with graphics acceleration enabled.'));
      return;
    }
    started = true;
    enter.hidden = true;
    loading.hidden = false;
    window.semioticaDiagnostics.phase = 'loading';
    timeout = setTimeout(() => {
      status.textContent = 'Still opening the sheet. The first visit can take a little longer.';
      retry.hidden = false;
    }, 45000);
    try {
      const engine = new Engine(window.SEMIOTICA_CONFIG);
      await engine.startGame({
        canvas,
        canvasResizePolicy: 0,
        focusCanvas: true,
        onProgress(current, total) {
          if (total > 0) {
            progress.value = Math.min(100, current / total * 100);
            status.textContent = current >= total ? 'Opening the sheet…' : `Opening Semiotica · ${Math.min(100, Math.floor(current / total * 100))}%`;
          } else {
            progress.removeAttribute('value');
            status.textContent = 'Opening Semiotica…';
          }
        },
        onPrint(...parts) { console.log(...parts); },
        onPrintError(...parts) {
          const message = parts.join(' ');
          errors.push(message);
          console.error(...parts);
        },
        onExit() { fail(new Error('The demo has closed. You can open a fresh session below.')); },
      });
      clearTimeout(timeout);
      document.body.classList.add('running');
      window.semioticaDiagnostics.phase = 'playing';
      requestAnimationFrame(() => canvas.focus());
    } catch (error) { fail(error); }
  });

  retry.addEventListener('click', () => location.reload());
  document.querySelector('#controls').addEventListener('click', () => guide.showModal());
  const closeGuide = () => { guide.close(); if (started) canvas.focus(); };
  document.querySelector('#close-guide').addEventListener('click', closeGuide);
  document.querySelector('#dismiss-guide').addEventListener('click', closeGuide);
  guide.addEventListener('click', event => { if (event.target === guide) {
    const r = guide.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeGuide();
  }});
  guide.addEventListener('close', () => { if (started) canvas.focus(); });
  document.querySelector('#fullscreen').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
    } catch (error) { console.info('Fullscreen was not available:', error); }
    if (started) canvas.focus();
  });
  document.addEventListener('fullscreenchange', () => {
    document.querySelector('#fullscreen').textContent = document.fullscreenElement ? 'Exit full screen' : 'Full screen';
  });
  canvas.addEventListener('contextmenu', e => e.preventDefault());
  canvas.addEventListener('wheel', e => e.preventDefault(), {passive: false});
  canvas.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && ['s','z','y'].includes(e.key.toLowerCase())) e.preventDefault();
    if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
  });
})();
