import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
const canvas = document.querySelector(".webGl") as HTMLCanvasElement;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/texttures/matcaps/3.jpeg");

// scene
const scene = new THREE.Scene();

/**
 * fonts
 */
const fontLoader = new FontLoader();

fontLoader.load("fonts/helvetiker_regular.typeface.json", (font) => {
  console.log(font);
  const textGeometry = new TextGeometry("Hello World", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  textGeometry.center();
  scene.add(text);
});

const torusGeomentry = new THREE.TorusGeometry(0.3, 0.2, 16, 45);
const torusMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

for (let i = 0; i < 100; i++) {
  const torus = new THREE.Mesh(torusGeomentry, torusMaterial);
  torus.position.set(
    Math.random() * 10 - 5,
    Math.random() * 10 - 5,
    Math.random() * 10 - 5
  );

  torus.rotation.x = Math.random() * Math.PI;
  torus.rotation.y = Math.random() * Math.PI;

  const scale = Math.random() * 2;
  torus.scale.set(scale, scale, scale);
  scene.add(torus);
}

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
window.addEventListener("dblclick", () => {
  // 兼容safari
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas?.requestFullscreen();
    } else if (canvas.webkitFullscreenElement) {
      canvas?.webkitFullscreenElement();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});
// animations
const tick = () => {
  requestAnimationFrame(tick);
  controls.update();
  renderer.render(scene, camera);
};
tick();
