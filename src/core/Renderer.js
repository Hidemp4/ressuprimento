import * as THREE from 'three';

export class Renderer {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      logarithmicDepthBuffer: true // Melhora precisão do depth buffer
    });
    this.renderer.setClearColor(0xe0e0e0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    // Habilita ordenação de objetos e depth testing
    this.renderer.sortObjects = true;
    this.renderer.shadowMap.enabled = true; // Desabilitar se não usar sombras
    
    document.body.appendChild(this.renderer.domElement);
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
  }

  setSize(width, height) {
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  getCanvas() {
    return this.renderer.domElement;
  }
}