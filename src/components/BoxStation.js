import * as THREE from 'three';

export class BoxStation {
  constructor(position) {
    const geometry = new THREE.BoxGeometry(0.6, 0.4, 0.6);
    const material = new THREE.MeshToonMaterial({ color: 0xcd853f });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
  }

  getMesh() {
    return this.mesh;
  }
}