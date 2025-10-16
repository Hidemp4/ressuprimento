import * as THREE from "three";
import { Pallet } from "./Pallet.js";
import { Box } from "./Box.js";

export class PalletStructure {
  constructor(position = new THREE.Vector3(0, 0, 0)) {
    this.group = new THREE.Group();
    this.group.position.copy(position);
    this.createStructure();
  }

  createStructure() {
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

    const levelHeight = 2; // distância entre níveis
    const palletsPerLevel = 5;
    const palletSpacing = 3.8;
    const totalWidth = (palletsPerLevel - 1) * palletSpacing + 3;
    const totalHeight = levelHeight * 6;
    const depth = 3;

    // 🔹 Estrutura metálica (azul)
    const structureMat = new THREE.MeshToonMaterial({ 
      color: 0x0047ab,
      depthTest: true,
      depthWrite: true
    });
    const barMat = new THREE.MeshToonMaterial({ 
      color: 0xff8c00,
      depthTest: true,
      depthWrite: true
    });

    const postGeometry = new THREE.BoxGeometry(0.2, totalHeight + 1, 0.2);
    const horizontalGeometry = new THREE.BoxGeometry(
      totalWidth + 0.4,
      0.2,
      0.2
    );

    // Colunas verticais (4 cantos)
    const postPositions = [
      [0, totalHeight / 2, -depth / 2],
      [0, totalHeight / 2, depth / 2],
      [totalWidth, totalHeight / 2, -depth / 2],
      [totalWidth, totalHeight / 2, depth / 2],
    ];
    postPositions.forEach(([x, y, z]) => {
      const post = new THREE.Mesh(postGeometry, structureMat);
      post.position.set(x, y, z);
      post.renderOrder = 0; // Estrutura base
      this.group.add(post);
    });

    // Vigas horizontais laranja a cada nível
    for (let level = 1; level <= 5; level++) {
      const yOffset = level * levelHeight;

      const frontBar = new THREE.Mesh(horizontalGeometry, barMat);
      frontBar.position.set(totalWidth / 2, yOffset, depth / 2);
      frontBar.renderOrder = 0; // Estrutura base
      this.group.add(frontBar);

      const backBar = new THREE.Mesh(horizontalGeometry, barMat);
      backBar.position.set(totalWidth / 2, yOffset, -depth / 2);
      backBar.renderOrder = 0; // Estrutura base
      this.group.add(backBar);
    }

    // 🔹 Pallets e caixas em cada nível
    const BOX_X_OFFSET = 0.9;
    const BOX_Z_OFFSET = 0.9;

    // Definição das 4 posições fixas (cantos)
    const allCornerOffsets = [
      { dx: BOX_X_OFFSET, dz: BOX_Z_OFFSET }, // Canto 1
      { dx: -BOX_X_OFFSET, dz: BOX_Z_OFFSET }, // Canto 2
      { dx: BOX_X_OFFSET, dz: -BOX_Z_OFFSET }, // Canto 3
      { dx: -BOX_X_OFFSET, dz: -BOX_Z_OFFSET }, // Canto 4
    ];

    for (let level = 0; level < 6; level++) {
      let palletCenterY;
      if (level === 0) {
        // Nível 0 (Base do chão): A altura do centro do pallet (0.3/2)
        palletCenterY = 0 + 0.55;
      } else {
        // Níveis 1-5 (Sobre as vigas): Centro da viga (level * levelHeight) + Metade da Viga (0.1) + Metade do Pallet (0.15)
        palletCenterY = level * levelHeight + 0.25;
      }

      // 1. Aleatoriedade: Definir o número de pallets para este nível (4 a 5)
      const palletsInThisLevel = getRandomInt(4, 5);

      for (let i = 0; i < palletsInThisLevel; i++) {
        const xOffset = i * palletSpacing;

        // Pallet
        const palletPos = new THREE.Vector3(xOffset + 1, palletCenterY, 0);
        const pallet = new Pallet(palletPos);
        this.group.add(pallet.getMesh());

        // 2. Aleatoriedade: Definir o número de caixas para este pallet (1 a 4)
        const boxesInThisPallet = getRandomInt(1, 4);

        // 3. Selecionar aleatoriamente as posições para as caixas
        const selectedOffsets = shuffleArray([...allCornerOffsets]).slice(
          0,
          boxesInThisPallet
        );

        // Renderizar as caixas nas posições aleatoriamente selecionadas
        for (const offset of selectedOffsets) {
          // A altura da caixa é: [Centro do Pallet] + [Altura da Caixa/2]
          const boxCenterY = palletCenterY + 0.15 + 0.7 / 2; // 0.15 = Altura do Pallet/2
          // Recalculando:
          // A superfície superior do pallet é palletCenterY + 0.15
          // O centro da caixa deve ser (palletCenterY + 0.15) + (0.7 / 2)
          const boxCenterYCorrected = palletCenterY + 0.15 + 0.35;

          const boxPos = new THREE.Vector3(
            (xOffset + 1) + offset.dx,
            boxCenterYCorrected,
            offset.dz
          );

          const box = new Box(boxPos);
          this.group.add(box.getMesh());
        }
      }
    }
  }

  getMesh() {
    return this.group;
  }
}

// Define todas as posições das estruturas em um array
export const palletPositions = [
  // A
  new THREE.Vector3(-28, 0, -45),
  new THREE.Vector3(-28, 0, -15),
  new THREE.Vector3(-28, 0, 0),
  new THREE.Vector3(-28, 0, 15),
  new THREE.Vector3(-28, 0, 30),
  // B
  new THREE.Vector3(-55, 0, -30),
  new THREE.Vector3(-55, 0, -15),
  new THREE.Vector3(-55, 0, 0),
  new THREE.Vector3(-55, 0, 15),
];