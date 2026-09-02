/* ============================================================
   ACT VI — THE SUITCASE (real 3D open, then pass/ring/key)
   ============================================================ */
let suitcaseInitialized = false;
let suitcaseOpened = false;
let suitcaseSceneActive = false;
let scCanvas, scRenderer, scScene, scCamera, scLid;

function initSuitcase3D(){
  if(suitcaseInitialized || typeof THREE === 'undefined') return;
  scCanvas = document.getElementById('suitcaseCanvas');
  const wrap = scCanvas.parentElement;
  scRenderer = new THREE.WebGLRenderer({ canvas: scCanvas, alpha:true, antialias:true });
  scRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  scRenderer.setSize(wrap.clientWidth, wrap.clientHeight);

  scScene = new THREE.Scene();
  scCamera = new THREE.PerspectiveCamera(40, wrap.clientWidth/wrap.clientHeight, 0.1, 100);
  scCamera.position.set(0, 2.6, 7);
  scCamera.lookAt(0, 0.6, 0);

  scScene.add(new THREE.AmbientLight(0xfff0dd, 0.7));
  const point = new THREE.PointLight(0xcdae7d, 1.2, 20);
  point.position.set(3, 5, 4);
  scScene.add(point);

  const bodyMat = new THREE.MeshStandardMaterial({ color:0x2a1f14, roughness:0.55 });
  const trimMat = new THREE.MeshStandardMaterial({ color:0xcdae7d, roughness:0.35, metalness:0.6 });

  const base = new THREE.Mesh(new THREE.BoxGeometry(4, 1.1, 2.6), bodyMat);
  base.position.y = 0;
  scScene.add(base);

  // trim edges on base
  const baseEdge = new THREE.Mesh(new THREE.BoxGeometry(4.05, 0.1, 2.65), trimMat);
  baseEdge.position.y = -0.5;
  scScene.add(baseEdge);

  // lid, hinged at the back edge
  scLid = new THREE.Group();
  scLid.position.set(0, 0.55, -1.3);
  const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 1.1, 2.6), bodyMat);
  lidMesh.position.set(0, 0, 1.3);
  scLid.add(lidMesh);
  const lidEdge = new THREE.Mesh(new THREE.BoxGeometry(4.05, 0.1, 2.65), trimMat);
  lidEdge.position.set(0, 0.5, 1.3);
  scLid.add(lidEdge);
  scScene.add(scLid);

  // handle
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.05, 8, 20, Math.PI), trimMat);
  handle.rotation.z = Math.PI;
  handle.position.set(0, 0.65, 1.3);
  scLid.add(handle);

  // interior glow (visible once lid opens)
  const interior = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 2.2),
    new THREE.MeshStandardMaterial({ color:0xf2ede3, roughness:0.8, side:THREE.DoubleSide })
  );
  interior.rotation.x = -Math.PI/2;
  interior.position.y = -0.42;
  scScene.add(interior);

  function animate(){
    requestAnimationFrame(animate);
    if(!suitcaseSceneActive) return; // stop rendering once she's moved past this scene
    scRenderer.render(scScene, scCamera);
  }
  animate();

  window.addEventListener('resize', () => {
    if(!wrap.clientWidth) return;
    scCamera.aspect = wrap.clientWidth / wrap.clientHeight;
    scCamera.updateProjectionMatrix();
    scRenderer.setSize(wrap.clientWidth, wrap.clientHeight);
  });

  suitcaseInitialized = true;
}

window.addEventListener('scene:enter', (e) => {
  suitcaseSceneActive = (e.detail.id === 'scene-suitcase');
  if(suitcaseSceneActive) initSuitcase3D();
});

document.getElementById('suitcaseCanvas').parentElement.addEventListener('click', () => {
  if(suitcaseOpened || typeof gsap === 'undefined' || !scLid) return;
  suitcaseOpened = true;
  document.getElementById('suitcaseTapHint').style.opacity = '0';

  gsap.to(scLid.rotation, {
    x: -Math.PI * 0.62,
    duration: 1.4,
    ease: 'power2.inOut',
    onComplete(){
      setTimeout(() => {
        document.getElementById('suitcaseClosedStage').style.display = 'none';
        document.getElementById('suitcaseOpenStage').style.display = 'block';
      }, 500);
    }
  });
});

/* ---------- Gold pass ---------- */
document.getElementById('passDate').textContent = GOLD_PASS.validDate;
document.getElementById('passHolder').textContent = GOLD_PASS.holder;
document.getElementById('passBody').textContent = GOLD_PASS.front;
document.getElementById('passFine').textContent = GOLD_PASS.terms;
document.getElementById('passBack').textContent = GOLD_PASS.back;
document.getElementById('goldPass').addEventListener('click', function(){ this.classList.toggle('flipped'); });

/* ---------- Ring ---------- */
document.getElementById('ringCaption').textContent = RING_CAPTION;
document.getElementById('ringImg').addEventListener('error', function(){
  this.style.display = 'none';
  const fb = document.getElementById('ringFallback');
  fb.style.display = 'flex';
});

/* ---------- Key ---------- */
document.getElementById('keyText').textContent = KEY_INSCRIPTION;
document.getElementById('keyFootnote').textContent = KEY_FOOTNOTE;

document.getElementById('suitcaseIntroLine').textContent = SUITCASE_INTRO_LINE;

/* ---------- Track visited items, unlock continue after all three ---------- */
(function(){
  const visited = new Set();
  const items = document.querySelectorAll('.suitcase-item');
  const continueBtn = document.getElementById('suitcaseContinueBtn');

  items.forEach(item => {
    item.addEventListener('click', () => {
      visited.add(item.dataset.open);
      item.classList.add('visited');
      if(visited.size >= items.length){
        continueBtn.style.opacity = '1';
        continueBtn.style.pointerEvents = 'auto';
      }
    });
  });
})();
