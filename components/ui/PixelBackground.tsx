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

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Low Poly / Пиксельные цвета
    const colors = [
      '#004643', // Основной тёмно-зелёный
      '#0f4c3a', // Тёмно-зелёный
      '#2d5a4e', // Средне-зелёный
      '#abd1c6', // Светло-зелёный
      '#f9bc60', // Жёлтый
      '#e16162', // Красный
      '#f38ba8', // Розовый
      '#a786df', // Фиолетовый
      '#7dc4e4', // Голубой
    ];

    // Класс для пиксельного блока
    class PixelBlock {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      pulse: number;
      pulseSpeed: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 40 + 20;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = (Math.random() - 0.5) * 0.03;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.pulse += this.pulseSpeed;

        // Ограничение движения
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        const pulseScale = 1 + Math.sin(this.pulse) * 0.1;
        const currentSize = this.size * pulseScale;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Рисуем пиксельный блок с градиентом
        const gradient = ctx.createLinearGradient(-currentSize/2, -currentSize/2, currentSize/2, currentSize/2);
        const colorVariation = Math.sin(this.pulse) * 20;
        
        // Создаём пиксельный эффект через цветовые вариации
        const baseColor = this.color;
        const lightColor = this.lightenColor(baseColor, colorVariation);
        const darkColor = this.darkenColor(baseColor, colorVariation);
        
        gradient.addColorStop(0, lightColor);
        gradient.addColorStop(0.5, baseColor);
        gradient.addColorStop(1, darkColor);

        ctx.fillStyle = gradient;
        ctx.fillRect(-currentSize/2, -currentSize/2, currentSize, currentSize);
        
        // Добавляем пиксельную рамку
        ctx.strokeStyle = this.lightenColor(baseColor, 30);
        ctx.lineWidth = 1;
        ctx.strokeRect(-currentSize/2, -currentSize/2, currentSize, currentSize);
        
        ctx.restore();
      }

      lightenColor(color: string, amount: number): string {
        const num = parseInt(color.replace("#", ""), 16);
        const r = Math.min(255, ((num >> 16) & 255) + amount);
        const g = Math.min(255, ((num >> 8) & 255) + amount);
        const b = Math.min(255, (num & 255) + amount);
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
      }

      darkenColor(color: string, amount: number): string {
        const num = parseInt(color.replace("#", ""), 16);
        const r = Math.max(0, ((num >> 16) & 255) - amount);
        const g = Math.max(0, ((num >> 8) & 255) - amount);
        const b = Math.max(0, (num & 255) - amount);
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
      }
    }

    // Создаём блоки
    const blocks: PixelBlock[] = [];
    const blockCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 10000));
    
    for (let i = 0; i < blockCount; i++) {
      blocks.push(new PixelBlock());
    }

    // Функция анимации
    const animate = () => {
      timeRef.current += 0.01;
      
      // Очищаем canvas
      ctx.fillStyle = '#004643';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Добавляем градиентный фон с пиксельным эффектом
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const timeVariation = Math.sin(timeRef.current * 0.5) * 0.1;
      
      bgGradient.addColorStop(0, `hsl(${180 + timeVariation * 10}, 70%, ${15 + timeVariation * 5}%)`);
      bgGradient.addColorStop(0.5, `hsl(${200 + timeVariation * 15}, 60%, ${12 + timeVariation * 3}%)`);
      bgGradient.addColorStop(1, `hsl(${220 + timeVariation * 20}, 50%, ${10 + timeVariation * 2}%)`);
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Рисуем пиксельную сетку для Low Poly эффекта
      ctx.strokeStyle = 'rgba(171, 209, 198, 0.1)';
      ctx.lineWidth = 0.5;
      
      const gridSize = 50;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Обновляем и рисуем блоки
      blocks.forEach(block => {
        block.update();
        block.draw();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

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
