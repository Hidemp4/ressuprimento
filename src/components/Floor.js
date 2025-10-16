import * as THREE from 'three';

export class Floor {
  constructor() {
    const geometry = new THREE.PlaneGeometry(180, 100);
    const material = new THREE.MeshToonMaterial({ 
      color: 0xc1c1c1,
      depthTest: true,
      depthWrite: true,
      polygonOffset: true,
      polygonOffsetFactor: 2, // Empurra o chão mais para trás no depth buffer
      polygonOffsetUnits: 2
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.y = -0.01; // Abaixa levemente o chão para evitar z-fighting
    this.mesh.renderOrder = -1; // Renderiza primeiro (antes de tudo)
    this.mesh.frustumCulled = false; // Chão sempre visível
    this.mesh.matrixAutoUpdate = true;
  }

  getMesh() {
    return this.mesh;
  }
}