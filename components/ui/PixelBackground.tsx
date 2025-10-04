"use client";

import { useEffect, useRef } from 'react';

export default function PixelBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Настройка canvas для пиксельного рендеринга
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;

    // Пиксельные цвета в стиле сайта (более тёмные для лучшего контраста)
    const colors = {
      base: '#001a18',      // Очень тёмный базовый
      dark: '#000f0e',      // Почти чёрный
      medium: '#00332e',    // Тёмно-зелёный
      light: '#004d45',     // Средний зелёный
      accent: '#2d5a4e',    // Светло-зелёный
      highlight: '#f9bc60', // Жёлтый акцент
      shadow: '#000000',    // Чёрная тень
      overlay: 'rgba(0, 26, 24, 0.85)' // Полупрозрачный оверлей
    };

    // Массив для хранения кубов с анимационными свойствами
    const cubes: Array<{
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      color: string;
      originalColor: string;
      pulsePhase: number;
      pulseSpeed: number;
      floatPhase: number;
      floatSpeed: number;
      rotationPhase: number;
      rotationSpeed: number;
    }> = [];

    // Функция рисования 3D пиксельного куба
    const drawPixelCube = (cube: typeof cubes[0]) => {
      const { x, y, size, color } = cube;
      const depth = size * 0.6; // Глубина куба
      
      // Пульсация размера
      const pulseScale = 1 + Math.sin(cube.pulsePhase) * 0.1;
      const scaledSize = size * pulseScale;
      const scaledDepth = depth * pulseScale;
      
      // Основная грань (передняя)
      ctx.fillStyle = color;
      ctx.fillRect(x, y, scaledSize, scaledSize);
      
      // Верхняя грань (светлее)
      const topColor = lightenColor(color, 30);
      ctx.fillStyle = topColor;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + scaledDepth, y - scaledDepth);
      ctx.lineTo(x + scaledSize + scaledDepth, y - scaledDepth);
      ctx.lineTo(x + scaledSize, y);
      ctx.closePath();
      ctx.fill();
      
      // Правая грань (темнее)
      const rightColor = darkenColor(color, 25);
      ctx.fillStyle = rightColor;
      ctx.beginPath();
      ctx.moveTo(x + scaledSize, y);
      ctx.lineTo(x + scaledSize + scaledDepth, y - scaledDepth);
      ctx.lineTo(x + scaledSize + scaledDepth, y + scaledSize - scaledDepth);
      ctx.lineTo(x + scaledSize, y + scaledSize);
      ctx.closePath();
      ctx.fill();
      
      // Пиксельные контуры
      ctx.strokeStyle = darkenColor(color, 40);
      ctx.lineWidth = 1;
      
      // Передняя грань
      ctx.strokeRect(x, y, scaledSize, scaledSize);
      
      // Верхняя грань
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + scaledDepth, y - scaledDepth);
      ctx.lineTo(x + scaledSize + scaledDepth, y - scaledDepth);
      ctx.lineTo(x + scaledSize, y);
      ctx.stroke();
      
      // Правая грань
      ctx.beginPath();
      ctx.moveTo(x + scaledSize, y);
      ctx.lineTo(x + scaledSize + scaledDepth, y - scaledDepth);
      ctx.lineTo(x + scaledSize + scaledDepth, y + scaledSize - scaledDepth);
      ctx.lineTo(x + scaledSize, y + scaledSize);
      ctx.stroke();
    };

    // Функция осветления цвета
    const lightenColor = (color: string, amount: number): string => {
      const num = parseInt(color.replace("#", ""), 16);
      const r = Math.min(255, ((num >> 16) & 255) + amount);
      const g = Math.min(255, ((num >> 8) & 255) + amount);
      const b = Math.min(255, (num & 255) + amount);
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    };

    // Функция затемнения цвета
    const darkenColor = (color: string, amount: number): string => {
      const num = parseInt(color.replace("#", ""), 16);
      const r = Math.max(0, ((num >> 16) & 255) - amount);
      const g = Math.max(0, ((num >> 8) & 255) - amount);
      const b = Math.max(0, (num & 255) - amount);
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    };

    // Инициализация кубов
    const initializeCubes = () => {
      cubes.length = 0;
      const cubeSize = 32;
      const spacing = 60;
      
      // Создаём сетку кубов
      for (let x = 0; x < canvas.width + cubeSize; x += spacing) {
        for (let y = 0; y < canvas.height + cubeSize; y += spacing) {
          // Случайный выбор цвета
          const colorOptions = [colors.medium, colors.light, colors.accent, colors.highlight];
          const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
          
          // Случайный размер (но кратный 8 для пиксельного вида)
          const size = Math.floor((Math.random() * 3 + 1)) * 8;
          
          // Случайное смещение для естественности
          const offsetX = (Math.random() - 0.5) * 30;
          const offsetY = (Math.random() - 0.5) * 30;
          
          cubes.push({
            x: x + offsetX,
            y: y + offsetY,
            baseX: x + offsetX,
            baseY: y + offsetY,
            size,
            color,
            originalColor: color,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: (Math.random() - 0.5) * 0.02,
            floatPhase: Math.random() * Math.PI * 2,
            floatSpeed: (Math.random() - 0.5) * 0.01,
            rotationPhase: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.005
          });
        }
      }
      
      // Добавляем несколько крупных кубов для акцентов
      const largeCubes = [
        { x: canvas.width * 0.1, y: canvas.height * 0.2, size: 48, color: colors.highlight },
        { x: canvas.width * 0.8, y: canvas.height * 0.3, size: 40, color: colors.accent },
        { x: canvas.width * 0.2, y: canvas.height * 0.7, size: 56, color: colors.light },
        { x: canvas.width * 0.7, y: canvas.height * 0.8, size: 44, color: colors.medium }
      ];
      
      largeCubes.forEach(cube => {
        cubes.push({
          x: cube.x,
          y: cube.y,
          baseX: cube.x,
          baseY: cube.y,
          size: cube.size,
          color: cube.color,
          originalColor: cube.color,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: (Math.random() - 0.5) * 0.02,
          floatPhase: Math.random() * Math.PI * 2,
          floatSpeed: (Math.random() - 0.5) * 0.01,
          rotationPhase: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.005
        });
      });
    };

    // Обновление анимации кубов
    const updateCubes = () => {
      cubes.forEach(cube => {
        // Обновляем фазы
        cube.pulsePhase += cube.pulseSpeed;
        cube.floatPhase += cube.floatSpeed;
        cube.rotationPhase += cube.rotationSpeed;
        
        // Плавающее движение
        cube.x = cube.baseX + Math.sin(cube.floatPhase) * 5;
        cube.y = cube.baseY + Math.cos(cube.floatPhase * 0.7) * 3;
        
        // Пульсация цвета
        const colorVariation = Math.sin(cube.pulsePhase) * 15;
        cube.color = lightenColor(cube.originalColor, colorVariation);
      });
    };

    // Функция рисования фона
    const drawBackground = () => {
      // Очищаем canvas
      ctx.fillStyle = colors.base;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Добавляем градиентный фон с пульсацией
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      const timeVariation = Math.sin(timeRef.current * 0.3) * 0.05;
      
      gradient.addColorStop(0, lightenColor(colors.dark, timeVariation * 10));
      gradient.addColorStop(0.5, lightenColor(colors.base, timeVariation * 5));
      gradient.addColorStop(1, lightenColor(colors.medium, timeVariation * 3));
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Рисуем кубы
      cubes.forEach(cube => {
        drawPixelCube(cube);
      });
      
      // Добавляем полупрозрачный оверлей для лучшего контраста текста
      ctx.fillStyle = colors.overlay;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Добавляем пиксельную текстуру с пульсацией
      const textureIntensity = 0.05 + Math.sin(timeRef.current * 0.5) * 0.02;
      ctx.fillStyle = `rgba(171, 209, 198, ${textureIntensity})`;
      const pixelSize = 2;
      for (let x = 0; x < canvas.width; x += pixelSize * 4) {
        for (let y = 0; y < canvas.height; y += pixelSize * 4) {
          if (Math.random() > 0.98) {
            ctx.fillRect(x, y, pixelSize, pixelSize);
          }
        }
      }
    };

    // Анимационный цикл
    const animate = () => {
      timeRef.current += 0.01;
      updateCubes();
      drawBackground();
      animationRef.current = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeCubes();
    };

    // Инициализация
    resizeCanvas();
    animate();
    
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{
        imageRendering: 'pixelated',
        WebkitImageRendering: 'pixelated',
        msInterpolationMode: 'nearest-neighbor'
      }}
    />
  );
}
