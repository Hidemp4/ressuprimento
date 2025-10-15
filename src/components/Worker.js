import * as THREE from 'three';

export class Worker {
  constructor(position) {
    this.group = new THREE.Group();
    
    const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 8);
    const bodyMaterial = new THREE.MeshToonMaterial({ color: 0x1e90ff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    
    const headGeometry = new THREE.SphereGeometry(0.35, 8, 8);  
    const headMaterial = new THREE.MeshToonMaterial({ color: 0xffd1a4 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    
    body.position.y = 0.75;
    head.position.y = 1.8;
    
    this.group.add(body);
    this.group.add(head);
    this.group.position.copy(position);
  }

  getMesh() {
    return this.group;
  }
}