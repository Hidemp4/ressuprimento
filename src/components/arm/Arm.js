// Arm.js - Classe que representa um braço completo
import * as THREE from 'three';
import { ArmType, ArmConfig } from '../../config/ArmConfig.js';
import { StationFactory } from '../station/StationFactory.js';
import { Worker } from '../worker/Worker.js';

export class Arm {
  constructor(name, stationNumbers, type, position, rotation = 0) {
    this.name = name;
    this.stationNumbers = stationNumbers;
    this.type = type;
    this.rotation = rotation;
    this.config = ArmConfig[type];
    this.group = new THREE.Group();
    this.stations = [];
    this.workers = [];

    // Validar quantidade de estações
    if (stationNumbers.length !== this.config.stationCount) {
      console.warn(
        `Aviso: Braço "${name}" tipo ${type} espera ${this.config.stationCount} estações, ` +
        `mas recebeu ${stationNumbers.length}. Ajustando...`
      );
    }

    this._createArm(position);
  }

  _createArm(basePosition) {
    const { stationCount, stationSpacing } = this.config;
    const totalStations = Math.min(stationCount, this.stationNumbers.length);

    for (let i = 0; i < totalStations; i++) {
      // Calcular posição X baseada no índice (invertido: primeira estação à esquerda)
      const xOffset = (totalStations - 1 - i) * stationSpacing - ((totalStations - 1) * stationSpacing) / 2;
      const stationPosition = new THREE.Vector3(
        xOffset, // Posição relativa ao grupo
        0,       // Y relativo
        0        // Z relativo
      );

      const stationNumber = this.stationNumbers[i];
      const isLastStation = (i === totalStations - 1);

      // Criar estação baseada no tipo
      const station = this._createStation(stationPosition, stationNumber, isLastStation);
      this.group.add(station);
      this.stations.push({
        number: stationNumber,
        mesh: station,
        position: stationPosition
      });

      // Criar trabalhador para a estação
      const worker = new Worker(stationPosition);
      this.group.add(worker.getMesh());
      this.workers.push({
        stationNumber: stationNumber,
        worker: worker
      });
    }

    // Posicionar o grupo inteiro no mundo
    this.group.position.copy(basePosition);
  }

  _createStation(position, stationNumber, isLastStation = false) {
    // Detectar se está invertido (180 graus)
    const isInverted = Math.abs(this.rotation) < 0.1;
    
    if (this.type === ArmType.HIGH_ROTATION) {
      return StationFactory.createHighRotationStation(
        position,
        stationNumber,
        this.name,
        isLastStation,
        isInverted
      );
    } else {
      // TODO: Implementar estações de baixo giro
      return StationFactory.createHighRotationStation(position, stationNumber, this.name, isLastStation, isInverted);
    }
  }

  // Atualiza todos os workers do braço
  update() {
    this.workers.forEach(({ worker }) => {
      worker.update();
    });
  }

  // Retorna informações do braço
  getInfo() {
    return {
      name: this.name,
      type: this.type,
      stationCount: this.config.stationCount,
      stations: this.stations.map(s => s.number),
      workerCount: this.workers.length
    };
  }

  // Obtém um trabalhador específico por número da estação
  getWorkerByStation(stationNumber) {
    const workerData = this.workers.find(w => w.stationNumber === stationNumber);
    return workerData ? workerData.worker : null;
  }

  // Obtém uma estação específica por número
  getStationByNumber(stationNumber) {
    return this.stations.find(s => s.number === stationNumber);
  }

  getMesh() {
    return this.group;
  }

  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }
}