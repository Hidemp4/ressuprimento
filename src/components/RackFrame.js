import * as THREE from "three";

export class RackFrame {
  constructor(
    position,
    width = 10,
    height = 3,
    depth = 5,
    rackCount = 2,
    label = null,
    showKnapp = false,
    labelPosition = "front-left" // Opções: "front-left", "back-left", "back-right"
  ) {
    this.group = new THREE.Group();
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.rackCount = rackCount;

    const thickness = 0.15;
    const frameMaterial = new THREE.MeshToonMaterial({ 
      color: 0xf1f1f1,
      depthTest: true,
      depthWrite: true
    });

    // === Pilares verticais ===
    const h = height / 1.2;
    const pillarGeometry = new THREE.BoxGeometry(thickness, h, thickness);

    const pillarPositions = [
      [-width / 2 - 1.5, h / 2, -depth / 2], // canto esquerdo traseiro
      [width / 2 + 1.5, h / 2, -depth / 2], // canto direito traseiro
      [-width / 2 - 1.5, h / 2, depth / 2], // canto esquerdo dianteiro
      [width / 2 + 1.5, h / 2, depth / 2], // canto direito dianteiro
    ];

    pillarPositions.forEach((pos) => {
      const pillar = new THREE.Mesh(pillarGeometry, frameMaterial);
      pillar.position.set(...pos);
      this.group.add(pillar);
    });

    // === Vigas horizontais (superiores e inferiores) ===
    const horizontalGeometry = new THREE.BoxGeometry(
      width + 3,
      thickness,
      thickness
    );

    // Frente e trás (superior)
    const topFront = new THREE.Mesh(horizontalGeometry, frameMaterial);
    topFront.position.set(0, h, depth / 2);
    this.group.add(topFront);

    const topBack = new THREE.Mesh(horizontalGeometry, frameMaterial);
    topBack.position.set(0, h, -depth / 2);
    this.group.add(topBack);

    // === Vigas laterais (conectando frente e trás) ===
    const sideGeometry = new THREE.BoxGeometry(thickness, thickness, depth);

    // Superior esquerdo
    const topLeft = new THREE.Mesh(sideGeometry, frameMaterial);
    topLeft.position.set(-width / 2 - 1.5, h, 0);
    this.group.add(topLeft);

    // Superior direito
    const topRight = new THREE.Mesh(sideGeometry, frameMaterial);
    topRight.position.set(width / 2 + 1.5, h, 0);
    this.group.add(topRight);

    // === PLACA COM "K12" (apenas se showKnapp for true) ===
    if (showKnapp) {
      const knappCanvas = document.createElement("canvas");
      knappCanvas.width = 256;
      knappCanvas.height = 128;
      const knappCtx = knappCanvas.getContext("2d");

      knappCtx.fillStyle = "#000c34ff";
      knappCtx.fillRect(0, 0, knappCanvas.width, knappCanvas.height);

      knappCtx.fillStyle = "#bf930d";
      knappCtx.font = "bold 70px Arial";
      knappCtx.textAlign = "center";
      knappCtx.textBaseline = "top";
      knappCtx.fillText("K12", knappCanvas.width / 2, 5);

      const knappTexture = new THREE.CanvasTexture(knappCanvas);
      const knappMaterial = new THREE.MeshToonMaterial({ 
        map: knappTexture,
        depthTest: true,
        depthWrite: true
      });
      const knappPlate = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 1.4, 0.1),
        knappMaterial
      );

      knappPlate.position.set(-width / 2 - 1.5, height + 0.9, depth / 2 + 0.5);
      knappPlate.renderOrder = 1; // Renderizar por cima
      this.group.add(knappPlate);
    }

    // === PLACA DO NÚMERO (label) ===
    if (label !== null) {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#000c34ff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#bf930d";
      ctx.font = "bold 80px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label.toString(), 128, 64);

      const texture = new THREE.CanvasTexture(canvas);
      const textMaterial = new THREE.MeshToonMaterial({ 
        map: texture,
        depthTest: true,
        depthWrite: true
      });
      const textPlane = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.7, thickness),
        textMaterial
      );

      // Posicionar a placa baseado no labelPosition
      let xPos, zPos;
      switch (labelPosition) {
        case "back-left":
          xPos = -width / 1.5 - 1.3;
          zPos = -depth / 4 + 5.5;
          break;
        case "back-right":
          xPos = width / 2 + 1.5;
          zPos = -depth / 2 - 0.5;
          break;
        case "front-left":
        default:
          xPos = -width / 2 - 1.5;
          zPos = depth / 2 + 0.5;
          break;
      }

      textPlane.position.set(xPos, height + 0.6, zPos);
      textPlane.renderOrder = 1; // Renderizar por cima
      this.group.add(textPlane);
    }

    this.group.position.copy(position);
  }

  getMesh() {
    return this.group;
  }
}