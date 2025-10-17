// ArmManager.js - Gerencia múltiplos braços no centro de distribuição
import * as THREE from 'three';
import { Arm } from './Arm.js';
import { ArmType } from '../../config/ArmConfig.js';

export class ArmManager {
  constructor(scene) {
    this.scene = scene;
    this.arms = new Map();
  }

  // Adiciona um braço ao centro de distribuição
  addArm(name, stationNumbers, type, position, rotation = 0) {
    if (this.arms.has(name)) {
      console.warn(`Braço com nome "${name}" já existe. Use outro nome.`);
      return null;
    }

    const arm = new Arm(name, stationNumbers, type, position, rotation);
    arm.getMesh().rotation.y = rotation; // Aplica rotação
    this.arms.set(name, arm);
    this.scene.add(arm.getMesh());

    const rotationDegrees = Math.round((rotation * 180) / Math.PI);
    console.log(`✓ Braço "${name}" (${type}) adicionado com ${stationNumbers.length} estações: [${stationNumbers.join(', ')}] - Rotação: ${rotationDegrees}°`);
    return arm;
  }

  // Remove um braço
  removeArm(name) {
    const arm = this.arms.get(name);
    if (!arm) {
      console.warn(`Braço "${name}" não encontrado.`);
      return false;
    }

    this.scene.remove(arm.getMesh());
    this.arms.delete(name);
    console.log(`✓ Braço "${name}" removido`);
    return true;
  }

  // Obtém um braço específico
  getArm(name) {
    return this.arms.get(name);
  }

  // Obtém todos os braços
  getAllArms() {
    return Array.from(this.arms.values());
  }

  // Atualiza todos os braços (workers, animações, etc.)
  update() {
    this.arms.forEach(arm => {
      arm.update();
    });
  }

  // Obtém estatísticas gerais
  getStats() {
    const stats = {
      totalArms: this.arms.size,
      totalStations: 0,
      totalWorkers: 0,
      armsByType: {
        [ArmType.HIGH_ROTATION]: 0,
        [ArmType.LOW_ROTATION]: 0
      }
    };

    this.arms.forEach(arm => {
      const info = arm.getInfo();
      stats.totalStations += info.stationCount;
      stats.totalWorkers += info.workerCount;
      stats.armsByType[arm.getType()]++;
    });

    return stats;
  }

  // Lista informações de todos os braços
  listArms() {
    console.log('\n=== BRAÇOS DO CENTRO DE DISTRIBUIÇÃO ===');
    this.arms.forEach((arm, name) => {
      const info = arm.getInfo();
      console.log(`\n📦 ${name}`);
      console.log(`   Tipo: ${info.type}`);
      console.log(`   Estações: ${info.stationCount} (${info.stations.join(', ')})`);
      console.log(`   Workers: ${info.workerCount}`);
    });
    console.log('\n' + '='.repeat(40));
    const stats = this.getStats();
    console.log(`Total de braços: ${stats.totalArms}`);
    console.log(`Total de estações: ${stats.totalStations}`);
    console.log(`Total de workers: ${stats.totalWorkers}`);
    console.log('='.repeat(40) + '\n');
  }
}