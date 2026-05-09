import * as THREE from "three";

window.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("aboutThree");
  if (!container) return;

  let W = container.clientWidth || 600;
  let H = container.clientHeight || 500;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 2000);
  camera.position.set(0, 0, 145);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  /* ── GLOBE ── */
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(30, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xd0e8ff,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    }),
  );
  scene.add(globe);
  scene.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(29, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xa8d4ff,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
      }),
    ),
  );

  /* ── FLOATING PARTICLES ── */
  const PC = 280;
  const pPos = new Float32Array(PC * 3);
  const pSpd = [];
  for (let i = 0; i < PC; i++) {
    const r = 32 + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pPos[i * 3 + 2] = r * Math.cos(phi);
    pSpd.push({
      r,
      theta,
      phi,
      dt: (Math.random() - 0.5) * 0.003,
      dp: (Math.random() - 0.5) * 0.002,
    });
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  scene.add(
    new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0xe8f4ff,
        size: 0.55,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true,
      }),
    ),
  );

  /* ── ORBIT RINGS ── */
  const ringDefs = [
    { r: 42, tx: Math.PI / 2, tz: 0, op: 0.09 },
    { r: 44, tx: Math.PI / 3, tz: Math.PI / 6, op: 0.07 },
    { r: 40, tx: Math.PI / 6, tz: -Math.PI / 4, op: 0.07 },
    { r: 43, tx: Math.PI * 0.8, tz: Math.PI / 3, op: 0.06 },
    { r: 41, tx: Math.PI / 4, tz: Math.PI / 2, op: 0.07 },
    { r: 45, tx: Math.PI * 0.6, tz: Math.PI / 5, op: 0.06 },
    { r: 43, tx: Math.PI * 0.4, tz: -Math.PI / 3, op: 0.06 },
    { r: 44, tx: Math.PI * 0.35, tz: -Math.PI / 5, op: 0.05 },
    { r: 42, tx: Math.PI * 0.55, tz: Math.PI * 0.6, op: 0.05 },
    { r: 45, tx: Math.PI * 0.9, tz: Math.PI / 7, op: 0.06 },
    { r: 41, tx: Math.PI * 0.45, tz: -Math.PI * 0.4, op: 0.05 },
  ];
  ringDefs.forEach((d) => {
    const m = new THREE.Mesh(
      new THREE.TorusGeometry(d.r, 0.09, 6, 128),
      new THREE.MeshBasicMaterial({
        color: 0xd0e8ff,
        transparent: true,
        opacity: d.op + 0.07,
        depthWrite: false,
      }),
    );
    m.rotation.x = d.tx;
    m.rotation.z = d.tz;
    scene.add(m);
  });

  /* ── ICON CANVAS HELPER ── */
  function makeIconTex(label, color, bg) {
    const sz = 128;
    const c = document.createElement("canvas");
    c.width = c.height = sz;
    const cx = c.getContext("2d");
    cx.beginPath();
    cx.arc(sz / 2, sz / 2, sz / 2 - 2, 0, Math.PI * 2);
    cx.fillStyle = bg;
    cx.fill();
    cx.beginPath();
    cx.arc(sz / 2, sz / 2, sz / 2 - 3, 0, Math.PI * 2);
    cx.strokeStyle = color;
    cx.lineWidth = 3;
    cx.stroke();
    const lines = label.split("\n");
    const fSize = lines.length > 1 ? 18 : 22;
    const lh = 22;
    cx.fillStyle = color;
    cx.textAlign = "center";
    cx.textBaseline = "middle";
    cx.font = `bold ${fSize}px Arial`;
    lines.forEach((ln, i) => {
      const yo = lines.length > 1 ? (i - (lines.length - 1) / 2) * lh : 0;
      cx.fillText(ln, sz / 2, sz / 2 + yo);
    });
    return new THREE.CanvasTexture(c);
  }

  function makeHaloTex(color) {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const cx = c.getContext("2d");
    const g = cx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, color + "55");
    g.addColorStop(0.5, color + "22");
    g.addColorStop(1, color + "00");
    cx.fillStyle = g;
    cx.beginPath();
    cx.arc(32, 32, 32, 0, Math.PI * 2);
    cx.fill();
    return new THREE.CanvasTexture(c);
  }

  /* ── SATELLITES ── */
  const satDefs = [
    {
      label: "ROS/ROS2",
      color: "#22c55e",
      bg: "rgba(10,30,15,0.92)",
      orbitR: 42,
      speed: 0.3,
      tx: Math.PI / 2,
      tz: 0,
      off: 0,
    },
    {
      label: "C++",
      color: "#60a5fa",
      bg: "rgba(10,15,35,0.92)",
      orbitR: 44,
      speed: 0.22,
      tx: Math.PI / 3,
      tz: Math.PI / 6,
      off: Math.PI * 0.5,
    },
    {
      label: "Python",
      color: "#facc15",
      bg: "rgba(30,25,5,0.92)",
      orbitR: 40,
      speed: 0.35,
      tx: Math.PI / 6,
      tz: -Math.PI / 4,
      off: Math.PI,
    },
    {
      label: ".NET",
      color: "#a78bfa",
      bg: "rgba(20,10,35,0.92)",
      orbitR: 43,
      speed: 0.26,
      tx: Math.PI * 0.8,
      tz: Math.PI / 3,
      off: Math.PI * 1.5,
    },
    {
      label: "IoT",
      color: "#fb923c",
      bg: "rgba(30,15,5,0.92)",
      orbitR: 41,
      speed: 0.32,
      tx: Math.PI / 4,
      tz: Math.PI / 2,
      off: Math.PI * 0.75,
    },
    {
      label: "Matlab",
      color: "#f97316",
      bg: "rgba(30,15,0,0.92)",
      orbitR: 45,
      speed: 0.28,
      tx: Math.PI * 0.6,
      tz: Math.PI / 5,
      off: Math.PI * 0.3,
    },
    {
      label: "ML",
      color: "#34d399",
      bg: "rgba(5,25,15,0.92)",
      orbitR: 43,
      speed: 0.33,
      tx: Math.PI * 0.4,
      tz: -Math.PI / 3,
      off: Math.PI * 1.1,
    },
    {
      label: "Deep\nLrn",
      color: "#22d3ee",
      bg: "rgba(5,20,30,0.92)",
      orbitR: 41,
      speed: 0.25,
      tx: Math.PI * 0.7,
      tz: Math.PI / 4,
      off: Math.PI * 0.6,
    },
    {
      label: "RL",
      color: "#f472b6",
      bg: "rgba(30,5,20,0.92)",
      orbitR: 44,
      speed: 0.38,
      tx: Math.PI * 0.35,
      tz: -Math.PI / 5,
      off: Math.PI * 1.8,
    },
    {
      label: "Sys\nModel",
      color: "#94a3b8",
      bg: "rgba(15,18,25,0.92)",
      orbitR: 42,
      speed: 0.2,
      tx: Math.PI * 0.55,
      tz: Math.PI * 0.6,
      off: Math.PI * 2.1,
    },
    {
      label: "SysID",
      color: "#fbbf24",
      bg: "rgba(30,22,0,0.92)",
      orbitR: 43,
      speed: 0.29,
      tx: Math.PI * 0.15,
      tz: -Math.PI / 6,
      off: Math.PI * 0.9,
    },
    {
      label: "Control",
      color: "#818cf8",
      bg: "rgba(15,10,35,0.92)",
      orbitR: 45,
      speed: 0.24,
      tx: Math.PI * 0.9,
      tz: Math.PI / 7,
      off: Math.PI * 1.4,
    },
    {
      label: "Digital\nTwin",
      color: "#2dd4bf",
      bg: "rgba(5,25,22,0.92)",
      orbitR: 41,
      speed: 0.31,
      tx: Math.PI * 0.45,
      tz: -Math.PI * 0.4,
      off: Math.PI * 2.5,
    },
    {
      label: "C#",
      color: "#9b59b6",
      bg: "rgba(20,8,30,0.92)",
      orbitR: 44,
      speed: 0.27,
      tx: Math.PI * 0.25,
      tz: Math.PI * 0.5,
      off: Math.PI * 0.4,
    },
    {
      label: "Java",
      color: "#e74c3c",
      bg: "rgba(30,5,5,0.92)",
      orbitR: 42,
      speed: 0.23,
      tx: Math.PI * 0.65,
      tz: -Math.PI * 0.3,
      off: Math.PI * 1.7,
    },
  ];

  const tmpV = new THREE.Vector3();
  const satMeshes = satDefs.map((d) => {
    const mesh = new THREE.Mesh(
      new THREE.CircleGeometry(4, 32),
      new THREE.MeshBasicMaterial({
        map: makeIconTex(d.label, d.color, d.bg),
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    const halo = new THREE.Mesh(
      new THREE.CircleGeometry(5.5, 32),
      new THREE.MeshBasicMaterial({
        map: makeHaloTex(d.color),
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    scene.add(mesh);
    scene.add(halo);
    return {
      mesh,
      halo,
      angle: d.off,
      orbitR: d.orbitR,
      speed: d.speed,
      tx: d.tx,
      tz: d.tz,
    };
  });

  /* ── LIGHTS ── */
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dl = new THREE.DirectionalLight(0x7ba7ff, 1.2);
  dl.position.set(60, 80, 60);
  scene.add(dl);

  /* ── RAYCASTER ── */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(-999, -999);
  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / W) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / H) * 2 + 1;
  });
  container.addEventListener("mouseleave", () => pointer.set(-999, -999));

  /* ── RESIZE ── */
  window.addEventListener("resize", () => {
    W = container.clientWidth;
    H = container.clientHeight;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  });

  /* ── ANIMATE ── */
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.006;

    globe.rotation.y = t * 0.3;
    globe.rotation.x = t * 0.08;

    for (let i = 0; i < PC; i++) {
      const s = pSpd[i];
      s.theta += s.dt;
      s.phi += s.dp;
      if (s.phi < 0.1 || s.phi > Math.PI - 0.1) s.dp *= -1;
      pPos[i * 3] = s.r * Math.sin(s.phi) * Math.cos(s.theta);
      pPos[i * 3 + 1] = s.r * Math.sin(s.phi) * Math.sin(s.theta);
      pPos[i * 3 + 2] = s.r * Math.cos(s.phi);
    }
    pGeo.attributes.position.needsUpdate = true;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(satMeshes.map((s) => s.mesh));
    const hovered = hits.length > 0 ? hits[0].object : null;

    satMeshes.forEach((s) => {
      s.angle += s.speed * 0.01;
      const lx = s.orbitR * Math.cos(s.angle);
      const ly = s.orbitR * Math.sin(s.angle);
      const cx2 = lx;
      const cy2 = ly * Math.cos(s.tx);
      const cz2 = ly * Math.sin(s.tx);
      const fx = cx2 * Math.cos(s.tz) - cy2 * Math.sin(s.tz);
      const fy = cx2 * Math.sin(s.tz) + cy2 * Math.cos(s.tz);
      const fz = cz2;
      s.mesh.position.set(fx, fy, fz);
      s.halo.position.set(fx, fy, fz);
      s.mesh.lookAt(camera.position);
      s.halo.lookAt(camera.position);
      const isHov = s.mesh === hovered;
      const ts = isHov ? 1.5 : 1.0;
      tmpV.set(ts, ts, ts);
      s.mesh.scale.lerp(tmpV, 0.12);
      s.halo.scale.lerp(tmpV, 0.12);
      s.mesh.material.opacity = isHov ? 1.0 : 0.92;
    });

    renderer.render(scene, camera);
  }
  animate();
});
