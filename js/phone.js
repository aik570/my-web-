// The story of the page in one object: a phone arrives broken, opens into its
// layers as you scroll, and closes again repaired. Built from primitives, no
// downloaded model, so every part can be named and moved.

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const stage = document.getElementById('story');
const canvas = document.getElementById('phoneCanvas');
const labels = [...document.querySelectorAll('[data-layer]')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (e) {
  document.documentElement.classList.add('no-webgl');
  throw e;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
camera.position.set(0, 0, 9);

// Teal rim from behind, as in the logo; a soft key from the front left.
const rim = new THREE.DirectionalLight(0x6fd0b7, 1.8);
rim.position.set(3, 2, -4);
scene.add(rim);
const key = new THREE.DirectionalLight(0xffffff, 1.6);
key.position.set(-3, 3, 5);
scene.add(key);

/* ---------- dimensions ---------- */

const W = 1.5, H = 3.1, R = 0.24;

/* ---------- canvas textures ---------- */

function roundedRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Screen: cracked and dark, or lit with the heartbeat line once repaired.
const sc = document.createElement('canvas');
sc.width = 600; sc.height = 1240;
const sx = sc.getContext('2d');
const screenTex = new THREE.CanvasTexture(sc);
screenTex.colorSpace = THREE.SRGBColorSpace;
screenTex.anisotropy = 4;

// A fixed crack pattern from one impact point, lower right.
const cracks = (() => {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const ox = 410, oy = 860, lines = [];
  for (let i = 0; i < 17; i++) {
    const a = (i / 17) * Math.PI * 2 + rnd() * 0.3;
    let x = ox, y = oy, ang = a;
    const pts = [[x, y]];
    const len = 260 + rnd() * 700;
    for (let d = 0; d < len; d += 40 + rnd() * 50) {
      ang += (rnd() - 0.5) * 0.5;
      x += Math.cos(ang) * 50; y += Math.sin(ang) * 50;
      pts.push([x, y]);
    }
    lines.push(pts);
  }
  for (let i = 0; i < 4; i++) {           // rings around the impact
    const rr = 30 + i * 34 + rnd() * 10, pts = [];
    for (let t = 0; t <= 1.001; t += 0.08) {
      const a = t * Math.PI * 2;
      pts.push([ox + Math.cos(a) * rr * (0.9 + rnd() * 0.2), oy + Math.sin(a) * rr * (0.9 + rnd() * 0.2)]);
    }
    lines.push(pts);
  }
  return lines;
})();

const PULSE = [[0, 0.62], [0.36, 0.62], [0.42, 0.62], [0.47, 0.3], [0.54, 0.86], [0.59, 0.5], [0.63, 0.62], [1, 0.62]];

let lastScreenKey = '';
function drawScreen(crack, lit, beat) {
  const k = crack.toFixed(2) + lit.toFixed(2) + beat.toFixed(2);
  if (k === lastScreenKey) return;
  lastScreenKey = k;

  const w = sc.width, h = sc.height;
  sx.clearRect(0, 0, w, h);
  sx.save();
  roundedRectPath(sx, 0, 0, w, h, 78);
  sx.clip();

  sx.fillStyle = '#050707';
  sx.fillRect(0, 0, w, h);

  if (lit > 0) {
    sx.globalAlpha = lit;
    const g = sx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#0e2a24');
    g.addColorStop(1, '#040807');
    sx.fillStyle = g;
    sx.fillRect(0, 0, w, h);

    sx.fillStyle = '#e9f2ef';
    sx.font = '600 44px Geist, system-ui, sans-serif';
    sx.textAlign = 'center';
    sx.fillText('10:41', w / 2, 120);

    // heartbeat line, drawn up to `beat`
    sx.strokeStyle = '#ff5a4a';
    sx.lineWidth = 7;
    sx.lineJoin = 'round';
    sx.beginPath();
    const total = PULSE.length - 1;
    const upto = beat * total;
    for (let i = 0; i <= total; i++) {
      const [px, py] = PULSE[i];
      const X = 60 + px * (w - 120), Y = h * 0.42 + (py - 0.62) * 300;
      if (i === 0) sx.moveTo(X, Y);
      else if (i <= upto) sx.lineTo(X, Y);
      else {
        const [qx, qy] = PULSE[i - 1], f = upto - (i - 1);
        if (f > 0) sx.lineTo(60 + (qx + (px - qx) * f) * (w - 120), h * 0.42 + ((qy + (py - qy) * f) - 0.62) * 300);
        break;
      }
    }
    sx.stroke();

    sx.globalAlpha = lit * Math.min(1, beat * 1.4);
    sx.fillStyle = '#e9f2ef';
    sx.font = '600 64px Geist, system-ui, sans-serif';
    sx.fillText('Repariert.', w / 2, h * 0.62);
    sx.fillStyle = 'rgba(233,242,239,.6)';
    sx.font = '400 30px Geist, system-ui, sans-serif';
    sx.fillText('Handy Chirurg · Potsdam', w / 2, h * 0.62 + 56);
    sx.globalAlpha = 1;
  }

  if (crack > 0) {
    sx.globalAlpha = crack;
    sx.lineCap = 'round';
    for (const pts of cracks) {
      sx.beginPath();
      pts.forEach(([x, y], i) => (i ? sx.lineTo(x, y) : sx.moveTo(x, y)));
      sx.strokeStyle = 'rgba(255,255,255,.55)'; sx.lineWidth = 2.2; sx.stroke();
      sx.strokeStyle = 'rgba(255,255,255,.12)'; sx.lineWidth = 7; sx.stroke();
    }
    sx.globalAlpha = 1;
  }

  // a faint glass reflection across the top
  const r = sx.createLinearGradient(0, 0, w, h * 0.6);
  r.addColorStop(0, 'rgba(255,255,255,.07)');
  r.addColorStop(0.45, 'rgba(255,255,255,0)');
  sx.fillStyle = r;
  sx.fillRect(0, 0, w, h);
  sx.restore();
  screenTex.needsUpdate = true;
}

// Logic board: copper traces on dark green, a few chips drawn flat.
function boardTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = '#0d2a22'; x.fillRect(0, 0, 512, 256);
  let seed = 3;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  x.strokeStyle = '#b8935a'; x.lineWidth = 1.4; x.globalAlpha = 0.75;
  for (let i = 0; i < 70; i++) {
    let px = rnd() * 512, py = rnd() * 256;
    x.beginPath(); x.moveTo(px, py);
    for (let s = 0; s < 3; s++) {
      if (rnd() > 0.5) px += (rnd() - 0.5) * 160; else py += (rnd() - 0.5) * 100;
      x.lineTo(px, py);
    }
    x.stroke();
  }
  x.globalAlpha = 1; x.fillStyle = '#c9a66b';
  for (let i = 0; i < 90; i++) { x.beginPath(); x.arc(rnd() * 512, rnd() * 256, 1.8, 0, 7); x.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function labelTexture(lines, bg, fg) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const x = c.getContext('2d');
  x.fillStyle = bg; x.fillRect(0, 0, 512, 512);
  x.fillStyle = fg; x.font = '500 34px Geist Mono, ui-monospace, monospace';
  lines.forEach((l, i) => x.fillText(l, 40, 90 + i * 52));
  x.strokeStyle = fg; x.globalAlpha = .4; x.lineWidth = 2; x.strokeRect(24, 24, 464, 464);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ---------- materials ---------- */

const titanium = new THREE.MeshPhysicalMaterial({ color: 0x8e9895, metalness: 1, roughness: 0.32 });
const darkMetal = new THREE.MeshPhysicalMaterial({ color: 0x2b3130, metalness: 0.9, roughness: 0.4 });
const glassBlack = new THREE.MeshPhysicalMaterial({ color: 0x050606, metalness: 0, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.03 });
const backGlass = new THREE.MeshPhysicalMaterial({ color: 0x2f7a68, metalness: 0.2, roughness: 0.42, clearcoat: 1, clearcoatRoughness: 0.25 });
const lensGlass = new THREE.MeshPhysicalMaterial({ color: 0x020303, metalness: 0.4, roughness: 0.05, clearcoat: 1 });

/* ---------- parts ---------- */

const phone = new THREE.Group();
scene.add(phone);

function part(name) {
  const g = new THREE.Group();
  g.name = name;
  phone.add(g);
  return g;
}

// display: glass slab with the screen image laid on its face
const display = part('display');
display.add(new THREE.Mesh(new RoundedBoxGeometry(W, H, 0.04, 5, R), glassBlack));
const screen = new THREE.Mesh(
  new THREE.PlaneGeometry(W - 0.09, H - 0.09),
  new THREE.MeshBasicMaterial({ map: screenTex, transparent: true, toneMapped: false })
);
screen.position.z = 0.0205;
display.add(screen);

// mid-frame: a rounded ring, so the parts show through when it is open
const frame = part('frame');
{
  const s = new THREE.Shape();
  const hw = W / 2, hh = H / 2;
  s.moveTo(-hw + R, -hh);
  s.lineTo(hw - R, -hh); s.quadraticCurveTo(hw, -hh, hw, -hh + R);
  s.lineTo(hw, hh - R); s.quadraticCurveTo(hw, hh, hw - R, hh);
  s.lineTo(-hw + R, hh); s.quadraticCurveTo(-hw, hh, -hw, hh - R);
  s.lineTo(-hw, -hh + R); s.quadraticCurveTo(-hw, -hh, -hw + R, -hh);
  const t = 0.055, ir = R - t;
  const hole = new THREE.Path();
  hole.moveTo(-hw + t + ir, -hh + t);
  hole.lineTo(hw - t - ir, -hh + t); hole.quadraticCurveTo(hw - t, -hh + t, hw - t, -hh + t + ir);
  hole.lineTo(hw - t, hh - t - ir); hole.quadraticCurveTo(hw - t, hh - t, hw - t - ir, hh - t);
  hole.lineTo(-hw + t + ir, hh - t); hole.quadraticCurveTo(-hw + t, hh - t, -hw + t, hh - t - ir);
  hole.lineTo(-hw + t, -hh + t + ir); hole.quadraticCurveTo(-hw + t, -hh + t, -hw + t + ir, -hh + t);
  s.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 3, curveSegments: 16 });
  geo.translate(0, 0, -0.05);
  frame.add(new THREE.Mesh(geo, titanium));
  // side buttons
  const btnGeo = new RoundedBoxGeometry(0.03, 0.34, 0.05, 2, 0.012);
  const b1 = new THREE.Mesh(btnGeo, titanium); b1.position.set(hw + 0.02, 0.6, 0); frame.add(b1);
  const b2 = new THREE.Mesh(btnGeo, titanium); b2.position.set(-hw - 0.02, 0.75, 0); frame.add(b2);
  const b3 = new THREE.Mesh(btnGeo, titanium); b3.position.set(-hw - 0.02, 0.3, 0); frame.add(b3);
}

// battery
const battery = part('battery');
{
  const m = new THREE.MeshPhysicalMaterial({ map: labelTexture(['Li-Ion', '3.87 V', '4.323 mAh'], '#1a1f1e', '#9fb3ad'), roughness: 0.55, metalness: 0.2 });
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(W * 0.74, H * 0.5, 0.05, 3, 0.05), [darkMetal, darkMetal, darkMetal, darkMetal, m, darkMetal]);
  battery.add(mesh);
  battery.userData.base = new THREE.Vector3(0.02, -0.42, 0);
}

// logic board with chips
const board = part('board');
{
  const tex = boardTexture();
  const pcb = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, metalness: 0.3 });
  const plain = new THREE.MeshStandardMaterial({ color: 0x0d2a22, roughness: 0.6 });
  board.add(new THREE.Mesh(new RoundedBoxGeometry(W * 0.84, H * 0.3, 0.022, 2, 0.04), [plain, plain, plain, plain, pcb, plain]));
  const chip = new THREE.MeshPhysicalMaterial({ color: 0x111414, roughness: 0.3, metalness: 0.6 });
  [[-0.2, 0.08, 0.36, 0.3], [0.28, -0.12, 0.22, 0.2], [0.3, 0.22, 0.16, 0.12], [-0.38, -0.25, 0.14, 0.14]].forEach(([x, y, w, h]) => {
    const c = new THREE.Mesh(new RoundedBoxGeometry(w, h, 0.03, 2, 0.01), chip);
    c.position.set(x, y, 0.025);
    board.add(c);
  });
  board.userData.base = new THREE.Vector3(0, 0.92, 0);
}

// back glass with camera plateau
const back = part('back');
{
  back.add(new THREE.Mesh(new RoundedBoxGeometry(W, H, 0.04, 5, R), backGlass));
  const plateau = new THREE.Mesh(new RoundedBoxGeometry(0.66, 0.66, 0.05, 4, 0.16), backGlass);
  plateau.position.set(-0.32, 1.08, -0.035);
  back.add(plateau);
  const ringGeo = new THREE.CylinderGeometry(0.125, 0.125, 0.05, 40);
  const lensGeo = new THREE.CylinderGeometry(0.092, 0.092, 0.052, 40);
  [[-0.46, 1.22], [-0.46, 0.94], [-0.2, 1.08]].forEach(([x, y]) => {
    const ring = new THREE.Mesh(ringGeo, titanium);
    ring.rotation.x = Math.PI / 2; ring.position.set(x, y, -0.07);
    const lens = new THREE.Mesh(lensGeo, lensGlass);
    lens.rotation.x = Math.PI / 2; lens.position.set(x, y, -0.074);
    back.add(ring, lens);
  });
}

// assembled z positions, and where each part travels when opened
const LAYOUT = {
  display: { z: 0.07, open: 1.7 },
  board:   { z: 0.0,  open: 0.85 },
  battery: { z: -0.01, open: 0.0 },
  frame:   { z: 0.0,  open: -0.85 },
  back:    { z: -0.07, open: -1.7 }
};
for (const p of phone.children) {
  const b = p.userData.base || new THREE.Vector3();
  p.userData.base = b;
  p.position.copy(b).setZ(LAYOUT[p.name].z);
}

/* ---------- scroll + pointer ---------- */

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

let progress = 0, shown = 0;
let dragYaw = 0, dragTarget = 0, dragging = false, lastX = 0;
let hoverX = 0, hoverY = 0;

function readScroll() {
  const r = stage.getBoundingClientRect();
  const total = r.height - innerHeight;
  progress = clamp(-r.top / total);
  stage.style.setProperty('--p', progress.toFixed(4));
  stage.dataset.scene = progress < 0.15 ? 'hero' : progress > 0.86 ? 'done' : 'mid';
}
addEventListener('scroll', readScroll, { passive: true });

canvas.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', (e) => {
  hoverX = (e.clientX / innerWidth) * 2 - 1;
  hoverY = (e.clientY / innerHeight) * 2 - 1;
  if (!dragging) return;
  dragTarget += (e.clientX - lastX) * 0.012;
  lastX = e.clientX;
});
const endDrag = () => { dragging = false; };
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  // keep the phone a similar share of the screen on tall and wide viewports
  camera.position.z = camera.aspect < 0.75 ? 13.5 : 9;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);

/* ---------- frame ---------- */

const tmp = new THREE.Vector3();
let visible = true;
new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stage);

let t0 = performance.now();
function frameLoop(now) {
  requestAnimationFrame(frameLoop);
  if (!visible) return;
  const dt = Math.min(0.05, (now - t0) / 1000); t0 = now;

  shown = reduced ? progress : lerp(shown, progress, 1 - Math.pow(0.0015, dt));
  const p = shown;
  const portrait = camera.aspect < 0.75;

  const open = smooth(0.16, 0.42, p) * (1 - smooth(0.6, 0.8, p));
  const crack = 1 - smooth(0.62, 0.76, p);
  const lit = smooth(0.74, 0.84, p);
  const beat = smooth(0.8, 0.96, p);

  if (!dragging) dragTarget *= Math.pow(0.08, dt);         // drift back to the story pose
  dragYaw = lerp(dragYaw, dragTarget, 1 - Math.pow(0.0005, dt));

  const idle = reduced ? 0 : Math.sin(now / 2200) * 0.05;
  // pose: turned when broken, three-quarter when open, square when repaired
  const fix = smooth(0.7, 0.92, p);
  const yawClosed = lerp(-0.55, -0.15, fix);
  const yaw = lerp(yawClosed, portrait ? -0.3 : -0.92, open) + dragYaw + idle + hoverX * 0.06;
  const pitch = lerp(0.08, portrait ? 1.0 : 0.28, open) - hoverY * 0.04;
  phone.rotation.set(pitch, yaw, lerp(0.05, 0, fix) + (portrait ? 0 : open * 0.05));
  if (portrait) {
    phone.position.x = 0;
    phone.position.y = lerp(-2.6, 0.2, smooth(0.03, 0.22, p)) + lerp(0, 1.2, smooth(0.8, 0.95, p)) - open * 1.0;
  } else {
    // right of the text when closed, centred-right when open
    phone.position.x = lerp(1.55, 1.0, open);
    phone.position.y = Math.sin(now / 1800) * 0.03;
  }
  phone.scale.setScalar(lerp(portrait ? 0.78 : 0.8, portrait ? 0.62 : 0.76, open));

  for (const part of phone.children) {
    const L = LAYOUT[part.name];
    part.position.z = lerp(L.z, L.open, open);
  }

  drawScreen(crack, lit, beat);
  renderer.render(scene, camera);

  // labels follow their parts
  const rect = canvas.getBoundingClientRect();
  labels.forEach((el, i) => {
    const part = phone.getObjectByName(el.dataset.layer);
    // landscape: alternate labels above and below the parts so they never stack;
    // portrait: to the right of each part
    const b = part.userData.base;
    const below = !portrait && i % 2 === 1;
    tmp.set(portrait ? W / 2 + 0.15 - b.x : 0, portrait ? -b.y : (below ? -H / 2 - 0.12 : H / 2 + 0.22) - b.y, 0);
    part.localToWorld(tmp);
    tmp.project(camera);
    let x = ((tmp.x + 1) / 2) * rect.width;
    const y = ((1 - tmp.y) / 2) * rect.height + (below ? 70 : 0);
    x = Math.min(x, rect.width - el.offsetWidth - 12);
    el.style.transform = `translate(${x}px, ${y}px)`;
    el.style.opacity = smooth(0.32, 0.42, p) * (1 - smooth(0.56, 0.64, p));
  });
}

resize();
readScroll();
document.documentElement.classList.add('webgl-ready');
requestAnimationFrame(frameLoop);
