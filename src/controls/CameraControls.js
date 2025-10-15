export class CameraControls {
  constructor(camera, canvas) {
    this.camera = camera;
    this.canvas = canvas;
    this.mouseDown = false;
    this.mouseX = 0;
    this.mouseY = 0;
    
    // Posição fixa da câmera
    this.fixedPosition = { x: -19, y: 15, z: 24 };
    
    // Offset de pan (movimento lateral e vertical)
    this.panX = 0;
    this.panY = 0;
    
    // Target que a câmera olha (move com o pan)
    this.targetX = 0;
    this.targetY = 0;
    this.targetZ = 0;
    
    // Limites de pan
    this.panLimitX = 15;
    this.panLimitY = 10;
    
    this.setupEventListeners(canvas);
    this.updateCamera();
  }

  setupEventListeners(canvas) {
    canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    canvas.addEventListener('mouseup', () => this.onMouseUp());
    canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
  }

  onMouseDown(e) {
    this.mouseDown = true;
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  onMouseMove(e) {
    if (!this.mouseDown) return;

    const deltaX = e.clientX - this.mouseX;
    const deltaY = e.clientY - this.mouseY;

    // Pan horizontal (X) - move target para esquerda/direita
    this.panX += deltaX * 0.05;
    
    // Pan vertical (Y) - move target para cima/baixo
    this.panY -= deltaY * 0.05;

    // Aplicar limites
    this.panX = Math.max(-this.panLimitX, Math.min(this.panLimitX, this.panX));
    this.panY = Math.max(-this.panLimitY, Math.min(this.panLimitY, this.panY));

    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    this.updateCamera();
  }

  onMouseUp() {
    this.mouseDown = false;
  }

  onWheel(e) {
    e.preventDefault();
    // Zoom desabilitado - câmera fica fixa
  }

  updateCamera() {
    // Câmera mantém posição fixa, apenas aplica os offsets de pan
    this.camera.position.x = this.fixedPosition.x + this.panX;
    this.camera.position.y = this.fixedPosition.y + this.panY;
    this.camera.position.z = this.fixedPosition.z;

    // Target (ponto que a câmera olha) também se move com o pan
    this.targetX = this.panX;
    this.targetY = this.panY;
    this.targetZ = 0;

    // Câmera olha para o target móvel
    this.camera.lookAt(this.targetX, this.targetY, this.targetZ);
  }
}