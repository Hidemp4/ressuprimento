import { Scene } from "../core/Scene.js";
import { Camera } from "../core/Camera.js";
import { Renderer } from "../core/Renderer.js";
import { Light } from "../core/Light.js";
import { CameraControls } from "../controls/CameraControls.js";
import { Floor } from "./Floor.js";
import { Station } from "./Station.js";
import { Worker } from "./Worker.js";
import { createCardWorkerUI } from './CardWorker.js';
import { PalletStructure, palletPositions } from "./PalletStructure.js";
import * as THREE from "three";

export class DistributionCenter {

  constructor() {
    this.scene = new Scene();
    this.camera = new Camera(window.innerWidth, window.innerHeight);
    this.renderer = new Renderer();
    this.controls = null;
  }

  init() {
    new Light(this.scene.getScene());
    this.setupScene();
    this.setupControls();
    this.setupResize();
    //this.showWorkerCards();
    this.animate();
  }

  setupScene() {
    const scene = this.scene.getScene();

    // Adicionar chão
    const floor = new Floor();
    scene.add(floor.getMesh());

    // Adicionar linha central azul
    const lineMaterial = new THREE.MeshToonMaterial({ color: 0x1e90ff });
    const lineGeometry = new THREE.PlaneGeometry(3, 80);
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    line.position.set(0, 0.01, 0);
    line.rotation.x = -Math.PI / 2;
    scene.add(line);

    // Adicionar bordas brancas
    const borderMaterial = new THREE.MeshToonMaterial({ color: 0xffffff });
    const borderGeometry = new THREE.PlaneGeometry(0.4, 80);
    const borderLeft = new THREE.Mesh(borderGeometry, borderMaterial);
    borderLeft.position.set(-1.4, 0.02, 0);
    borderLeft.rotation.x = -Math.PI / 2;
    const borderRight = borderLeft.clone();
    borderRight.position.x = 1.3;
    scene.add(borderLeft);
    scene.add(borderRight);

    // Adiciona as estruturas de pallets
    palletPositions.forEach((position) => {
      const palletStructure = new PalletStructure(position);
      this.scene.add(palletStructure.getMesh());
    });

    // Adicionar Estações (esteira + flow racks)
    const station = new Station(new THREE.Vector3(-8, 20, 2));
    scene.add(station.getMesh());

    // Adicionar trabalhadores
    for (let i = 0; i < 1; i++) {
      const worker = new Worker(new THREE.Vector3(-7, 20, 2 + i * 2));
      scene.add(worker.getMesh());
    }
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
    this.renderer.render(this.scene.getScene(), this.camera.getCamera());
  }
}
