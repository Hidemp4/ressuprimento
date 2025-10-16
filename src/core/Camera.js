import * as THREE from 'three';

export class Camera {
  constructor(width, height) {
    const aspect = width / height;
    const d = 20;
    
    this.camera = new THREE.OrthographicCamera(
      -d * aspect, d * aspect, d, -d, 
      0.1, // near plane - mais próximo para evitar clipping
      2000 // far plane - aumentado para cobrir toda a cena
    );
    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(0, 0, 0);
  }

  getCamera() {
    return this.camera;
  }

  updateAspect(width, height) {
    const d = 20;
    const aspect = width / height;
    this.camera.left = -d * aspect;
    this.camera.right = d * aspect;
    this.camera.top = d;
    this.camera.bottom = -d;
    this.camera.updateProjectionMatrix();
  }
}