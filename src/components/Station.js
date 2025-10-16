import * as THREE from 'three';
import { ConveyorLine } from './ConveyorLine.js';
import { FlowRack } from './FlowRack.js';
import { RackFrame } from './RackFrame.js';

export class Station {
  constructor(position = new THREE.Vector3(0, 0, 0), stationNumber = 1) {
    this.group = new THREE.Group();
    this.position = position;
    this.stationNumber = stationNumber;

    this.setupStation();
    this.group.position.copy(position);
  }

  setupStation() {
    const backRackSpacing = 4;
    const backRackZ = -5;
    const backRackY = 0.5;

    const frontRackSpacing = 7;
    const frontRackZ = 5;
    const frontRackY = 0.5;

    // ======== RACKS TRASEIROS ========
    const backRackLeft = new FlowRack(
      new THREE.Vector3(-backRackSpacing, backRackY, backRackZ),
      5,
      7,
      6
    );
    backRackLeft.getMesh().rotation.x = 0.05;
    this.group.add(backRackLeft.getMesh());

    const backRackRight = new FlowRack(
      new THREE.Vector3(backRackSpacing, backRackY, backRackZ),
      5,
      7,
      6
    );
    backRackRight.getMesh().rotation.x = 0.05;
    this.group.add(backRackRight.getMesh());

    // ======== FRAME TRASEIRO (Cobre os dois racks) ========
    const backFrameWidth = backRackSpacing * 2 + 4;
    const backFrameHeight = 3.5;
    const backFrameDepth = 5.5;
    const backFramePosition = new THREE.Vector3(0, 0, backRackZ);
    
    // Todas as estações têm placa numérica na rack traseira
    const backFrame = new RackFrame(
      backFramePosition,
      backFrameWidth,
      backFrameHeight,
      backFrameDepth,
      2,
      this.stationNumber, // Número da estação
      false, // Sem placa KNAPP
      "back-left" // Placa na rack traseira esquerda
    );
    this.group.add(backFrame.getMesh());

    // ======== RACKS DIANTEIROS ========
    const frontRackLeft = new FlowRack(
      new THREE.Vector3(-frontRackSpacing, frontRackY, frontRackZ),
      2,
      7,
      5
    );
    frontRackLeft.getMesh().rotation.x = -0.05;
    this.group.add(frontRackLeft.getMesh());

    const frontRackCenter = new FlowRack(
      new THREE.Vector3(0, frontRackY, frontRackZ),
      2,
      7,
      5
    );
    frontRackCenter.getMesh().rotation.x = -0.05;
    this.group.add(frontRackCenter.getMesh());

    const frontRackRight = new FlowRack(
      new THREE.Vector3(frontRackSpacing, frontRackY, frontRackZ),
      2,
      7,
      5
    );
    frontRackRight.getMesh().rotation.x = -0.05;
    this.group.add(frontRackRight.getMesh());

    // ======== FRAME DIANTEIRO (Cobre as 3 racks) ========
    const frontFrameWidth = frontRackSpacing * 2 + 4;
    const frontFrameHeight = 2.8;
    const frontFrameDepth = 5.5;
    const frontFramePosition = new THREE.Vector3(0, 0, frontRackZ);
    
    // Apenas a estação 8 tem a placa KNAPP na frente
    const showKnappPlate = this.stationNumber === 8;
    
    const frontFrame = new RackFrame(
      frontFramePosition,
      frontFrameWidth,
      frontFrameHeight,
      frontFrameDepth,
      3,
      null, // Sem número na frente
      showKnappPlate, // Placa KNAPP (apenas na estação 8)
      "front-left" // Posição da placa
    );
    this.group.add(frontFrame.getMesh());
  }

  getMesh() {
    return this.group;
  }

  getStationNumber() {
    return this.stationNumber;
  }
}