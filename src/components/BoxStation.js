import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export class BoxStation {
  /**
   * Construtor da Caixa (menor)
   * @param {THREE.Vector3} position - Posição inicial da caixa
   * @param {THREE.Texture} texture - Textura de papelão pré-carregada
   */
  constructor(position, texture) {
 
    // Geometria Opcional (bordas suaves)
    const geometry = new RoundedBoxGeometry(
      0.6,  // width
      0.4,  // height
      0.6,  // depth
      4,    // segments
      0.07  // radius
    );
    
    
    // Material PBR que reage à luz e sombras
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      color: 0xC08F4F,
      roughness: 0.9,
      metalness: 0.0
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);

    // Habilita sombras
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  getMesh() {
    return this.mesh;
  }
}