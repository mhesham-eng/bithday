/* ============================================================
   ACT VIII — THE CAKE
   ============================================================ */
let cakeScenePlayed = false;
let cakeSceneActive = false;
window.addEventListener('scene:enter', (e) => {
  cakeSceneActive = (e.detail.id === 'scene-cake');
});
window.addEventListener('scene:enter', (e) => {
  if(e.detail.id !== 'scene-cake' || cakeScenePlayed) return;
  cakeScenePlayed = true;

  const l1 = document.getElementById('cakeLine1');
  const l2 = document.getElementById('cakeLine2');
  const intro = document.getElementById('cakeIntroLine');
  intro.textContent = CAKE_INTRO_LINE;
  intro.style.opacity = 0;
  l1.textContent = CAKE_LINE_1;
  l1.style.opacity = 0;
  l2.textContent = CAKE_LINE_2;
  l2.style.opacity = 0;
  setTimeout(() => { intro.style.transition = 'opacity 1.2s ease'; intro.style.opacity = 1; }, 100);
  setTimeout(() => { l1.style.transition = 'opacity 1.2s ease'; l1.style.opacity = 1; }, 1400);
  setTimeout(() => { l2.style.transition = 'opacity 1.2s ease'; l2.style.opacity = 1; initCake(); }, 3000);
});

let renderer, scene, camera, cakeGroup, flames = [];
let cakeInitialized = false;
let dragging = false, lastX = 0;

function initCake(){
  if(cakeInitialized || typeof THREE === 'undefined') return;
  const canvas = document.getElementById('cakeCanvas');
  const wrap = canvas.parentElement;
  renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(wrap.clientWidth, wrap.clientHeight);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(42, wrap.clientWidth/wrap.clientHeight, 0.1, 100);
  camera.position.set(0, 3.4, 10);
  camera.lookAt(0,1.2,0);

  scene.add(new THREE.AmbientLight(0xfff0dd, 0.65));
  const point = new THREE.PointLight(0xcdae7d, 1.3, 22);
  point.position.set(3,6,4);
  scene.add(point);

  cakeGroup = new THREE.Group();
  const tierMat = new THREE.MeshStandardMaterial({ color:0x1a1410, roughness:0.6 });
  const icingMat = new THREE.MeshStandardMaterial({ color:0xe6d3ac, roughness:0.45 });

  const tierBottom = new THREE.Mesh(new THREE.CylinderGeometry(2.6,2.6,1.2,40), tierMat);
  tierBottom.position.y = 0.6;
  cakeGroup.add(tierBottom);
  const icingBottom = new THREE.Mesh(new THREE.CylinderGeometry(2.62,2.62,0.14,40), icingMat);
  icingBottom.position.y = 1.2;
  cakeGroup.add(icingBottom);

  const tierTop = new THREE.Mesh(new THREE.CylinderGeometry(1.7,1.7,1,40), tierMat);
  tierTop.position.y = 1.75;
  cakeGroup.add(tierTop);
  const icingTop = new THREE.Mesh(new THREE.CylinderGeometry(1.72,1.72,0.14,40), icingMat);
  icingTop.position.y = 2.27;
  cakeGroup.add(icingTop);

  const count = typeof CANDLE_COUNT === 'number' ? CANDLE_COUNT : 22;
  for(let i=0;i<count;i++){
    const angle = (i / count) * Math.PI * 2;
    const cx = Math.cos(angle) * 1.1;
    const cz = Math.sin(angle) * 1.1;
    const candle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035,0.035,0.42,8),
      new THREE.MeshStandardMaterial({ color:0xf2ede3 })
    );
    candle.position.set(cx, 2.55, cz);
    cakeGroup.add(candle);

    const flame = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 8, 8),
      new THREE.MeshBasicMaterial({ color:0xe6d3ac })
    );
    flame.position.set(cx, 2.8, cz);
    cakeGroup.add(flame);
    flames.push(flame);
  }
  scene.add(cakeGroup);

  canvas.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; canvas.style.cursor = 'grabbing'; });
  window.addEventListener('pointerup', () => { dragging = false; canvas.style.cursor = 'grab'; });
  window.addEventListener('pointermove', (e) => {
    if(!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    cakeGroup.rotation.y += dx * 0.01;
  });

  function animate(){
    requestAnimationFrame(animate);
    if(!cakeSceneActive) return; // stop rendering once she's moved past this scene
    flames.forEach((f,i) => {
      const flicker = 1 + Math.sin(Date.now()*0.01 + i) * 0.15;
      f.scale.setScalar(f.visible ? flicker : 0);
    });
    if(!dragging) cakeGroup.rotation.y += 0.0018;
    renderer.render(scene, camera);
  }
  animate();
  cakeInitialized = true;
}

let candlesOut = false;
function blowOutCandles(){
  if(candlesOut) return;
  candlesOut = true;
  const count = flames.length;
  flames.forEach((f, i) => { setTimeout(() => { f.visible = false; }, i*70); });
  document.getElementById('micStatus').textContent = '';
  document.getElementById('micRequestBtn').style.display = 'none';
  document.getElementById('tapBlowBtn').style.display = 'none';

  setTimeout(() => { goToScene('scene-finale'); }, count*70 + 1400);
}

document.getElementById('tapBlowBtn').addEventListener('click', blowOutCandles);

document.getElementById('micRequestBtn').addEventListener('click', async () => {
  const status = document.getElementById('micStatus');
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    status.textContent = 'microphone not available here — use the tap button instead';
    return;
  }
  try{
    const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    status.textContent = 'listening... blow toward your screen';
    let sustainedFrames = 0;

    function check(){
      if(candlesOut) return;
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a,b) => a+b, 0) / data.length;
      if(avg > 42) sustainedFrames++; else sustainedFrames = Math.max(0, sustainedFrames - 1);
      if(sustainedFrames > 6){
        blowOutCandles();
        stream.getTracks().forEach(t => t.stop());
        audioCtx.close();
        return;
      }
      requestAnimationFrame(check);
    }
    check();
  }catch(err){
    status.textContent = 'mic permission denied — use the tap button instead';
  }
});
