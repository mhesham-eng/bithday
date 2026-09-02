/* ============================================================
   CORE: scene manager, cursor, panels, video fallback, line player
   ============================================================ */

const SCENES = [
  'scene-getready','scene-journey','scene-arrival','scene-dinner',
  'scene-letter','scene-suitcase','scene-cake','scene-finale'
];
let currentScene = 0;

function goToScene(id){
  const idx = SCENES.indexOf(id);
  if(idx === -1) return;
  document.getElementById(SCENES[currentScene]).classList.remove('active');
  currentScene = idx;
  document.getElementById(id).classList.add('active');
  updateDots();
  window.dispatchEvent(new CustomEvent('scene:enter', { detail:{ id } }));
}
function updateDots(){
  document.querySelectorAll('#progress-dots .dot').forEach((d,i) => d.classList.toggle('active', i === currentScene));
}
const dotsHost = document.getElementById('progress-dots');
SCENES.forEach((s,i) => {
  const d = document.createElement('span');
  d.className = 'dot' + (i===0 ? ' active' : '');
  dotsHost.appendChild(d);
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-next]');
  if(!btn) return;
  if(btn.classList.contains('hidden-until-done') && !btn.classList.contains('show')) return;
  goToScene(btn.dataset.next);
});

/* ---------- Panels ---------- */
document.addEventListener('click', (e) => {
  const openBtn = e.target.closest('[data-open]');
  if(openBtn){
    const panel = document.getElementById(openBtn.dataset.open);
    if(panel){ panel.classList.add('show'); window.dispatchEvent(new CustomEvent('panel:open', { detail:{ id: openBtn.dataset.open } })); }
  }
  const closeBtn = e.target.closest('[data-close]');
  if(closeBtn) closeBtn.closest('.panel-overlay').classList.remove('show');
  if(e.target.classList && e.target.classList.contains('panel-overlay')) e.target.classList.remove('show');
});
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') document.querySelectorAll('.panel-overlay.show').forEach(p => p.classList.remove('show'));
});

/* ---------- Video fallback handling ---------- */
document.querySelectorAll('video.bg-video').forEach(video => {
  video.addEventListener('error', () => video.classList.add('video-error'));
  setTimeout(() => {
    if(video.readyState === 0) video.classList.add('video-error');
  }, 3500);
});

/* ---------- Reader-paced line player ----------
   Shows one line at a time. She controls the pace by clicking
   anywhere (or a visible "continue" hint) instead of a timer
   rushing her through it. Optional auto-advance still available
   for short beats via opts.autoAdvance (ms), but nothing defaults
   to fast timing anymore. */
function runLineSequence(containerId, lines, opts){
  opts = opts || {};
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  container.style.position = 'relative';
  container.classList.add('line-stage--clickable');

  const els = lines.map((line) => {
    const el = document.createElement('div');
    el.className = 'line-stage-item';
    if(line.clock){
      const clock = document.createElement('span');
      clock.className = 'line-clock';
      clock.textContent = line.clock;
      el.appendChild(clock);
    }
    const span = document.createElement('span');
    span.textContent = line.text;
    el.appendChild(span);
    container.appendChild(el);
    return el;
  });

  const tapHint = document.createElement('div');
  tapHint.className = 'tap-hint';
  tapHint.textContent = 'tap to continue';
  container.appendChild(tapHint);

  let index = 0;
  function showLine(i){
    els.forEach(e => e.classList.remove('on'));
    if(i < els.length){
      els[i].classList.add('on');
      tapHint.classList.toggle('show', i > 0 || els.length > 1);
    }
  }
  showLine(0);

  function advance(){
    index++;
    if(index >= els.length){
      container.removeEventListener('click', advance);
      tapHint.classList.remove('show');
      if(opts.onDone) opts.onDone();
      return;
    }
    showLine(index);
    if(opts.autoAdvance){
      setTimeout(advance, opts.autoAdvance);
    }
  }

  if(opts.autoAdvance){
    setTimeout(advance, opts.autoAdvance);
  } else {
    container.addEventListener('click', advance);
  }
}

/* ---------- Custom cursor ---------- */
(function(){
  const canvas = document.getElementById('cursor-canvas');
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let trail = [];
  const isTouch = 'ontouchstart' in window;
  window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  function draw(){
    requestAnimationFrame(draw);
    if(isTouch) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    trail.push({x:mx,y:my});
    if(trail.length > 8) trail.shift();
    trail.forEach((p,i) => {
      const r = (i+1)/trail.length * 5;
      const alpha = (i+1)/trail.length * 0.3;
      const grad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*3);
      grad.addColorStop(0, `rgba(205,174,125,${alpha})`);
      grad.addColorStop(1, 'rgba(205,174,125,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x,p.y,r*3,0,Math.PI*2);
      ctx.fill();
    });
  }
  draw();
})();

/* ---------- Reusable typewriter for letter cards ---------- */
function typeIntoLetterCard(containerId, paragraphs, opts){
  opts = opts || {};
  const container = document.getElementById(containerId);
  const card = container.closest('.letter-card');
  container.innerHTML = '';

  requestAnimationFrame(() => {
    setTimeout(() => card.classList.add('show'), 50);
  });

  let pIndex = 0;
  function typeParagraph(text, pEl, cb){
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    function tick(){
      if(i < text.length){
        pEl.textContent = text.slice(0, i+1);
        pEl.appendChild(cursor);
        i++;
        card.scrollTop = card.scrollHeight;
        setTimeout(tick, 15 + Math.random()*14);
      } else {
        cursor.remove();
        setTimeout(cb, 500);
      }
    }
    tick();
  }
  function next(){
    if(pIndex >= paragraphs.length){
      if(opts.onDone) opts.onDone();
      return;
    }
    const p = document.createElement('p');
    container.appendChild(p);
    typeParagraph(paragraphs[pIndex], p, () => { pIndex++; next(); });
  }
  setTimeout(next, 700); // let the card fade in first
}

/* ---------- Act I: The opening letter ---------- */
typeIntoLetterCard('letterIntroParagraphs', OPENING_LETTER, {
  onDone(){
    document.getElementById('letterIntroContinue').classList.add('show');
  }
});

document.getElementById('letterIntroContinue').addEventListener('click', () => {
  document.getElementById('letterIntroStage').style.display = 'none';
  document.getElementById('giftBoxStage').style.display = 'block';
});

/* ---------- Act I: The gift ---------- */
document.getElementById('giftTagTo').textContent = GIFT_TAG_TO;
document.getElementById('giftTagFrom').textContent = GIFT_TAG_FROM;

document.getElementById('giftBox').addEventListener('click', function(){
  if(this.classList.contains('unwrapped')) return;
  this.classList.add('unwrapped');
  setTimeout(() => {
    document.getElementById('giftBoxStage').style.display = 'none';
    const textStage = document.getElementById('act1TextStage');
    textStage.style.display = 'block';
    document.getElementById('postUnwrapLine').textContent = POST_UNWRAP_LINE;
  }, 750);
});
