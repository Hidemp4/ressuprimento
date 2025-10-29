// WorkerEffects.js
import * as THREE from 'three';

export class WorkerEffects {
  constructor(group) {
    this.group = group;
    this.glowLayers = [];
    this.sparkles = [];
    this.activeAnimations = [];
    
    this._createGlowAura();
  }

  _createGlowAura() {
    // Criar apenas 2 camadas de glow para efeito mais balanceado
    const layer1Geometry = new THREE.RingGeometry(0.9, 1.3, 32);
    const layer1Material = new THREE.MeshBasicMaterial({
      color: 0xffdd00,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    
    const ring1 = new THREE.Mesh(layer1Geometry, layer1Material);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.05;
    this.group.add(ring1);
    this.glowLayers.push(ring1);

    // Segunda camada mais sutil
    const layer2Geometry = new THREE.RingGeometry(1.2, 1.5, 32);
    const layer2Material = new THREE.MeshBasicMaterial({
      color: 0xffa500,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    
    const ring2 = new THREE.Mesh(layer2Geometry, layer2Material);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.05;
    this.group.add(ring2);
    this.glowLayers.push(ring2);
  }

  _createSparkle(x, y, z) {
    const sparkleGeometry = new THREE.SphereGeometry(0.08, 6, 6);
    const sparkleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending
    });
    
    const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
    sparkle.position.set(x, y, z);
    this.group.add(sparkle);
    return sparkle;
  }

  _createPlusOneIcon() {
    const canvas = document.createElement('canvas');
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Glow suave atrás do texto
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Estilo cartoon com outline
    ctx.fillStyle = '#FFFF00';
    ctx.strokeStyle = '#FF8C00';
    ctx.lineWidth = 14;
    ctx.lineJoin = 'round';
    ctx.font = 'bold 130px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Desenhar outline
    ctx.strokeText('+1', size / 2, size / 2);
    // Desenhar texto
    ctx.fillText('+1', size / 2, size / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 1
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(1.2, 1.2, 1);
    sprite.position.set(0, 2.2, 0);
    
    return sprite;
  }

  playWorkCompleteEffect() {
    // 50% de chance de executar o efeito
    if (Math.random() > 0.5) return;

    this._animateGlowAura();
    this._animateSparkles();
    this._animatePlusOne();
  }

  _animateGlowAura() {
    const startTime = performance.now();
    const duration = 1000;
    
    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      this.glowLayers.forEach((layer, index) => {
        const maxOpacity = index === 0 ? 0.4 : 0.25; // Primeira camada um pouco mais visível
        
        if (progress < 0.3) {
          // Fade in
          const t = progress / 0.3;
          layer.material.opacity = t * maxOpacity;
          layer.scale.set(1, 1, 1);
        } else if (progress < 0.7) {
          // Mantém com pulso suave
          const t = (progress - 0.3) / 0.4;
          const pulse = 1 + Math.sin(t * Math.PI * 3) * 0.1;
          layer.material.opacity = maxOpacity * pulse;
          layer.scale.set(1 + t * 0.2, 1 + t * 0.2, 1);
        } else {
          // Fade out
          const t = (progress - 0.7) / 0.3;
          layer.material.opacity = maxOpacity * (1 - t);
          layer.scale.set(1.2, 1.2, 1);
        }
        
        // Rotação suave
        layer.rotation.z += 0.02;
      });
      
      if (progress < 1) {
        const animId = requestAnimationFrame(animate);
        this.activeAnimations.push(animId);
      } else {
        this.glowLayers.forEach(layer => {
          layer.material.opacity = 0;
          layer.scale.set(1, 1, 1);
        });
      }
    };
    
    animate();
  }

  _animateSparkles() {
    const sparkleCount = 6; // Reduzido de 12 para 6
    const createdSparkles = [];
    
    for (let i = 0; i < sparkleCount; i++) {
      setTimeout(() => {
        const angle = (i / sparkleCount) * Math.PI * 2;
        const radius = 0.8 + Math.random() * 0.3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = 0.3 + Math.random() * 1.5;
        
        const sparkle = this._createSparkle(x, y, z);
        createdSparkles.push(sparkle);
        this.sparkles.push(sparkle);
        
        this._animateSingleSparkle(sparkle);
      }, i * 100);
    }
  }

  _animateSingleSparkle(sparkle) {
    const startTime = performance.now();
    const duration = 700 + Math.random() * 300;
    const startY = sparkle.position.y;
    const endY = startY + 1.2 + Math.random() * 0.5;
    const startScale = 1;
    const endScale = 0.2;
    
    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 2);
      
      sparkle.position.y = startY + (endY - startY) * easeOut;
      
      const scale = startScale + (endScale - startScale) * progress;
      sparkle.scale.set(scale, scale, scale);
      
      sparkle.material.opacity = 1 - progress;
      
      if (progress < 1) {
        const animId = requestAnimationFrame(animate);
        this.activeAnimations.push(animId);
      } else {
        this.group.remove(sparkle);
        sparkle.geometry.dispose();
        sparkle.material.dispose();
        const index = this.sparkles.indexOf(sparkle);
        if (index > -1) this.sparkles.splice(index, 1);
      }
    };
    
    animate();
  }

  _animatePlusOne() {
    const sprite = this._createPlusOneIcon();
    this.group.add(sprite);
    
    const startTime = performance.now();
    const duration = 1000;
    const startY = 2.2;
    const endY = 3.2;
    
    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Movimento para cima com bounce suave
      const bounce = Math.sin(progress * Math.PI) * 0.12;
      const easeOut = 1 - Math.pow(1 - progress, 2);
      sprite.position.y = startY + (endY - startY) * easeOut + bounce;
      
      // Escala com pop inicial pequeno
      if (progress < 0.2) {
        const popProgress = progress / 0.2;
        sprite.scale.set(
          1.2 + popProgress * 0.12,
          1.2 + popProgress * 0.12,
          1
        );
      } else {
        sprite.scale.set(1.32, 1.32, 1);
      }
      
      // Rotação muito sutil
      sprite.material.rotation = Math.sin(progress * Math.PI * 2) * 0.08;
      
      // Fade out no final
      if (progress > 0.65) {
        const fadeProgress = (progress - 0.65) / 0.35;
        sprite.material.opacity = 1 - fadeProgress;
      }
      
      if (progress < 1) {
        const animId = requestAnimationFrame(animate);
        this.activeAnimations.push(animId);
      } else {
        this.group.remove(sprite);
        sprite.material.map.dispose();
        sprite.material.dispose();
      }
    };
    
    animate();
  }

  dispose() {
    this.activeAnimations.forEach(id => cancelAnimationFrame(id));
    this.activeAnimations = [];
    
    this.glowLayers.forEach(layer => {
      layer.geometry.dispose();
      layer.material.dispose();
    });
    
    this.sparkles.forEach(sparkle => {
      this.group.remove(sparkle);
      sparkle.geometry.dispose();
      sparkle.material.dispose();
    });
    
    this.sparkles = [];
  }
}