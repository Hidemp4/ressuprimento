// Worker.js
import * as THREE from 'three';
import { WorkerAppearance } from './WorkerAppearance.js';
import { WorkerLimbs } from './WorkerLimbs.js';
import { WorkerMovement } from './WorkerMovement.js';

export class Worker {
  constructor(position) {
    this.group = new THREE.Group();
    
    // Criar aparência do trabalhador
    const { body, bodyMaterial, hasWhiteShirt } = WorkerAppearance.createBody();
    const head = WorkerAppearance.createHead();
    const hair = WorkerAppearance.createRandomHair();
    
    this.group.add(body, head, hair);

    // Adicionar camisa branca se for o trabalhador especial (1%)
    if (hasWhiteShirt) {
      const shirt = WorkerAppearance.createShirt();
      this.group.add(shirt);
    }

    // Criar membros (braços e pernas)
    this.limbs = new WorkerLimbs(bodyMaterial);
    this.limbs.addToGroup(this.group);

    // Posicionar trabalhador
    this.group.position.copy(position);

    // Configurar movimento
    this.movement = new WorkerMovement(this.group, position);
    
    // Iniciar ciclo de movimento automático
    this.movement.startAutoCycle();
  }

  update() {
    const { isMoving, hasTarget } = this.movement.getMovementState();
    
    // Atualizar passo do movimento se houver um alvo
    if (hasTarget) {
      const done = this.movement.updateStep();
      this.limbs.animate(isMoving, done);
    } else {
      this.limbs.animate(false, false);
    }
  }

  async moveTo(target) {
    await this.movement.moveToAsync(target);
  }

  getMesh() {
    return this.group;
  }
}