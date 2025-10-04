"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface BulldogModelProps {
  mood: 'happy' | 'hungry' | 'sad';
  feedAnim: boolean;
  scale?: number;
}

export default function BulldogModel({ mood, feedAnim, scale = 1.0 }: BulldogModelProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const bulldogRef = useRef<THREE.Group>();
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Создание сцены
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x004643);
    sceneRef.current = scene;

    // Создание камеры
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5); // Центрируем камеру

    // Создание рендерера
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Загрузка GLB модели
    const loader = new GLTFLoader();
    const bulldogGroup = new THREE.Group();
    bulldogRef.current = bulldogGroup;

    loader.load('/french_bulldog.glb', (gltf) => {
      const model = gltf.scene;
      
      // Масштабируем модель под нужный размер
      model.scale.setScalar(scale);
      
      // Центрируем модель
      model.position.set(0, 0, 0);
      
      // Исправляем освещение и материалы
      model.traverse((child) => {
        if (child.material) {
          // Делаем материал более ярким
          child.material.color.setHex(0x8B4513); // Коричневый цвет
          child.material.emissive.setHex(0x222222); // Добавляем свечение
          child.material.emissiveIntensity = 0.1;
        }
      });
      
      // Добавляем освещение для лучшей видимости
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);
      
      // Добавляем модель в группу
      bulldogGroup.add(model);
      
      // Сохраняем ссылки на части для анимации
      const head = model.getObjectByName('head') || model.children[0];
      const tail = model.getObjectByName('tail') || model.children.find(child => child.name.includes('tail'));
      
      if (head) head.name = 'head';
      if (tail) tail.name = 'tail';
      
    }, undefined, (error) => {
      console.error('Ошибка загрузки модели:', error);
      
      // Fallback - создаем простого бульдога если модель не загрузилась
      createFallbackBulldog(bulldogGroup);
    });

    scene.add(bulldogGroup);

    // Добавляем контролы для вращения мышью
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    let rotationX = 0;
    let rotationY = 0;

    const handleMouseDown = (event: MouseEvent) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseDown) return;
      
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      rotationY += deltaX * 0.01;
      rotationX += deltaY * 0.01;
      
      // Ограничиваем вертикальное вращение
      rotationX = Math.max(-Math.PI/3, Math.min(Math.PI/3, rotationX));
      
      bulldogGroup.rotation.x = rotationX;
      bulldogGroup.rotation.y = rotationY;
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    mountRef.current.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Анимация
    let time = 0;
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      time += 0.02;

      // Анимация головы (наклон из стороны в сторону)
      const head = bulldogGroup.getObjectByName('head');
      if (head) {
        head.rotation.z = Math.sin(time * 1.5) * 0.1;
      }

      // Анимация хвоста (виляние)
      const tail = bulldogGroup.getObjectByName('tail');
      if (tail) {
        tail.rotation.z = Math.sin(time * 2) * 0.3;
      }

      // Анимация кормления
      if (feedAnim) {
        bulldogGroup.position.y = Math.sin(time * 8) * 0.3;
      } else {
        bulldogGroup.position.y = 0;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Обработка изменения размера
    const handleResize = () => {
      camera.aspect = mountRef.current!.clientWidth / mountRef.current!.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current!.clientWidth, mountRef.current!.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Очистка
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousedown', handleMouseDown);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [feedAnim]);

  // Обновление настроения
  useEffect(() => {
    if (!bulldogRef.current) return;

    const bulldogGroup = bulldogRef.current;
    let color: number;

    switch (mood) {
      case 'happy':
        color = 0x8B4513; // Коричневый
        break;
      case 'hungry':
        color = 0xD2691E; // Темно-оранжевый
        break;
      case 'sad':
        color = 0x8B0000; // Темно-красный
        break;
      default:
        color = 0x8B4513;
    }

    // Обновляем цвет всех частей модели
    bulldogGroup.traverse((child) => {
      if (child.material) {
        // Проверяем, не является ли это черной деталью (глаза, нос, лапки)
        const isBlackPart = child.material.color.getHex() === 0x000000;
        
        if (!isBlackPart) {
          child.material.color.setHex(color);
          // Добавляем небольшое свечение для лучшей видимости
          child.material.emissive.setHex(color);
          child.material.emissiveIntensity = 0.05;
        }
      }
    });
  }, [mood]);

  // Обновление размера модели
  useEffect(() => {
    if (!bulldogRef.current) return;

    const bulldogGroup = bulldogRef.current;
    
    // Обновляем размер всех частей модели
    bulldogGroup.traverse((child) => {
      if (child.scale) {
        child.scale.setScalar(scale);
      }
    });
  }, [scale]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
    />
  );
}

// Fallback функция для создания простого бульдога
function createFallbackBulldog(bulldogGroup: THREE.Group) {
  // Туловище (большая сфера)
  const bodyGeometry = new THREE.SphereGeometry(0.8, 16, 16);
  const bodyMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x8B4513,
    wireframe: false 
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.scale.set(1.2, 0.9, 1.3);
  bulldogGroup.add(body);

  // Голова (сфера)
  const headGeometry = new THREE.SphereGeometry(0.6, 16, 16);
  const headMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x8B4513,
    wireframe: false 
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.set(0, 0.3, 0.9);
  head.scale.set(1.1, 0.8, 1.0);
  head.name = 'head';
  bulldogGroup.add(head);

  // Уши (маленькие сферы)
  const earGeometry = new THREE.SphereGeometry(0.15, 8, 8);
  const earMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x654321,
    wireframe: false 
  });

  const leftEar = new THREE.Mesh(earGeometry, earMaterial);
  leftEar.position.set(-0.4, 0.2, 0.7);
  leftEar.scale.set(0.5, 1.2, 0.3);
  leftEar.name = 'leftEar';
  bulldogGroup.add(leftEar);

  const rightEar = new THREE.Mesh(earGeometry, earMaterial);
  rightEar.position.set(0.4, 0.2, 0.7);
  rightEar.scale.set(0.5, 1.2, 0.3);
  rightEar.name = 'rightEar';
  bulldogGroup.add(rightEar);

  // Морда
  const snoutGeometry = new THREE.SphereGeometry(0.2, 12, 12);
  const snoutMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xDEB887,
    wireframe: false 
  });
  const snout = new THREE.Mesh(snoutGeometry, snoutMaterial);
  snout.position.set(0, -0.05, 1.2);
  snout.scale.set(0.8, 0.6, 0.8);
  bulldogGroup.add(snout);

  // Нос
  const noseGeometry = new THREE.SphereGeometry(0.06, 8, 8);
  const noseMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x000000,
    wireframe: false 
  });
  const nose = new THREE.Mesh(noseGeometry, noseMaterial);
  nose.position.set(0, -0.1, 1.35);
  bulldogGroup.add(nose);

  // Глаза (выступающие из головы)
  const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
  const eyeMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x000000,
    wireframe: false 
  });

  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.2, 0.1, 1.15); // Выдвигаем вперед
  bulldogGroup.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(0.2, 0.1, 1.15); // Выдвигаем вперед
  bulldogGroup.add(rightEye);

  // Лапы (цилиндры)
  const legGeometry = new THREE.CylinderGeometry(0.1, 0.12, 0.4, 8);
  const legMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x8B4513,
    wireframe: false 
  });

  const frontLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
  frontLeftLeg.position.set(-0.3, -0.6, 0.3);
  bulldogGroup.add(frontLeftLeg);

  const frontRightLeg = new THREE.Mesh(legGeometry, legMaterial);
  frontRightLeg.position.set(0.3, -0.6, 0.3);
  bulldogGroup.add(frontRightLeg);

  const backLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
  backLeftLeg.position.set(-0.3, -0.6, -0.3);
  bulldogGroup.add(backLeftLeg);

  const backRightLeg = new THREE.Mesh(legGeometry, legMaterial);
  backRightLeg.position.set(0.3, -0.6, -0.3);
  bulldogGroup.add(backRightLeg);

  // Лапки
  const pawGeometry = new THREE.SphereGeometry(0.06, 6, 6);
  const pawMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x000000,
    wireframe: false 
  });

  const frontLeftPaw = new THREE.Mesh(pawGeometry, pawMaterial);
  frontLeftPaw.position.set(-0.3, -0.8, 0.3);
  bulldogGroup.add(frontLeftPaw);

  const frontRightPaw = new THREE.Mesh(pawGeometry, pawMaterial);
  frontRightPaw.position.set(0.3, -0.8, 0.3);
  bulldogGroup.add(frontRightPaw);

  const backLeftPaw = new THREE.Mesh(pawGeometry, pawMaterial);
  backLeftPaw.position.set(-0.3, -0.8, -0.3);
  bulldogGroup.add(backLeftPaw);

  const backRightPaw = new THREE.Mesh(pawGeometry, pawMaterial);
  backRightPaw.position.set(0.3, -0.8, -0.3);
  bulldogGroup.add(backRightPaw);

  // Хвост (цилиндр)
  const tailGeometry = new THREE.CylinderGeometry(0.04, 0.06, 0.25, 6);
  const tailMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x8B4513,
    wireframe: false 
  });
  const tail = new THREE.Mesh(tailGeometry, tailMaterial);
  tail.position.set(0, 0.1, -0.9);
  tail.rotation.x = 0.3;
  tail.name = 'tail';
  bulldogGroup.add(tail);
}
