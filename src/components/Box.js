import * as THREE from 'three';

export class Box {
  constructor(position) {
    const geometry = new THREE.BoxGeometry(1.2, 0.7, 1.2);
    const material = new THREE.MeshToonMaterial({ 
      color: 0xcd853f,
      depthTest: true,
      depthWrite: true,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
    
    // Calcular frustum culling corretamente
    this.mesh.frustumCulled = true;
    this.mesh.matrixAutoUpdate = true;
  }

  getMesh() {
    return this.mesh;
  }
}