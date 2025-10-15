import * as THREE from 'three';

export class Pallet {
  constructor(position) {
    const geometry = new THREE.BoxGeometry(3, 0.3, 3);
    const material = new THREE.MeshToonMaterial({ color: 0x8b5a2b });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
  }

  getMesh() {
    return this.mesh;
  }
}