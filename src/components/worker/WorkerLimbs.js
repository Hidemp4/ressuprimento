// WorkerLimbs.js
import * as THREE from 'three';

export class WorkerLimbs {
  constructor(bodyMaterial) {
    this.leftArmPivot = null;
    this.rightArmPivot = null;
    this.leftLegPivot = null;
    this.rightLegPivot = null;

    this._createArms(bodyMaterial);
    this._createLegs();
  }

  _createArms(bodyMaterial) {
    const armGeom = new THREE.BoxGeometry(0.18, 0.8, 0.18);
    const armMat = bodyMaterial.clone();

    // Braço esquerdo
    this.leftArmPivot = new THREE.Group();
    this.leftArmPivot.position.set(-0.5, 1.15, 0);
    const leftArm = new THREE.Mesh(armGeom, armMat);
    leftArm.position.set(0, -0.4, 0);
    this.leftArmPivot.add(leftArm);

    // Braço direito
    this.rightArmPivot = new THREE.Group();
    this.rightArmPivot.position.set(0.5, 1.15, 0);
    const rightArm = new THREE.Mesh(armGeom, armMat);
    rightArm.position.set(0, -0.4, 0);
    this.rightArmPivot.add(rightArm);
  }

  _createLegs() {
    const legGeom = new THREE.BoxGeometry(0.20, 0.7, 0.22);
    const legMat = new THREE.MeshToonMaterial({ color: 0xf9f9f9 });

    // Perna esquerda
    this.leftLegPivot = new THREE.Group();
    this.leftLegPivot.position.set(-0.18, 0.05, 0);
    const leftLeg = new THREE.Mesh(legGeom, legMat);
    leftLeg.position.set(0, -0.45, 0);
    this.leftLegPivot.add(leftLeg);

    // Perna direita
    this.rightLegPivot = new THREE.Group();
    this.rightLegPivot.position.set(0.18, 0.05, 0);
    const rightLeg = new THREE.Mesh(legGeom, legMat);
    rightLeg.position.set(0, -0.45, 0);
    this.rightLegPivot.add(rightLeg);
  }

  addToGroup(group) {
    group.add(
      this.leftArmPivot,
      this.rightArmPivot,
      this.leftLegPivot,
      this.rightLegPivot
    );
  }

  animate(isMoving, reset = false) {
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
}