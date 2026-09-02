/* ============================================================
   ACT II — THE JOURNEY
   ============================================================ */
let journeyPlayed = false;
window.addEventListener('scene:enter', (e) => {
  if(e.detail.id !== 'scene-journey' || journeyPlayed) return;
  journeyPlayed = true;
  runLineSequence('journeyLines', JOURNEY_LINES, {
    onDone(){
      document.getElementById('journeyContinue').classList.add('show');
    }
  });
});
