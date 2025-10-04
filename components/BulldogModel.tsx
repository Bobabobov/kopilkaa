"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface BulldogModelProps {
  mood: 'happy' | 'hungry' | 'sad';
  feedAnim: boolean;
}

export default function BulldogModel({ mood, feedAnim }: BulldogModelProps) {
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
    camera.position.z = 5;

    // Создание рендерера
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Создание мультяшного бульдога
    const bulldogGroup = new THREE.Group();
    bulldogRef.current = bulldogGroup;

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

      // Анимация ушей
      const leftEar = bulldogGroup.getObjectByName('leftEar');
      const rightEar = bulldogGroup.getObjectByName('rightEar');
      if (leftEar && rightEar) {
        leftEar.rotation.z = Math.sin(time * 1.2) * 0.1;
        rightEar.rotation.z = Math.sin(time * 1.2 + Math.PI) * 0.1;
      }

      // Пульсация туловища
      const bodyScale = 1 + Math.sin(time * 1.8) * 0.05;
      body.scale.setScalar(bodyScale);

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

    // Обновляем цвет всех частей кроме черных деталей
    bulldogGroup.traverse((child) => {
      if (child.material && child.material.color.getHex() !== 0x000000) {
        child.material.color.setHex(color);
      }
    });
  }, [mood]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full cursor-grab active:cursor-grabbing"
    />
  );
}

// Экспортируем старые функции для совместимости
export function createBulldogModel(): THREE.Group {
  const bulldogGroup = new THREE.Group();
  
  // Тело (основная сфера, более детализированная)
  const bodyGeometry = new THREE.SphereGeometry(0.8, 24, 24);
  const bodyMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x8B4513, // Коричневый цвет бульдога
    wireframe: false 
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.scale.set(1.2, 0.8, 1.4); // Более реалистичные пропорции
  bulldogGroup.add(body);
  
  // Голова (более детализированная)
  const headGeometry = new THREE.SphereGeometry(0.7, 24, 24);
  const headMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x8B4513, // Коричневый цвет
    wireframe: false 
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.set(0, 0.4, 1.0);
  head.scale.set(1.1, 0.9, 1.0); // Более плоская голова
  bulldogGroup.add(head);
  
  // Морда (более выраженная)
  const snoutGeometry = new THREE.SphereGeometry(0.25, 16, 16);
  const snoutMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xDEB887, // Светло-коричневый для морды
    wireframe: false 
  });
  const snout = new THREE.Mesh(snoutGeometry, snoutMaterial);
  snout.position.set(0, -0.05, 1.3);
  snout.scale.set(0.9, 0.7, 0.9);
  bulldogGroup.add(snout);
  
  // Нос (маленькая сфера)
  const noseGeometry = new THREE.SphereGeometry(0.08, 12, 12);
  const noseMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x000000, // Черный нос
    wireframe: false 
  });
  const nose = new THREE.Mesh(noseGeometry, noseMaterial);
  nose.position.set(0, -0.1, 1.45);
  bulldogGroup.add(nose);
  
  // Уши (более детализированные)
  const earGeometry = new THREE.SphereGeometry(0.18, 12, 12);
  const earMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x654321, // Темно-коричневые уши
    wireframe: false 
  });
  
  const leftEar = new THREE.Mesh(earGeometry, earMaterial);
  leftEar.position.set(-0.5, 0.3, 0.8);
  leftEar.scale.set(0.6, 1.2, 0.4);
  leftEar.rotation.z = -0.3;
  bulldogGroup.add(leftEar);
  
  const rightEar = new THREE.Mesh(earGeometry, earMaterial);
  rightEar.position.set(0.5, 0.3, 0.8);
  rightEar.scale.set(0.6, 1.2, 0.4);
  rightEar.rotation.z = 0.3;
  bulldogGroup.add(rightEar);
  
  // Глаза (более выразительные)
  const eyeGeometry = new THREE.SphereGeometry(0.1, 12, 12);
  const eyeMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x000000, // Черные глаза
    wireframe: false 
  });
  
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.25, 0.15, 1.15);
  bulldogGroup.add(leftEye);
  
  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(0.25, 0.15, 1.15);
  bulldogGroup.add(rightEye);
  
  // Брови (маленькие цилиндры)
  const browGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
  const browMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x654321, // Темно-коричневые брови
    wireframe: false 
  });
  
  const leftBrow = new THREE.Mesh(browGeometry, browMaterial);
  leftBrow.position.set(-0.25, 0.25, 1.1);
  leftBrow.rotation.z = 0.2;
  bulldogGroup.add(leftBrow);
  
  const rightBrow = new THREE.Mesh(browGeometry, browMaterial);
  rightBrow.position.set(0.25, 0.25, 1.1);
  rightBrow.rotation.z = -0.2;
  bulldogGroup.add(rightBrow);
  
  // Щеки (маленькие сферы)
  const cheekGeometry = new THREE.SphereGeometry(0.12, 12, 12);
  const cheekMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xDEB887, // Светло-коричневые щеки
    wireframe: false 
  });
  
  const leftCheek = new THREE.Mesh(cheekGeometry, cheekMaterial);
  leftCheek.position.set(-0.4, -0.1, 1.2);
  leftCheek.scale.set(1, 0.8, 0.8);
  bulldogGroup.add(leftCheek);
  
  const rightCheek = new THREE.Mesh(cheekGeometry, cheekMaterial);
  rightCheek.position.set(0.4, -0.1, 1.2);
  rightCheek.scale.set(1, 0.8, 0.8);
  bulldogGroup.add(rightCheek);
  
  // Передние лапы (более детализированные)
  const frontLegGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.5, 12);
  const legMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x8B4513, // Коричневые лапы
    wireframe: false 
  });
  
  const frontLeftLeg = new THREE.Mesh(frontLegGeometry, legMaterial);
  frontLeftLeg.position.set(-0.4, -0.7, 0.4);
  frontLeftLeg.rotation.x = 0.1;
  bulldogGroup.add(frontLeftLeg);
  
  const frontRightLeg = new THREE.Mesh(frontLegGeometry, legMaterial);
  frontRightLeg.position.set(0.4, -0.7, 0.4);
  frontRightLeg.rotation.x = 0.1;
  bulldogGroup.add(frontRightLeg);
  
  // Задние лапы
  const backLegGeometry = new THREE.CylinderGeometry(0.15, 0.18, 0.6, 12);
  
  const backLeftLeg = new THREE.Mesh(backLegGeometry, legMaterial);
  backLeftLeg.position.set(-0.4, -0.8, -0.4);
  backLeftLeg.rotation.x = -0.1;
  bulldogGroup.add(backLeftLeg);
  
  const backRightLeg = new THREE.Mesh(backLegGeometry, legMaterial);
  backRightLeg.position.set(0.4, -0.8, -0.4);
  backRightLeg.rotation.x = -0.1;
  bulldogGroup.add(backRightLeg);
  
  // Лапки (маленькие сферы)
  const pawGeometry = new THREE.SphereGeometry(0.08, 8, 8);
  const pawMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x000000, // Черные лапки
    wireframe: false 
  });
  
  const frontLeftPaw = new THREE.Mesh(pawGeometry, pawMaterial);
  frontLeftPaw.position.set(-0.4, -0.95, 0.4);
  bulldogGroup.add(frontLeftPaw);
  
  const frontRightPaw = new THREE.Mesh(pawGeometry, pawMaterial);
  frontRightPaw.position.set(0.4, -0.95, 0.4);
  bulldogGroup.add(frontRightPaw);
  
  const backLeftPaw = new THREE.Mesh(pawGeometry, pawMaterial);
  backLeftPaw.position.set(-0.4, -1.1, -0.4);
  bulldogGroup.add(backLeftPaw);
  
  const backRightPaw = new THREE.Mesh(pawGeometry, pawMaterial);
  backRightPaw.position.set(0.4, -1.1, -0.4);
  bulldogGroup.add(backRightPaw);
  
  // Хвост (маленький цилиндр)
  const tailGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.3, 8);
  const tailMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x8B4513, // Коричневый хвост
    wireframe: false 
  });
  const tail = new THREE.Mesh(tailGeometry, tailMaterial);
  tail.position.set(0, 0.2, -1.0);
  tail.rotation.x = 0.5;
  bulldogGroup.add(tail);
  
  // Складки на теле (маленькие цилиндры)
  const wrinkleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
  const wrinkleMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x654321, // Темно-коричневые складки
    wireframe: false 
  });
  
  const wrinkle1 = new THREE.Mesh(wrinkleGeometry, wrinkleMaterial);
  wrinkle1.position.set(0, 0.1, 0.2);
  wrinkle1.rotation.z = Math.PI / 2;
  bulldogGroup.add(wrinkle1);
  
  const wrinkle2 = new THREE.Mesh(wrinkleGeometry, wrinkleMaterial);
  wrinkle2.position.set(0, -0.1, 0.2);
  wrinkle2.rotation.z = Math.PI / 2;
  bulldogGroup.add(wrinkle2);
  
  return bulldogGroup;
}

export function updateBulldogColor(bulldogGroup: THREE.Group, color: number): void {
  bulldogGroup.traverse((child) => {
    if (child.material && child.material.color.getHex() !== 0x000000) {
      child.material.color.setHex(color);
    }
  });
}
