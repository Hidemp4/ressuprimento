// StationFactory.js - Factory para criar estações
import * as THREE from 'three';
import { FlowRack } from '../FlowRack.js';
import { RackFrame } from '../RackFrame.js';
import { RackLayout } from '../../config/ArmConfig.js';

export class StationFactory {
  static createHighRotationStation(position, stationNumber, armName, isLastStation = false, isInverted = false) {
    const group = new THREE.Group();

    // Racks traseiros
    const backRacks = this._createBackRacks();
    backRacks.forEach(rack => group.add(rack));

    // Frame traseiro com número da estação
    // Se invertido, a placa fica na frente (front-left), senão fica atrás (back-left)
    const backFrame = this._createBackFrame(stationNumber, isInverted);
    group.add(backFrame);

    // Racks dianteiros
    const frontRacks = this._createFrontRacks();
    frontRacks.forEach(rack => group.add(rack));

    // Frame dianteiro (com placa do nome do braço apenas na última estação)
    // Se invertido, a placa fica atrás (back-left), senão fica na frente (front-left)
    const frontFrame = this._createFrontFrame(armName, isLastStation, isInverted);
    group.add(frontFrame);

    group.position.copy(position);
    return group;
  }

  static _createBackRacks() {
    const racks = [];
    const { spacing, zPosition, yPosition, rotation, levels, boxesPerLevel, maxBoxesPerRow } = RackLayout.BACK;

    // Rack traseiro esquerdo
    const backRackLeft = new FlowRack(
      new THREE.Vector3(-spacing, yPosition, zPosition),
      levels,
      boxesPerLevel,
      maxBoxesPerRow
    );
    backRackLeft.getMesh().rotation.x = rotation;
    racks.push(backRackLeft.getMesh());

    // Rack traseiro direito
    const backRackRight = new FlowRack(
      new THREE.Vector3(spacing, yPosition, zPosition),
      levels,
      boxesPerLevel,
      maxBoxesPerRow
    );
    backRackRight.getMesh().rotation.x = rotation;
    racks.push(backRackRight.getMesh());

    return racks;
  }

  static _createBackFrame(stationNumber, isInverted = false) {
    const { spacing, zPosition } = RackLayout.BACK;
    const frameWidth = spacing * 2 + 4;
    const frameHeight = 3.5;
    const frameDepth = 5.5;
    const framePosition = new THREE.Vector3(0, 0, zPosition);

    // Se invertido, a placa do número fica na frente (front-left)
    // Se normal, fica atrás (back-left)
    const labelPosition = isInverted ? "front-left" : "back-left";

    const frame = new RackFrame(
      framePosition,
      frameWidth,
      frameHeight,
      frameDepth,
      2,
      stationNumber,
      false,
      labelPosition
    );

    return frame.getMesh();
  }

  static _createFrontRacks() {
    const racks = [];
    const { spacing, zPosition, yPosition, rotation, levels, boxesPerLevel, maxBoxesPerRow } = RackLayout.FRONT;

    // Rack dianteiro esquerdo
    const frontRackLeft = new FlowRack(
      new THREE.Vector3(-spacing, yPosition, zPosition),
      levels,
      boxesPerLevel,
      maxBoxesPerRow
    );
    frontRackLeft.getMesh().rotation.x = rotation;
    racks.push(frontRackLeft.getMesh());

    // Rack dianteiro central
    const frontRackCenter = new FlowRack(
      new THREE.Vector3(0, yPosition, zPosition),
      levels,
      boxesPerLevel,
      maxBoxesPerRow
    );
    frontRackCenter.getMesh().rotation.x = rotation;
    racks.push(frontRackCenter.getMesh());

    // Rack dianteiro direito
    const frontRackRight = new FlowRack(
      new THREE.Vector3(spacing, yPosition, zPosition),
      levels,
      boxesPerLevel,
      maxBoxesPerRow
    );
    frontRackRight.getMesh().rotation.x = rotation;
    racks.push(frontRackRight.getMesh());

    return racks;
  }

  static _createFrontFrame(armName = null, showArmName = false, isInverted = false) {
    const { spacing, zPosition } = RackLayout.FRONT;
    const frameWidth = spacing * 2 + 4;
    const frameHeight = 2.8;
    const frameDepth = 5.5;
    const framePosition = new THREE.Vector3(0, 0, zPosition);

    // Se invertido, a placa do braço fica atrás (back-left)
    // Se normal, fica na frente (front-left)
    const labelPosition = isInverted ? "back-left" : "front-left";

    const frame = new RackFrame(
      framePosition,
      frameWidth,
      frameHeight,
      frameDepth,
      3,
      showArmName ? armName : null, // Exibe o nome do braço se for a última estação
      showArmName, // showKnapp (usa o mesmo valor)
      labelPosition
    );

    return frame.getMesh();
  }
}