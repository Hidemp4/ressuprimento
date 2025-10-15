import * as THREE from 'three';

export class Renderer {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0xe0e0e0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
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