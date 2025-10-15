import * as THREE from 'three';

export class Scene {
  constructor() {
    this.scene = new THREE.Scene();
  }

  getScene() {
    return this.scene;
  }

  add(object) {
    this.scene.add(object);
  }

  addMultiple(objects) {
    objects.forEach(obj => this.scene.add(obj));
  }
}