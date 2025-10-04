"use client";
import { useEffect, useRef } from 'react';

export default function ThreePet() {
  const mountRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, sphere, animationId;

    const initThree = async () => {
      // Динамический импорт three.js
      const THREE = await import('three');

      // Создание сцены
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x004643); // Цвет фона сайта

      // Создание камеры
      camera = new THREE.PerspectiveCamera(
        75,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      // Создание рендерера
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      mountRef.current.appendChild(renderer.domElement);

      // Создание сферы
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0xf9bc60, // Акцентный цвет сайта
        wireframe: false 
      });
      sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      // Анимация
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        
        // Вращение сферы
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
        
        // Пульсация
        sphere.scale.setScalar(1 + Math.sin(Date.now() * 0.002) * 0.1);
        
        renderer.render(scene, camera);
      };
      
      animate();

      // Обработка изменения размера окна
      const handleResize = () => {
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Очистка при размонтировании
      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    };

    initThree().catch(console.error);

  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-96 rounded-xl overflow-hidden shadow-lg"
      style={{ backgroundColor: '#004643' }}
    />
  );
}

