/* ============================================================
   ACT IX — THE FINALE (fireworks + tulips)
   ============================================================ */
document.getElementById('finaleTitle').textContent = FINALE_TITLE;
document.getElementById('finaleSignature').textContent = FINALE_SIGNATURE;

/* ---------- Tulip field along the bottom ---------- */
(function(){
  const field = document.getElementById('tulipField');
  const count = 14;
  for(let i=0;i<count;i++){
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 40 60');
    svg.setAttribute('width', 26 + Math.random()*20);
    svg.setAttribute('height', 40 + Math.random()*28);
    svg.style.left = (i * (100/count) + Math.random()*3) + '%';
    svg.style.opacity = 0.55 + Math.random()*0.35;
    svg.innerHTML = '<use href="#icon-tulip" style="stroke:#cdae7d; fill:none; stroke-width:1.4;"/>';
    field.appendChild(svg);
  }
})();

/* ---------- Fireworks ---------- */
let fireworksPlayed = false;
window.addEventListener('scene:enter', (e) => {
  if(e.detail.id !== 'scene-finale' || fireworksPlayed) return;
  fireworksPlayed = true;
  initFireworks();
});

function initFireworks(){
  const canvas = document.getElementById('fireworksCanvas');
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#cdae7d', '#e6d3ac', '#f2ede3', '#e9afc0'];
  let particles = [];

  function launch(){
    const x = window.innerWidth * (0.2 + Math.random()*0.6);
    const y = window.innerHeight * (0.2 + Math.random()*0.35);
    const color = colors[Math.floor(Math.random()*colors.length)];
    const count = 34 + Math.floor(Math.random()*16);
    for(let i=0;i<count;i++){
      const angle = (i/count) * Math.PI * 2;
      const speed = 1.6 + Math.random()*2.4;
      particles.push({
        x, y,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        life: 1,
        decay: 0.008 + Math.random()*0.01,
        color
      });
    }
  }

  function tick(){
    requestAnimationFrame(tick);
    ctx.fillStyle = 'rgba(10,10,10,0.18)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02; // gravity
      p.life -= p.decay;
    });
    particles = particles.filter(p => p.life > 0);

    particles.forEach(p => {
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
  tick();

  launch();
  setInterval(launch, 1500);
}
