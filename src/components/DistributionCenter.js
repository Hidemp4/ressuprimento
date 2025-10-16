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
    this.stations = []; // Armazena referências das estações
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

    // ======== ADICIONAR ESTAÇÕES (Escalável de 1 a 8) ========
    const numberOfStations = 8;
    const stationSpacing = 20; // Espaçamento entre estações (lado a lado no eixo X)
    
    for (let i = numberOfStations; i >= 1; i--) {
      // Posição baseada no índice da estação (lado a lado no eixo X)
      // Invertido: estação 8 fica à esquerda, estação 1 fica à direita
      const xPosition = (numberOfStations - i) * stationSpacing - (numberOfStations - 1) * stationSpacing / 2;
      const station = new Station(
        new THREE.Vector3(xPosition + 60, 20, 0),
        i // Número da estação
      );
      scene.add(station.getMesh());
      this.stations.push(station);

      // Adicionar trabalhador para cada estação
      const worker = new Worker(new THREE.Vector3(xPosition + 60, 20, 0));
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

  // Método auxiliar para adicionar uma estação dinamicamente
  addStation(stationNumber, position) {
    const station = new Station(position, stationNumber);
    this.scene.getScene().add(station.getMesh());
    this.stations.push(station);
    return station;
  }

  // Método auxiliar para obter todas as estações
  getStations() {
    return this.stations;
  }
}