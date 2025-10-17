// WorkerMovement.js
import * as THREE from 'three';

export class WorkerMovement {
  constructor(group, homePosition, speed = 0.03) {
    this.group = group;
    this.homePosition = homePosition.clone();
    this.speed = speed;
    this.target = null;
    this.isMoving = false;
    this._moveStartTime = 0;
  }

  async startAutoCycle() {
    while (true) {
      const randomX = this.homePosition.x + THREE.MathUtils.randFloat(-5, 5);
      const randomY = THREE.MathUtils.randFloat(0, 1);
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
        const done = this.updateStep();
        if (done) {
          this.isMoving = false;
          resolve();
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    });
  }

  wait(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  updateStep() {
    if (!this.target) return true;

    const direction = new THREE.Vector3().subVectors(this.target, this.group.position);
    const distance = direction.length();

    if (distance > this.speed) {
      direction.normalize();
      this.group.position.addScaledVector(direction, this.speed);
      
      // Rotaciona o trabalhador na direção do movimento
      const angle = Math.atan2(direction.x, direction.z);
      this.group.rotation.y = angle;
      
      return false;
    } else {
      this.group.position.copy(this.target);
      this.target = null;
      return true;
    }
  }

  getMovementState() {
    return {
      isMoving: this.isMoving,
      hasTarget: this.target !== null
    };
  }
}