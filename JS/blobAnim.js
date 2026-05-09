(function () {
    const bc = document.getElementById("blobCanvas");
    if (!bc) return;

    const bctx = bc.getContext("2d");
    if (!bctx) return;

    function resize() {
      const pixelRatio = window.devicePixelRatio || 1;
      const width = bc.offsetWidth;
      const height = bc.offsetHeight;

      bc.width = width * pixelRatio;
      bc.height = height * pixelRatio;
      bctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function smoothNoise(angle, t, harmonics) {
      let v = 0;
      harmonics.forEach(([freq, amp, speed, phase]) => {
        v += amp * Math.sin(freq * angle + speed * t + phase);
      });
      return v;
    }
    function catmullRomPath(ctx, pts) {
      ctx.beginPath();
      const n = pts.length;
      for (let i = 0; i < n; i++) {
        const p0 = pts[(i-1+n)%n], p1 = pts[i],
              p2 = pts[(i+1)%n],   p3 = pts[(i+2)%n];
        if (i === 0) ctx.moveTo(p1[0], p1[1]);
        ctx.bezierCurveTo(
          p1[0]+(p2[0]-p0[0])/6, p1[1]+(p2[1]-p0[1])/6,
          p2[0]-(p3[0]-p1[0])/6, p2[1]-(p3[1]-p1[1])/6,
          p2[0], p2[1]
        );
      }
      ctx.closePath();
    }

    const harmonics = [
      [2, 0.09, 0.40, 0.00],[3, 0.07, 0.55, 1.20],
      [4, 0.05, 0.30, 2.50],[5, 0.04, 0.70, 0.80],
      [6, 0.03, 0.50, 3.10],[7, 0.02, 0.90, 1.70],
      [9, 0.015,0.60, 4.20],
    ];
    const NUM_POINTS = 48;
    let t = 0;

    function drawBlob() {
      const W = bc.offsetWidth, H = bc.offsetHeight;
      bctx.clearRect(0, 0, W, H);
      // Blob sits right of center as a visual counterweight to left-aligned text.
      const cx = W * 0.68, cy = H * 0.50;
      const baseR = Math.min(W, H) * 0.52;
      const pts = [];
      for (let i = 0; i < NUM_POINTS; i++) {
        const angle = (i / NUM_POINTS) * Math.PI * 2;
        const noise = smoothNoise(angle, t, harmonics);
        const r = baseR * (1 + noise);
        pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
      }
      catmullRomPath(bctx, pts);
      const grad = bctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 1.3);
      grad.addColorStop(0.00, "rgba(89,130,235,0.28)");
      grad.addColorStop(0.25, "rgba(75,115,225,0.20)");
      grad.addColorStop(0.55, "rgba(60,95,210,0.12)");
      grad.addColorStop(0.80, "rgba(50,80,195,0.05)");
      grad.addColorStop(1.00, "rgba(40,65,180,0.00)");
      bctx.fillStyle = grad;
      bctx.fill();
      catmullRomPath(bctx, pts);
      bctx.strokeStyle = "rgba(120,170,255,0.12)";
      bctx.lineWidth = 1.5;
      bctx.stroke();
      t += 0.012;
      requestAnimationFrame(drawBlob);
    }
    drawBlob();
})();
