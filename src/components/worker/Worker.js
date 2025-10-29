import * as THREE from 'three';
import { WorkerAppearance } from './WorkerAppearance.js';
import { WorkerLimbs } from './WorkerLimbs.js';
import { WorkerMovement } from './WorkerMovement.js';
import { WorkerEffects } from './WorkerEffects.js';

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

    // Criar sistema de efeitos visuais
    this.effects = new WorkerEffects(this.group);

    // Configurar movimento com callback de conclusão
    this.movement = new WorkerMovement(this.group, position, this.onWorkComplete.bind(this));
    
    // Iniciar ciclo de movimento automático
    this.movement.startAutoCycle();
  }

  onWorkComplete() {
    // Callback chamado quando o worker volta para home position
    this.effects.playWorkCompleteEffect();
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

  dispose() {
    if (this.effects) {
      this.effects.dispose();
    }
  }
}
