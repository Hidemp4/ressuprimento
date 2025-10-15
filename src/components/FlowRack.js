import * as THREE from "three";
import { BoxStation } from "./BoxStation.js";

export class FlowRack {
  constructor(position, levels = 5, boxesPerLevel = 7, maxBoxesPerRow = 6) {
    this.group = new THREE.Group();
    this.levels = levels;
    this.boxesPerLevel = boxesPerLevel;
    this.maxBoxesPerRow = maxBoxesPerRow;

    // Funções de utilidade para aleatoriedade
    const getRandomInt = (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const boxSpacing = boxesPerLevel * 0.15; // Espaçamento entre as caixas (eixo X)
    const rackDepth = 5; // Espaçamento entre as fileiras (eixo Z)
    const rackWidth = this.maxBoxesPerRow * boxSpacing + boxSpacing;
    const rackHeight = 0.1;

    // Criar níveis do rack
    for (let level = 0; level < levels; level++) {
      const levelHeight = level * 0.5; // Espaçamento vertical entre níveis

      // Estrutura do nível
      const levelGeometry = new THREE.BoxGeometry(
        rackWidth,
        rackHeight,
        rackDepth
      );
      const levelMaterial = new THREE.MeshToonMaterial({ color: 0x696969 });
      const levelMesh = new THREE.Mesh(levelGeometry, levelMaterial);
      levelMesh.position.y = levelHeight;
      this.group.add(levelMesh);

      // Para cada fileira (coluna Z)
      for (let row = 0; row < boxesPerLevel; row++) {
        // Aleatoriedade: número de caixas nesta fileira (0 a maxBoxesPerRow)
        const boxesInThisRow = getRandomInt(0, this.maxBoxesPerRow);

        // Criar array de índices possíveis e embaralhar
        const possibleIndices = Array.from(
          { length: this.maxBoxesPerRow },
          (_, i) => i
        );
        const selectedIndices = shuffleArray([...possibleIndices]).slice(
          0,
          boxesInThisRow
        );

        // Renderizar as caixas nas posições aleatoriamente selecionadas
        for (const colIndex of selectedIndices) {
          const boxX = (colIndex - (this.maxBoxesPerRow - 1) / 2) * boxSpacing;
          const boxZ = (row - (boxesPerLevel - 1) / 2) * 0.7;
          const boxY = levelHeight + 0.25;

          const boxPosition = new THREE.Vector3(boxX, boxY, boxZ);
          const box3D = new BoxStation(boxPosition);
          this.group.add(box3D.getMesh());
        }
      }
    }

    this.group.position.copy(position);
  }

  getMesh() {
    return this.group;
  }
}
