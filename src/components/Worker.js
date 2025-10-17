// Worker.js
import * as THREE from 'three';

export class Worker {
  constructor(position) {
    this.group = new THREE.Group();

    // --- Definir cor do corpo com base na métrica ---
    const randomValue = Math.random() * 100;
    let bodyMaterial;

    if (randomValue < 1) {
      // 1% - corpo verde escuro + camisa branca
      bodyMaterial = new THREE.MeshToonMaterial({ color: 0x013220 }); // verde escuro
      this.hasWhiteShirt = true;
    } else if (randomValue < 21) {
      // 20% - corpo vermelho
      bodyMaterial = new THREE.MeshToonMaterial({ color: 0xb22222 }); // vermelho
      this.hasWhiteShirt = false;
    } else {
      // 79% - corpo azul royal
      bodyMaterial = new THREE.MeshToonMaterial({ color: 0x1e90ff }); // azul royal
      this.hasWhiteShirt = false;
    }

    // --- Corpo ---
    const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.45, 1.5, 8);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;

    // --- Camisa branca (apenas para verde especial) ---
    if (this.hasWhiteShirt) {
      const shirtGeometry = new THREE.BoxGeometry(0.85, 0.5, 0.5);
      const shirtMaterial = new THREE.MeshToonMaterial({ color: 0xffffff });
      const shirt = new THREE.Mesh(shirtGeometry, shirtMaterial);
      shirt.position.y = 1.1;
      this.group.add(shirt);
    }

    // --- Cabeça ---
    const headGeometry = new THREE.SphereGeometry(0.35, 8, 8);
    const headMaterial = new THREE.MeshToonMaterial({ color: 0xffd1a4 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.7;

    // --- Cabelo ---
    const hair = this.createRandomHair();
    hair.position.y = 1.95;

    this.group.add(body, head, hair);

    // --- Braços ---
    const armGeom = new THREE.BoxGeometry(0.18, 0.8, 0.18);
    const armMat = bodyMaterial.clone();

    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-0.5, 1.15, 0);
    const leftArm = new THREE.Mesh(armGeom, armMat);
    leftArm.position.set(0, -0.4, 0);
    leftArmPivot.add(leftArm);
    this.leftArmPivot = leftArmPivot;

    const rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(0.5, 1.15, 0);
    const rightArm = new THREE.Mesh(armGeom, armMat);
    rightArm.position.set(0, -0.4, 0);
    rightArmPivot.add(rightArm);
    this.rightArmPivot = rightArmPivot;

    this.group.add(leftArmPivot, rightArmPivot);

    // --- Pernas ---
    const legGeom = new THREE.BoxGeometry(0.20, 0.7, 0.22);
    const legMat = new THREE.MeshToonMaterial({ color: 0x2f4f4f });

    const leftLegPivot = new THREE.Group();
    leftLegPivot.position.set(-0.18, 0.05, 0);
    const leftLeg = new THREE.Mesh(legGeom, legMat);
    leftLeg.position.set(0, -0.45, 0);
    leftLegPivot.add(leftLeg);
    this.leftLegPivot = leftLegPivot;

    const rightLegPivot = new THREE.Group();
    rightLegPivot.position.set(0.18, 0.05, 0);
    const rightLeg = new THREE.Mesh(legGeom, legMat);
    rightLeg.position.set(0, -0.45, 0);
    rightLegPivot.add(rightLeg);
    this.rightLegPivot = rightLegPivot;

    this.group.add(leftLegPivot, rightLegPivot);

    // --- Movimento ---
    this.group.position.copy(position);
    this.speed = 0.03;
    this.target = null;
    this.isMoving = false;
    this.homePosition = position.clone();
    this._moveStartTime = 0;

    this.startMovementCycle();
  }

  // --- Cria cabelo aleatório ---
  createRandomHair() {
    const type = Math.floor(Math.random() * 4);
    const hairColor = new THREE.Color().setHSL(Math.random(), 0.5, 0.3);
    const mat = new THREE.MeshToonMaterial({ color: hairColor });
    let hair;

    switch (type) {
      case 0: {
        const geo = new THREE.SphereGeometry(0.38, 6, 6, 0, Math.PI * 2, 0, Math.PI / 2);
        hair = new THREE.Mesh(geo, mat);
        break;
      }
      case 1: {
        const geo = new THREE.BoxGeometry(0.5, 0.25, 0.5);
        hair = new THREE.Mesh(geo, mat);
        hair.position.y += 0.05;
        break;
      }
      case 2: {
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
        const geo = new THREE.SphereGeometry(0.18, 8, 8);
        hair = new THREE.Mesh(geo, mat);
        hair.position.set(0, 0.25, -0.05);
        break;
      }
    }
    return hair;
  }

  // --- Ciclo de movimento automático ---
  async startMovementCycle() {
    while (true) {
      const randomX = this.homePosition.x + THREE.MathUtils.randFloat(-5, 5);
      const randomY = THREE.MathUtils.randFloat(20, 21);
      const randomZ = THREE.MathUtils.randFloat(0, 0.5);
      const newTarget = new THREE.Vector3(randomX, randomY, randomZ);

      await this.moveToAsync(newTarget);
      await this.wait(300);
      await this.moveToAsync(this.homePosition);
      await this.wait(500);
    }
  }

  moveToAsync(target) {
    this.target = target.clone();
    this.isMoving = true;
    this._moveStartTime = performance.now();
    return new Promise(resolve => {
      const check = () => {
        const done = this._updateStep();
        if (done) {
          this.isMoving = false;
          resolve();
        } else requestAnimationFrame(check);
      };
      check();
    });
  }

  wait(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  update() {
    this._updateStep();
  }

  _updateStep() {
    if (!this.target) return true;

    const direction = new THREE.Vector3().subVectors(this.target, this.group.position);
    const distance = direction.length();

    if (distance > this.speed) {
      direction.normalize();
      this.group.position.addScaledVector(direction, this.speed);
      const angle = Math.atan2(direction.x, direction.z);
      this.group.rotation.y = angle;
      this._animateLimbs(true);
      return false;
    } else {
      this.group.position.copy(this.target);
      this.target = null;
      this._animateLimbs(false, true);
      return true;
    }
  }

  _animateLimbs(isMoving, reset = false) {
    const t = performance.now() * 0.003;
    const swing = isMoving ? 0.6 : 0;
    const legSwing = isMoving ? 0.5 : 0;

    if (reset) {
      this.leftArmPivot.rotation.x = 0;
      this.rightArmPivot.rotation.x = 0;
      this.leftLegPivot.rotation.x = 0;
      this.rightLegPivot.rotation.x = 0;
      return;
    }

    if (isMoving) {
      this.leftArmPivot.rotation.x = Math.sin(t) * swing;
      this.rightArmPivot.rotation.x = -Math.sin(t) * swing;
      this.leftLegPivot.rotation.x = -Math.sin(t) * legSwing;
      this.rightLegPivot.rotation.x = Math.sin(t) * legSwing;
    } else {
      this.leftArmPivot.rotation.x *= 0.8;
      this.rightArmPivot.rotation.x *= 0.8;
      this.leftLegPivot.rotation.x *= 0.8;
      this.rightLegPivot.rotation.x *= 0.8;
    }
  }

  getMesh() {
    return this.group;
  }
}
