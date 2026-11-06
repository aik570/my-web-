/* KH 3D — the studio's mark as a real object.
   Built into vendor/kh3d.js (IIFE, window.KH3D) by build.mjs.
   Uses no textures, so it also runs when the page is opened from disk. */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, ExtrudeGeometry,
  MeshPhysicalMaterial, PMREMGenerator, Color, Vector2, ACESFilmicToneMapping,
  SRGBColorSpace, DirectionalLight, MathUtils,
} from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/* The mark exactly as kh-collective.com serves it (favicon.svg, 100×100). */
const KH_PATH = 'M83.599135,10.001802 C80.935712,10.001802 78.7750597,12.1606523 78.7750597,14.8258774 L78.7750597,33.8032167 C78.7750597,40.0851466 73.6824796,45.1777267 67.4005496,45.1777267 L56.200838,45.1777267 C54.3177006,45.1777267 52.6706312,43.9126909 52.1822769,42.0944272 C51.6957246,40.2761634 52.4904266,38.3569852 54.1212777,37.4145155 L74.8952561,25.4219039 C77.2018741,24.0901924 77.992972,21.1402442 76.6612605,18.8318241 C75.329549,16.5252061 72.3796008,15.7341082 70.0711808,17.0658197 L43.1936748,32.583232 C38.6615308,35.1998018 33.0787944,35.1998018 28.5466504,32.583232 C24.0145065,29.9666622 21.2231383,25.1317746 21.2231383,19.898635 L21.2231383,14.8240753 C21.2231383,12.1606523 19.064288,10 16.3990629,10 C13.73564,10 11.5749876,12.1588503 11.5749876,14.8240753 L11.5749876,85.1759247 C11.5749876,87.8393477 13.7338379,90 16.3990629,90 C19.0624859,90 21.2231383,87.8411497 21.2231383,85.1759247 L21.2231383,78.9642745 C21.2231383,73.9654007 23.8901653,69.3467586 28.2186782,66.8473217 C32.5471911,64.3478848 37.8812452,64.3478848 42.2097581,66.8473217 L70.0711808,82.9341803 C70.8298419,83.3720773 71.6605848,83.5811146 72.4787133,83.5811146 C74.1456053,83.5811146 75.7674461,82.7161328 76.6612605,81.1681759 C77.992972,78.8615579 77.2036762,75.9116097 74.8952561,74.5780961 L53.5752579,62.2683245 C52.0110826,61.3654998 51.2488174,59.5238095 51.7155471,57.7794297 C52.1822769,56.0350498 53.7644727,54.8222733 55.5701221,54.8222733 L66.9572465,54.8222733 C73.4842546,54.8222733 78.7768617,60.1130783 78.7768617,66.6418885 L78.7768617,85.1741226 C78.7768617,87.8375456 80.935712,89.998198 83.6009371,89.998198 C86.2661621,89.998198 88.4250124,87.8393477 88.4250124,85.1741226 L88.4250124,14.8222733 C88.4232103,12.1606523 86.262558,10.001802 83.599135,10.001802';

function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

function buildMark(material) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${KH_PATH}"/></svg>`;
  const data = new SVGLoader().parse(svg);
  const shapes = data.paths.flatMap(p => SVGLoader.createShapes(p));
  const geo = new ExtrudeGeometry(shapes, {
    depth: 14, bevelEnabled: true, bevelThickness: 3.2, bevelSize: 2.2, bevelSegments: 10, curveSegments: 48,
  });
  geo.center();
  geo.scale(1, -1, 1);            // SVG y runs down
  geo.computeVertexNormals();
  return new Mesh(geo, material);
}

/**
 * Mount the 3D mark on a canvas.
 * Returns { setColor(hex), setProgress(0..1), destroy() } or null when WebGL is missing.
 */
function mountLogo(canvas, opts = {}) {
  if (!canvas || !supportsWebGL()) return null;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new PerspectiveCamera(30, 1, 1, 2000);
  camera.position.set(0, 0, 330);

  const key = new DirectionalLight(0xffffff, 1.6);
  key.position.set(120, 160, 200);
  scene.add(key);

  const material = new MeshPhysicalMaterial({
    color: new Color(opts.color || '#8f30ff'),
    metalness: 0.15, roughness: 0.12,
    clearcoat: 1, clearcoatRoughness: 0.06,
    iridescence: 0.35, iridescenceIOR: 1.4,
    sheen: 0.4, sheenColor: new Color('#ffffff'),
  });

  const mark = buildMark(material);
  const pivot = new Group();
  pivot.add(mark);
  scene.add(pivot);

  const target = new Color(material.color);
  const mouse = new Vector2(0, 0), tilt = new Vector2(0, 0);
  let progress = 0, shown = 0, running = true, visible = true, raf = 0;
  const t0 = performance.now();

  const onMove = e => {
    const r = canvas.getBoundingClientRect();
    mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
  };
  addEventListener('pointermove', onMove, { passive: true });

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the mark the same visual size on tall phones
    camera.position.z = w / h < 1 ? 330 / Math.max(w / h, 0.55) : 330;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && running && !raf) loop(); });
  io.observe(canvas);

  function loop() {
    raf = 0;
    if (!running || !visible) return;
    const t = (performance.now() - t0) / 1000;
    shown = MathUtils.lerp(shown, 1, 0.04);
    tilt.lerp(mouse, 0.06);
    material.color.lerp(target, 0.06);

    const idle = reduce ? 0 : 1;
    pivot.rotation.y = tilt.x * 0.55 + Math.sin(t * 0.6) * 0.18 * idle + progress * Math.PI * 1.25;
    pivot.rotation.x = tilt.y * 0.35 + Math.cos(t * 0.5) * 0.08 * idle + progress * 0.5;
    pivot.rotation.z = Math.sin(t * 0.4) * 0.04 * idle;
    pivot.position.y = Math.sin(t * 1.1) * 3 * idle + progress * 40;
    const s = (0.6 + 0.4 * easeOut(shown)) * (1 - progress * 0.35);
    pivot.scale.setScalar(s);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  loop();

  return {
    setColor(hex) { target.set(hex); },
    setProgress(p) { progress = MathUtils.clamp(p, 0, 1); },
    destroy() {
      running = false; cancelAnimationFrame(raf);
      removeEventListener('pointermove', onMove);
      ro.disconnect(); io.disconnect();
      mark.geometry.dispose(); material.dispose(); pmrem.dispose(); renderer.dispose();
    },
  };
}

function easeOut(x) { return 1 - Math.pow(1 - x, 3); }

window.KH3D = { mountLogo, supportsWebGL };
