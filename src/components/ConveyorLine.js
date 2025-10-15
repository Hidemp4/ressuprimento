import * as THREE from 'three';

export class ConveyorLine {
  constructor(position = new THREE.Vector3(0, 0, 0), length = 10, width = 2) {
    const geometry = new THREE.BoxGeometry(length, 0.5, width);
    const material = new THREE.MeshToonMaterial({ color: 0x555555 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
  }

  getMesh() {
    return this.mesh;
  }
}