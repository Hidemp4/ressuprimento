import * as THREE from 'three';

export class Light {
  constructor(scene) {
    // --- Luz ambiente suave (preenche as sombras) ---
    // Intensidade levemente reduzida para mais contraste
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // --- Luz principal (direcional, tipo sol) ---
    const mainLight = new THREE.DirectionalLight(0xfff4e8, 1.2); // Intensidade um pouco menor
    mainLight.position.set(15, 30, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 1;
    mainLight.shadow.camera.far = 100;
    
    // Área da sombra 30x30.
    mainLight.shadow.camera.left = -15;
    mainLight.shadow.camera.right = 15;
    mainLight.shadow.camera.top = 15;
    mainLight.shadow.camera.bottom = -15;
    
    mainLight.shadow.bias = -0.0002; // Evita "acne" de sombra
    scene.add(mainLight);

    // --- Luz de preenchimento azulada (contraste lateral) ---
    const fillLight = new THREE.DirectionalLight(0x9ec9ff, 0.4); // Intensidade
    fillLight.position.set(-15, 10, -5);
    scene.add(fillLight);

    // --- Luz de fundo (simula reflexo da parede ou chão) ---
    const rimLight = new THREE.PointLight(0xffd6aa, 0.5, 60);
    rimLight.position.set(0, 10, -20);
    scene.add(rimLight);

    // --- Luz de realce (acima, simula luz artificial de teto) ---
    const topLight = new THREE.SpotLight(0xffffff, 0.3, 100, Math.PI / 4, 0.5, 1);
    topLight.position.set(0, 40, 0);
    topLight.target.position.set(0, 0, 0);
    topLight.castShadow = false; // luz principal projeta sombra
    scene.add(topLight);
    scene.add(topLight.target);

    this.lights = { ambientLight, mainLight, fillLight, rimLight, topLight };
  }
}