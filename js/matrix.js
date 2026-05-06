// ============================================
// ALPHA CLAN — MATRIX BINARY RAIN
// ============================================

(function () {
  const canvas = document.getElementById('matrixCanvas');
  const ctx = canvas.getContext('2d');

  // Characters: binary + some katakana + hex for that cyber feel
  const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ0110ABCDEF';
  const CHAR_ARR = CHARS.split('');

  const FONT_SIZE = 14;
  let columns, drops;

  // Color stops for the rain — neon green fading to dark
  const COLOR_HEAD  = 'rgba(180, 255, 180, 0.95)'; // bright white-green head
  const COLOR_MID   = 'rgba(57, 255, 20, 0.8)';    // full accent green
  const COLOR_TRAIL = 'rgba(57, 255, 20, 0.15)';   // fading trail

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / FONT_SIZE);

    // Initialize or reset drops — random start heights so it's not uniform
    drops = Array.from({ length: columns }, () => Math.random() * -100);
  }

  // Each column has its own speed and character state
  let colSpeeds, colChars;

  function initCols() {
    colSpeeds = Array.from({ length: columns }, () => 0.3 + Math.random() * 0.7);
    colChars  = Array.from({ length: columns }, () => Math.floor(Math.random() * CHAR_ARR.length));
  }

  resize();
  initCols();

  function draw() {
    // Fade the canvas slightly each frame — creates the trail effect
    ctx.fillStyle = 'rgba(5, 6, 8, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${FONT_SIZE}px "Share Tech Mono", monospace`;

    for (let i = 0; i < drops.length; i++) {
      const y = drops[i] * FONT_SIZE;

      // Occasionally randomize the character in this column
      if (Math.random() > 0.92) {
        colChars[i] = Math.floor(Math.random() * CHAR_ARR.length);
      }
      const char = CHAR_ARR[colChars[i]];

      // Draw head character (bright)
      ctx.fillStyle = COLOR_HEAD;
      ctx.fillText(char, i * FONT_SIZE, y);

      // Draw a slightly dimmer char one step behind
      if (drops[i] > 1) {
        ctx.fillStyle = COLOR_MID;
        ctx.fillText(CHAR_ARR[Math.floor(Math.random() * CHAR_ARR.length)], i * FONT_SIZE, y - FONT_SIZE);
      }

      // Advance drop by its speed
      drops[i] += colSpeeds[i];

      // Reset drop when it goes off screen — random delay so columns stagger
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = Math.random() * -50;
        colSpeeds[i] = 0.3 + Math.random() * 0.7;
      }
    }
  }

  // Run at ~30fps (enough for rain effect, keeps CPU low)
  let lastTime = 0;
  let animFrameId;
  function loop(ts) {
    if (ts - lastTime > 33) {
      draw();
      lastTime = ts;
    }
    animFrameId = requestAnimationFrame(loop);
  }

  animFrameId = requestAnimationFrame(loop);

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      initCols();
    }, 150);
  });

  // Pause when tab is hidden (saves CPU)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animFrameId);
    else animFrameId = requestAnimationFrame(loop);
  });

})();
