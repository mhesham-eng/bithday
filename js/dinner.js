/* ============================================================
   ACT III — ARRIVAL (table + waiter greeting)
   ============================================================ */
let arrivalPlayed = false;
window.addEventListener('scene:enter', (e) => {
  if(e.detail.id !== 'scene-arrival' || arrivalPlayed) return;
  arrivalPlayed = true;
  document.getElementById('arrivalPlaceYou').textContent = HER_NAME.toUpperCase();
  document.getElementById('arrivalPlaceMe').textContent = HIS_NAME.toUpperCase();

  runLineSequence('waiterGreetingLines', WAITER_GREETING_LINES.map(t => ({ text: '"' + t + '"' })), {
    onDone(){
      document.getElementById('arrivalContinue').classList.add('show');
    }
  });
});

/* ============================================================
   ACT IV — THE DINNER (professional menu + personalized reactions)
   ============================================================ */
(function(){
  const cols = document.getElementById('menuCols');

  const starterCol = document.createElement('div');
  starterCol.innerHTML = '<p class="menu-col-title">Starters</p>';
  MENU.starters.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'menu-item';
    btn.innerHTML = '<span class="menu-item-name">' + item.name + '</span><span class="menu-item-desc">' + item.desc + '</span>';
    btn.addEventListener('click', () => {
      starterCol.querySelectorAll('.menu-item').forEach(b => b.classList.remove('chosen'));
      btn.classList.add('chosen');
    });
    starterCol.appendChild(btn);
  });

  const mainCol = document.createElement('div');
  mainCol.innerHTML = '<p class="menu-col-title">Main</p>';
  MENU.mains.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'menu-item';
    btn.innerHTML = '<span class="menu-item-name">' + item.name + '</span><span class="menu-item-desc">' + item.desc + '</span>';
    btn.addEventListener('click', () => serveDish(item));
    mainCol.appendChild(btn);
  });

  cols.appendChild(starterCol);
  cols.appendChild(mainCol);

  function serveDish(item){
    document.getElementById('menuStage').style.display = 'none';
    const stage = document.getElementById('dinnerSceneStage');
    stage.style.display = 'flex';
    stage.style.flexDirection = 'column';
    stage.style.alignItems = 'center';

    const reactionEl = document.getElementById('waiterReaction');
    const dishEl = document.getElementById('dishServed');
    reactionEl.textContent = '';
    dishEl.textContent = '';

    setTimeout(() => { reactionEl.textContent = '"' + (item.reaction || WAITER_DEFAULT_REACTION) + '"'; }, 400);
    setTimeout(() => { dishEl.textContent = 'Your ' + item.name + ' arrives.'; }, 1800);
  }
})();
