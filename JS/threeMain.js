import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
const container = document.getElementById("aboutThree");
const width = container.clientWidth || 400;
const height = container.clientHeight || 420;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

const geometry = new THREE.TorusGeometry(20, 4, 64, 200);
const material = new THREE.MeshPhysicalMaterial({
  color: 0x5982eb,
  metalness: 0.6,
  roughness: 0.2,
  emissive: 0x1a2d6b,
  emissiveIntensity: 0.3,
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
dirLight.position.set(40, 60, 40);
scene.add(dirLight);
const fillLight = new THREE.DirectionalLight(0x5982eb, 1.2);
fillLight.position.set(-40, -20, -20);
scene.add(fillLight);
const ambLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambLight);
const pointLight = new THREE.PointLight(0xb4d4ff, 1.5, 200);
pointLight.position.set(0, 0, 60);
scene.add(pointLight);

camera.position.set(50, 0, 50);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 8;
controls.enableRotate = false;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
