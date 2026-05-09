const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let spots = [];
const mouse = { x: undefined, y: undefined };
window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  for (let i = 0; i < 2; i++) spots.push(new Particle());
});
class Particle {
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 2 + 0.3;
    this.speedX = Math.random() * 2 - 2;
    this.speedY = Math.random() * 2 - 2;
    this.color = "#efefef";
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.3) this.size -= 0.01;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
function handleParticle() {
  for (let i = 0; i < spots.length; i++) {
    spots[i].update();
    spots[i].draw();
    for (let j = i; j < spots.length; j++) {
      const dx = spots[i].x - spots[j].x,
        dy = spots[i].y - spots[j].y;
      if (Math.sqrt(dx * dx + dy * dy) < 90) {
        ctx.beginPath();
        ctx.strokeStyle = spots[i].color;
        ctx.linewidth = spots[i].size / 80;
        ctx.moveTo(spots[i].x, spots[i].y);
        ctx.lineTo(spots[j].x, spots[j].y);
        ctx.stroke();
      }
    }
    if (spots[i].size <= 1) {
      spots.splice(i, 1);
      i--;
    }
  }
}
function animateTrail() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleParticle();
  requestAnimationFrame(animateTrail);
}
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
window.addEventListener("mouseout", () => {
  mouse.x = undefined;
  mouse.y = undefined;
});
animateTrail();
