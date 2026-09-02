/* ============================================================
   MEDIA: one shared beach video, moved between scenes on demand.
   Fixes the earlier bug of 7 simultaneous video instances.
   ============================================================ */
const BEACH_SCENE_CONFIG = {
  'scene-arrival':  { dim:false },
  'scene-dinner':   { dim:false },
  'scene-letter':   { dim:false },
  'scene-suitcase': { dim:false },
  'scene-cake':     { dim:true  }
};

const sharedBeachVideo = document.getElementById('sharedBeachVideo');

function parkBeachVideoIn(containerId, dim){
  const container = document.getElementById(containerId);
  if(!container) return;
  if(sharedBeachVideo.parentElement !== container){
    container.insertBefore(sharedBeachVideo, container.firstChild);
  }
  sharedBeachVideo.classList.remove('video-parked');
  sharedBeachVideo.classList.toggle('bg-video--dim', !!dim);
  if(sharedBeachVideo.paused){
    sharedBeachVideo.play().catch(() => { /* autoplay blocked until user interacts — fine */ });
  }
}

window.addEventListener('scene:enter', (e) => {
  const conf = BEACH_SCENE_CONFIG[e.detail.id];
  if(!conf) return;
  const containerId = 'mediaBg-' + e.detail.id.replace('scene-', '');
  parkBeachVideoIn(containerId, conf.dim);
});

/* ---------- Arrival song ---------- */
(function(){
  const song = document.getElementById('arrivalSong');
  const toggle = document.getElementById('songToggle');
  let started = false;
  let muted = false;

  window.addEventListener('scene:enter', (e) => {
    if(e.detail.id !== 'scene-arrival' || started) return;
    started = true;
    song.volume = 0.5;
    song.play().catch(() => {
      // autoplay blocked — she can tap the note icon to start it manually
    });
  });

  toggle.addEventListener('click', () => {
    muted = !muted;
    if(muted){ song.pause(); } else { song.play().catch(() => {}); }
    toggle.style.opacity = muted ? '0.35' : '1';
  });
})();
