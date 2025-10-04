"use client";

import { useEffect, useRef } from 'react';

export default function PixelBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawStaticBackground();
    };

    // Пиксельные цвета в стиле сайта
    const colors = {
      base: '#004643',      // Основной тёмно-зелёный
      dark: '#002e2b',      // Очень тёмный
      medium: '#0f4c3a',    // Средний зелёный
      light: '#2d5a4e',     // Светло-зелёный
      accent: '#abd1c6',    // Акцентный
      highlight: '#f9bc60', // Жёлтый акцент
      shadow: '#001a18'     // Тень
    };

    // Функция рисования 3D пиксельного куба
    const drawPixelCube = (x: number, y: number, size: number, color: string) => {
      const depth = size * 0.6; // Глубина куба
      
      // Основная грань (передняя)
      ctx.fillStyle = color;
      ctx.fillRect(x, y, size, size);
      
      // Верхняя грань (светлее)
      const topColor = lightenColor(color, 30);
      ctx.fillStyle = topColor;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + depth, y - depth);
      ctx.lineTo(x + size + depth, y - depth);
      ctx.lineTo(x + size, y);
      ctx.closePath();
      ctx.fill();
      
      // Правая грань (темнее)
      const rightColor = darkenColor(color, 25);
      ctx.fillStyle = rightColor;
      ctx.beginPath();
      ctx.moveTo(x + size, y);
      ctx.lineTo(x + size + depth, y - depth);
      ctx.lineTo(x + size + depth, y + size - depth);
      ctx.lineTo(x + size, y + size);
      ctx.closePath();
      ctx.fill();
      
      // Пиксельные контуры
      ctx.strokeStyle = darkenColor(color, 40);
      ctx.lineWidth = 1;
      
      // Передняя грань
      ctx.strokeRect(x, y, size, size);
      
      // Верхняя грань
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + depth, y - depth);
      ctx.lineTo(x + size + depth, y - depth);
      ctx.lineTo(x + size, y);
      ctx.stroke();
      
      // Правая грань
      ctx.beginPath();
      ctx.moveTo(x + size, y);
      ctx.lineTo(x + size + depth, y - depth);
      ctx.lineTo(x + size + depth, y + size - depth);
      ctx.lineTo(x + size, y + size);
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

    // Функция рисования статичного фона
    const drawStaticBackground = () => {
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
      
      // Рисуем пиксельные кубы разных размеров
      const cubeSize = 32;
      const spacing = 40;
      
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
          
          drawPixelCube(x + offsetX, y + offsetY, size, color);
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
        drawPixelCube(cube.x, cube.y, cube.size, cube.color);
      });
      
      // Добавляем пиксельную текстуру
      ctx.fillStyle = 'rgba(171, 209, 198, 0.1)';
      const pixelSize = 2;
      for (let x = 0; x < canvas.width; x += pixelSize * 3) {
        for (let y = 0; y < canvas.height; y += pixelSize * 3) {
          if (Math.random() > 0.95) {
            ctx.fillRect(x, y, pixelSize, pixelSize);
          }
        }
      }
    };

    // Инициализация
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
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
