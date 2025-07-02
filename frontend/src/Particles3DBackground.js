import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 150; // Réduit pour de meilleures performances

export default function Particles3DBackground() {
  const mountRef = useRef();
  const animationRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();

  useEffect(() => {
    console.log('🚀 Initialisation du fond de particules 3D...');
    
    if (!mountRef.current) {
      console.error('❌ Référence du mount non disponible');
      return;
    }

    try {
      // Scene setup
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 50;

      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
      });
      rendererRef.current = renderer;
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimisation performance
      
      mountRef.current.appendChild(renderer.domElement);
      console.log('✅ Canvas Three.js créé et ajouté au DOM');

      // Lights
      const ambientLight = new THREE.AmbientLight(0x8888aa, 0.8);
      scene.add(ambientLight);
      
      const pointLight = new THREE.PointLight(0xb3c6f7, 1.0, 200);
      pointLight.position.set(20, 20, 20);
      scene.add(pointLight);

      // Particles avec géométrie optimisée
      const positions = new Float32Array(PARTICLE_COUNT * 3);
      const velocities = new Float32Array(PARTICLE_COUNT * 3);
      
      for (let i = 0; i < PARTICLE_COUNT * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 80;
        positions[i + 1] = (Math.random() - 0.5) * 80;
        positions[i + 2] = (Math.random() - 0.5) * 80;
        
        velocities[i] = (Math.random() - 0.5) * 0.1;
        velocities[i + 1] = (Math.random() - 0.5) * 0.1;
        velocities[i + 2] = (Math.random() - 0.5) * 0.1;
      }
      
      const particlesGeometry = new THREE.BufferGeometry();
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const particlesMaterial = new THREE.PointsMaterial({
        color: 0xb3c6f7,
        size: 1.2,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
      });
      
      const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particleSystem);
      console.log('✅ Système de particules créé');

      // Lines avec géométrie dynamique
      const lineGeometry = new THREE.BufferGeometry();
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0xb3c6f7, 
        opacity: 0.3, 
        transparent: true 
      });
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      scene.add(lines);
      console.log('✅ Système de lignes créé');

      // Variables pour l'animation
      let frameCount = 0;
      const maxLines = 50; // Limite le nombre de lignes pour les performances

      // Animation loop optimisée
      function animate() {
        frameCount++;
        
        // Update particles
        for (let i = 0; i < PARTICLE_COUNT * 3; i += 3) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];
          
          // Rebond aux bords
          if (Math.abs(positions[i]) > 40) velocities[i] *= -1;
          if (Math.abs(positions[i + 1]) > 40) velocities[i + 1] *= -1;
          if (Math.abs(positions[i + 2]) > 40) velocities[i + 2] *= -1;
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        // Update lines (optimisé)
        const linePositions = [];
        let lineCount = 0;
        
        for (let i = 0; i < PARTICLE_COUNT && lineCount < maxLines; i++) {
          for (let j = i + 1; j < PARTICLE_COUNT && lineCount < maxLines; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (dist < 12) {
              linePositions.push(
                positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
              );
              lineCount++;
            }
          }
        }
        
        if (linePositions.length > 0) {
          lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
          lineGeometry.attributes.position.needsUpdate = true;
        }

        // Rotation lente du système
        particleSystem.rotation.x += 0.0005;
        particleSystem.rotation.y += 0.0008;
        lines.rotation.x += 0.0003;
        lines.rotation.y += 0.0006;

        // Log de debug toutes les 60 frames (1 seconde à 60fps)
        if (frameCount % 60 === 0) {
          console.log(`🎬 Animation frame: ${frameCount}, Particules: ${PARTICLE_COUNT}, Lignes: ${lineCount}`);
        }

        renderer.render(scene, camera);
        animationRef.current = requestAnimationFrame(animate);
      }

      // Démarrer l'animation
      animate();
      console.log('✅ Boucle d\'animation démarrée');

      // Gestion du redimensionnement
      function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        console.log('📐 Fenêtre redimensionnée');
      }
      
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        console.log('🧹 Nettoyage du composant Particles3DBackground');
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        window.removeEventListener('resize', handleResize);
        
        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
        
        if (mountRef.current && rendererRef.current) {
          try {
            mountRef.current.removeChild(rendererRef.current.domElement);
          } catch (e) {
            console.warn('⚠️ Erreur lors du nettoyage du canvas:', e);
          }
        }
      };
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation du fond 3D:', error);
    }
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    />
  );
} 