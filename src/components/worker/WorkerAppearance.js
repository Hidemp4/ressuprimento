// WorkerAppearance.js
import * as THREE from 'three';

export class WorkerAppearance {
  static createBody() {
    const randomValue = Math.random() * 100;
    let bodyMaterial;
    let hasWhiteShirt = false;

    if (randomValue < 1) {
      // 1% - corpo verde musgo escuro + camisa branca
      bodyMaterial = new THREE.MeshToonMaterial({ color: 0x3d4d3d });
      hasWhiteShirt = true;
    } else if (randomValue < 21) {
      // 20% - corpo vermelho sangue vibrante
      bodyMaterial = new THREE.MeshToonMaterial({ color: 0xc41e3a });
    } else {
      // 79% - corpo azul cobalto
      bodyMaterial = new THREE.MeshToonMaterial({ color: 0x0047ab });
    }

    const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.45, 1.5, 8);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;

    return { body, bodyMaterial, hasWhiteShirt };
  }

  static createShirt() {
    const shirtGeometry = new THREE.BoxGeometry(0.85, 0.5, 0.5);
    const shirtMaterial = new THREE.MeshToonMaterial({ color: 0xffffff });
    const shirt = new THREE.Mesh(shirtGeometry, shirtMaterial);
    shirt.position.y = 1.1;
    return shirt;
  }

  static createHead() {
    const headGeometry = new THREE.SphereGeometry(0.35, 8, 8);
    const headMaterial = new THREE.MeshToonMaterial({ color: 0xffd1a4 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.7;
    return head;
  }

  static createRandomHair() {
    const type = Math.floor(Math.random() * 4);
    const hairColor = new THREE.Color().setHSL(Math.random(), 0.5, 0.3);
    const mat = new THREE.MeshToonMaterial({ color: hairColor });
    let hair;

    switch (type) {
      case 0: {
        // Cabelo hemisférico
        const geo = new THREE.SphereGeometry(0.38, 6, 6, 0, Math.PI * 2, 0, Math.PI / 2);
        hair = new THREE.Mesh(geo, mat);
        break;
      }
      case 1: {
        // Cabelo tipo boné/chapéu
        const geo = new THREE.BoxGeometry(0.5, 0.25, 0.5);
        hair = new THREE.Mesh(geo, mat);
        hair.position.y += 0.05;
        break;
      }
      case 2: {
        // Cabelo "espetado" com vários segmentos
        hair = new THREE.Group();
        const segGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 6);
        for (let i = -2; i <= 2; i++) {
          const seg = new THREE.Mesh(segGeo, mat);
          seg.rotation.z = Math.PI / 2;
          seg.position.set(0, 0.05, i * 0.08);
          hair.add(seg);
        }
        break;
      }
      default: {
        // Cabelo tipo coque/bola
        const geo = new THREE.SphereGeometry(0.18, 8, 8);
        hair = new THREE.Mesh(geo, mat);
        hair.position.set(0, 0.25, -0.05);
        break;
      }
    }

    hair.position.y = 1.95;
    return hair;
  }
}