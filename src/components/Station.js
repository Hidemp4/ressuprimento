import * as THREE from 'three';
import { ConveyorLine } from './ConveyorLine.js';
import { FlowRack } from './FlowRack.js';
import { RackFrame } from './RackFrame.js';

export class Station {
  constructor(position = new THREE.Vector3(0, 0, 0)) {
    this.group = new THREE.Group();
    this.position = position;

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
    const backFrameWidth = backRackSpacing * 2 + 4; // margem lateral
    const backFrameHeight = 3.5;
    const backFrameDepth = 5.5;
    const backFramePosition = new THREE.Vector3(0, 0, backRackZ);
    const backFrame = new RackFrame(
      backFramePosition,
      backFrameWidth,
      backFrameHeight,
      backFrameDepth,
      2
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

    // ======== FRAME DIANTEIRO (Cobre as 3 racks e tem uma placa "8") ========
    const frontFrameWidth = frontRackSpacing * 2 + 4; // cobre as três racks
    const frontFrameHeight = 2.8;
    const frontFrameDepth = 5.5;
    const frontFramePosition = new THREE.Vector3(0, 0, frontRackZ);
    const frontFrame = new RackFrame(
      frontFramePosition,
      frontFrameWidth,
      frontFrameHeight,
      frontFrameDepth,
      3,
      "KNAPP", // número da placa
      true 
    );
    this.group.add(frontFrame.getMesh());
  }

  getMesh() {
    return this.group;
  }
}
