import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export class Box {
  /**
   * Construtor da Caixa
   * @param {THREE.Vector3} position - Posição inicial da caixa
   * @param {THREE.Texture} texture - Textura de papelão pré-carregada
   */
  constructor(position, texture) {
    // Geometria Opcional (bordas suaves)
    const geometry = new RoundedBoxGeometry(
      1.2,  // width
      0.7,  // height
      1.2,  // depth
      4,    // segments
      0.07  // radius (raio do arredondamento)
    );
    

    // Material PBR que reage à luz e sombras
    const material = new THREE.MeshStandardMaterial({
      map: texture,      // Aplica a textura de papelão
      color: 0xC08F4F,   // Cor base (marrom) para não "manchar" a textura
      roughness: 0.9,    // Papelão é bem fosco (0 = espelho, 1 = fosco)
      metalness: 0.0     // Papelão não é metálico
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);

    // Habilita sombras
    this.mesh.castShadow = true;    // Esta caixa projeta sombras
    this.mesh.receiveShadow = true; // Esta caixa recebe sombras de outros objetos
  }

  getMesh() {
    return this.mesh;
  }
}