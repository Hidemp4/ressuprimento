import * as THREE from 'three';

export class Box {
  constructor(position) {
    const geometry = new THREE.BoxGeometry(1.2, 0.7, 1.2);
    const material = new THREE.MeshToonMaterial({ color: 0xcd853f });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
  }

  getMesh() {
    return this.mesh;
  }
}