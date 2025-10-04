// 3D рендерер для Stack Game с использованием Three.js
// Заменяет 2D Canvas на 3D сцену с объемными блоками

import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface Stack3DRendererProps {
  stack: Block[];
  currentBlock: Block | null;
  gameOver: boolean;
  onCanvasClick: () => void;
}

const Stack3DRenderer: React.FC<Stack3DRendererProps> = ({
  stack,
  currentBlock,
  gameOver,
  onCanvasClick
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const blocksRef = useRef<THREE.Mesh[]>([]);
  const currentBlockRef = useRef<THREE.Mesh | null>(null);

  // Создание 3D сцены
  const initScene = useCallback(() => {
    if (!mountRef.current) {
      console.error('Mount ref is null');
      return;
    }

    try {
      // Очистка предыдущего содержимого
      mountRef.current.innerHTML = '';

      // Создание сцены
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1a1a2e);
      sceneRef.current = scene;

      // Создание камеры
      const camera = new THREE.PerspectiveCamera(
        75,
        600 / 800, // Соотношение сторон canvas
        0.1,
        1000
      );
      camera.position.set(0, 5, 15);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Создание рендерера
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(600, 800);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      // Освещение
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      // Добавление тестового куба для проверки
      const testGeometry = new THREE.BoxGeometry(2, 2, 2);
      const testMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
      const testCube = new THREE.Mesh(testGeometry, testMaterial);
      testCube.position.set(0, 0, 0);
      scene.add(testCube);

      // Добавление рендерера в DOM
      mountRef.current.appendChild(renderer.domElement);

      // Обработчик клика
      const handleClick = (event: MouseEvent) => {
        if (!gameOver) {
          onCanvasClick();
        }
      };

      renderer.domElement.addEventListener('click', handleClick);

      console.log('3D scene initialized successfully');

      return () => {
        renderer.domElement.removeEventListener('click', handleClick);
      };
    } catch (error) {
      console.error('Error initializing 3D scene:', error);
      // Fallback: показать сообщение об ошибке
      if (mountRef.current) {
        mountRef.current.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">Ошибка загрузки 3D сцены</div>';
      }
    }
  }, [gameOver, onCanvasClick]);

  // Создание 3D блока
  const createBlockMesh = useCallback((block: Block, isCurrent: boolean = false): THREE.Mesh => {
    const geometry = new THREE.BoxGeometry(block.width, block.height, 30);
    
    // Материал с градиентом цвета
    const color = new THREE.Color(block.color);
    const material = new THREE.MeshLambertMaterial({ 
      color,
      transparent: true,
      opacity: isCurrent ? 0.9 : 1.0
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(block.x, block.y, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }, []);

  // Обновление блоков стопки
  const updateStackBlocks = useCallback(() => {
    if (!sceneRef.current) return;

    // Удаляем старые блоки
    blocksRef.current.forEach(block => {
      sceneRef.current?.remove(block);
      block.geometry.dispose();
      if (block.material instanceof THREE.Material) {
        block.material.dispose();
      }
    });
    blocksRef.current = [];

    // Создаем новые блоки
    stack.forEach((block, index) => {
      const mesh = createBlockMesh(block);
      blocksRef.current.push(mesh);
      sceneRef.current?.add(mesh);
    });
  }, [stack, createBlockMesh]);

  // Обновление текущего блока
  const updateCurrentBlock = useCallback(() => {
    if (!sceneRef.current) return;

    // Удаляем старый текущий блок
    if (currentBlockRef.current) {
      sceneRef.current.remove(currentBlockRef.current);
      currentBlockRef.current.geometry.dispose();
      if (currentBlockRef.current.material instanceof THREE.Material) {
        currentBlockRef.current.material.dispose();
      }
      currentBlockRef.current = null;
    }

    // Создаем новый текущий блок
    if (currentBlock) {
      const mesh = createBlockMesh(currentBlock, true);
      currentBlockRef.current = mesh;
      sceneRef.current.add(mesh);
    }
  }, [currentBlock, createBlockMesh]);

  // Анимация текущего блока
  const animateCurrentBlock = useCallback(() => {
    if (currentBlockRef.current && currentBlock) {
      // Легкое покачивание
      currentBlockRef.current.position.x = currentBlock.x + Math.sin(Date.now() * 0.005) * 2;
      currentBlockRef.current.position.y = currentBlock.y;
      
      // Легкое вращение
      currentBlockRef.current.rotation.y += 0.01;
    }

    // Анимация тестового куба
    if (sceneRef.current) {
      const testCube = sceneRef.current.children.find(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry);
      if (testCube) {
        testCube.rotation.x += 0.01;
        testCube.rotation.y += 0.01;
      }
    }
  }, [currentBlock]);

  // Основной цикл рендеринга
  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    animateCurrentBlock();
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationIdRef.current = requestAnimationFrame(animate);
  }, [animateCurrentBlock]);

  // Инициализация при монтировании
  useEffect(() => {
    const cleanup = initScene();
    
    return () => {
      if (cleanup) cleanup();
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [initScene]);

  // Обновление блоков при изменении
  useEffect(() => {
    updateStackBlocks();
  }, [updateStackBlocks]);

  useEffect(() => {
    updateCurrentBlock();
  }, [updateCurrentBlock]);

  // Запуск анимации
  useEffect(() => {
    animate();
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [animate]);

  return (
    <div 
      ref={mountRef} 
      className="stack-canvas-3d"
      style={{ width: '600px', height: '800px', margin: '0 auto' }}
    />
  );
};

export default Stack3DRenderer;
