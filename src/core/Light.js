import * as THREE from 'three';

export class Light {
  constructor(scene) {
    this.ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.directional = new THREE.DirectionalLight(0xffffff, 0.8);
    this.directional.position.set(10, 20, 10);
    
    scene.add(this.ambient);
    scene.add(this.directional);
  }
}