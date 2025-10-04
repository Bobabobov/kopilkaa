"use client";

import { useEffect, useRef, useState } from 'react';

export default function PixelBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

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

    // Массив для хранения кубов
    const cubes: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      originalColor: string;
      hovered: boolean;
    }> = [];

    // Функция рисования 3D пиксельного куба
    const drawPixelCube = (cube: typeof cubes[0]) => {
      const { x, y, size, color, hovered } = cube;
      const depth = size * 0.6; // Глубина куба
      
      // Эффект hover - увеличение и свечение
      const scale = hovered ? 1.2 : 1;
      const glowIntensity = hovered ? 0.3 : 0;
      const scaledSize = size * scale;
      const scaledDepth = depth * scale;
      
      // Свечение при hover
      if (hovered) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
      }
      
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
      
      // Сбрасываем тень
      ctx.shadowBlur = 0;
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
      const spacing = 50;
      
      // Создаём сетку кубов
      for (let x = 0; x < canvas.width + cubeSize; x += spacing) {
        for (let y = 0; y < canvas.height + cubeSize; y += spacing) {
          // Случайный выбор цвета
          const colorOptions = [colors.medium, colors.light, colors.accent, colors.highlight];
          const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
          
          // Случайный размер (но кратный 8 для пиксельного вида)
          const size = Math.floor((Math.random() * 3 + 1)) * 8;
          
          // Случайное смещение для естественности
          const offsetX = (Math.random() - 0.5) * 20;
          const offsetY = (Math.random() - 0.5) * 20;
          
          cubes.push({
            x: x + offsetX,
            y: y + offsetY,
            size,
            color,
            originalColor: color,
            hovered: false
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
          size: cube.size,
          color: cube.color,
          originalColor: cube.color,
          hovered: false
        });
      });
    };

    // Функция проверки hover
    const checkHover = () => {
      cubes.forEach(cube => {
        const distance = Math.sqrt(
          Math.pow(mousePos.x - (cube.x + cube.size/2), 2) + 
          Math.pow(mousePos.y - (cube.y + cube.size/2), 2)
        );
        const wasHovered = cube.hovered;
        cube.hovered = distance < 60; // Радиус hover
        
        if (cube.hovered) {
          cube.color = lightenColor(cube.originalColor, 40);
        } else {
          cube.color = cube.originalColor;
        }
      });
    };

    // Функция рисования фона
    const drawBackground = () => {
      // Очищаем canvas
      ctx.fillStyle = colors.base;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Добавляем градиентный фон
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, colors.dark);
      gradient.addColorStop(0.5, colors.base);
      gradient.addColorStop(1, colors.medium);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Рисуем кубы
      cubes.forEach(cube => {
        drawPixelCube(cube);
      });
      
      // Добавляем полупрозрачный оверлей для лучшего контраста текста
      ctx.fillStyle = colors.overlay;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Добавляем пиксельную текстуру
      ctx.fillStyle = 'rgba(171, 209, 198, 0.05)';
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
      checkHover();
      drawBackground();
      animationRef.current = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeCubes();
    };

    // Обработчики событий
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    // Инициализация
    resizeCanvas();
    animate();
    
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos]);

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
