import * as THREE from 'three';

export class Floor {
  constructor() {
    const geometry = new THREE.PlaneGeometry(160, 100);
    const material = new THREE.MeshToonMaterial({ color: 0xc1c1c1 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2;
  }

  getMesh() {
    return this.mesh;
  }
}