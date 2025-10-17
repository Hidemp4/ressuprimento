import { Scene } from "../core/Scene.js";
import { Camera } from "../core/Camera.js";
import { Renderer } from "../core/Renderer.js";
import { Light } from "../core/Light.js";
import { CameraControls } from "../controls/CameraControls.js";
import { Floor } from "./Floor.js";
import { PalletStructure, palletPositions } from "./PalletStructure.js";
import { ArmManager } from "./arm/ArmManager.js";
import { ArmType } from "../config/ArmConfig.js";
import * as THREE from "three";

export class DistributionCenter {
  constructor() {
    this.scene = new Scene();
    this.camera = new Camera(window.innerWidth, window.innerHeight);
    this.renderer = new Renderer();
    this.controls = null;
    this.armManager = null;
  }

  init() {
    new Light(this.scene.getScene());
    this.setupScene();
    this.setupControls();
    this.setupResize();
    this.animate();
  }

  setupScene() {
    const scene = this.scene.getScene();

    // ======== CHÃO ========
    const floor = new Floor();
    scene.add(floor.getMesh());

    // ======== LINHA CENTRAL AZUL ========
    const lineMaterial = new THREE.MeshToonMaterial({ color: 0x1e90ff });
    const lineGeometry = new THREE.PlaneGeometry(3, 80);
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    line.position.set(0, 0.01, 0);
    line.rotation.x = -Math.PI / 2;
    scene.add(line);

    // ======== BORDAS BRANCAS ========
    const borderMaterial = new THREE.MeshToonMaterial({ color: 0xffffff });
    const borderGeometry = new THREE.PlaneGeometry(0.4, 80);
    const borderLeft = new THREE.Mesh(borderGeometry, borderMaterial);
    borderLeft.position.set(-1.4, 0.02, 0);
    borderLeft.rotation.x = -Math.PI / 2;
    const borderRight = borderLeft.clone();
    borderRight.position.x = 1.3;
    scene.add(borderLeft, borderRight);

    // ======== ESTRUTURAS DE PALLETS ========
    palletPositions.forEach((position) => {
      const palletStructure = new PalletStructure(position);
      scene.add(palletStructure.getMesh());
    });

    // ======== GERENCIADOR DE BRAÇOS ========
    this.armManager = new ArmManager(scene);

    // ======== ADICIONAR BRAÇOS (EXEMPLO) ========
    
    // Braço K12 - Alto Giro (8 estações) - Normal
    this.armManager.addArm(
      "K12",
      ["1", "2", "3", "4", "5", "6", "7", "8"],
      ArmType.HIGH_ROTATION,
      new THREE.Vector3(60, 20, 0),
      0 // Sem rotação
    );

    // Você pode adicionar mais braços facilmente:
    
    // Braço K13 - Alto Giro (8 estações) - INVERTIDO 180°
    this.armManager.addArm(
      "K13",
      ["16", "15", "14", "13", "12", "11", "10", "9"],
      ArmType.HIGH_ROTATION,
      new THREE.Vector3(85, 0, 0),
      Math.PI // 180 graus (racks invertidos)
    );

    // Braço K14 - Rotacionado 90°
    // this.armManager.addArm(
    //   "K14",
    //   ["17", "18", "19", "20", "21", "22", "23", "24"],
    //   ArmType.HIGH_ROTATION,
    //   new THREE.Vector3(-60, 20, 0),
    //   Math.PI / 2 // 90 graus
    // );

    // Listar informações dos braços no console
    this.armManager.listArms();
  }

  setupControls() {
    this.controls = new CameraControls(
      this.camera.getCamera(),
      this.renderer.getCanvas()
    );
  }

  setupResize() {
    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.camera.updateAspect(width, height);
      this.renderer.setSize(width, height);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Atualizar todos os workers de todos os braços
    if (this.armManager) {
      this.armManager.update();
    }
    
    this.renderer.render(this.scene.getScene(), this.camera.getCamera());
  }

  // ======== MÉTODOS AUXILIARES ========

  // Adicionar um novo braço dinamicamente
  addArm(name, stationNumbers, type, position, rotation = 0) {
    return this.armManager.addArm(name, stationNumbers, type, position, rotation);
  }

  // Obter um braço específico
  getArm(name) {
    return this.armManager.getArm(name);
  }

  // Obter todos os braços
  getAllArms() {
    return this.armManager.getAllArms();
  }

  // Obter estatísticas
  getStats() {
    return this.armManager.getStats();
  }

  // Remover um braço
  removeArm(name) {
    return this.armManager.removeArm(name);
  }
}