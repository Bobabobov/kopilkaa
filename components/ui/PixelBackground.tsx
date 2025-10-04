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

    // Пиксельные цвета для неба и облаков
    const skyColors = {
      skyBlue: '#87CEEB',      // Ярко-голубое небо
      lightBlue: '#B0E0E6',    // Светло-голубой
      cloudWhite: '#FFFFFF',   // Белые облака
      cloudGray: '#F0F8FF',    // Светло-серые облака
      cloudShadow: '#E6F3FF'   // Тени облаков
    };

    // Класс для пиксельного облака
    class PixelCloud {
      x: number;
      y: number;
      width: number;
      height: number;
      speedX: number;
      speedY: number;
      segments: number[][];
      time: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 0.7; // Облака только в верхней части
        this.width = Math.random() * 120 + 80;
        this.height = Math.random() * 40 + 20;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.1;
        this.time = Math.random() * Math.PI * 2;
        
        // Создаём сегменты облака для пиксельного вида
        this.segments = this.generateCloudSegments();
      }

      generateCloudSegments(): number[][] {
        const segments = [];
        const segmentCount = Math.floor(this.width / 20);
        
        for (let i = 0; i < segmentCount; i++) {
          const segmentX = (i / segmentCount) * this.width;
          const segmentWidth = this.width / segmentCount;
          const segmentHeight = this.height * (0.7 + Math.random() * 0.6);
          const segmentY = this.height - segmentHeight;
          
          segments.push([segmentX, segmentY, segmentWidth, segmentHeight]);
        }
        
        return segments;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.time += 0.01;

        // Ограничение движения (облака циклически перемещаются)
        if (this.x < -this.width) this.x = canvas.width;
        if (this.x > canvas.width) this.x = -this.width;
        if (this.y < 0) this.y = canvas.height * 0.7;
        if (this.y > canvas.height * 0.7) this.y = 0;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Рисуем сегменты облака
        this.segments.forEach((segment, index) => {
          const [segX, segY, segW, segH] = segment;
          
          // Основное облако
          ctx.fillStyle = skyColors.cloudWhite;
          ctx.fillRect(segX, segY, segW, segH);
          
          // Тень облака
          ctx.fillStyle = skyColors.cloudShadow;
          ctx.fillRect(segX + 2, segY + 2, segW, segH);
          
          // Пиксельная рамка
          ctx.strokeStyle = skyColors.cloudGray;
          ctx.lineWidth = 1;
          ctx.strokeRect(segX, segY, segW, segH);
        });
        
        ctx.restore();
      }
    }

    // Класс для пиксельного солнца
    class PixelSun {
      x: number;
      y: number;
      radius: number;
      time: number;

      constructor() {
        this.x = canvas.width * 0.8;
        this.y = canvas.height * 0.2;
        this.radius = 25;
        this.time = 0;
      }

      update() {
        this.time += 0.02;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Лучи солнца
        const rayCount = 8;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        
        for (let i = 0; i < rayCount; i++) {
          const angle = (i / rayCount) * Math.PI * 2 + this.time;
          const startRadius = this.radius + 5;
          const endRadius = this.radius + 15;
          
          ctx.beginPath();
          ctx.moveTo(
            Math.cos(angle) * startRadius,
            Math.sin(angle) * startRadius
          );
          ctx.lineTo(
            Math.cos(angle) * endRadius,
            Math.sin(angle) * endRadius
          );
          ctx.stroke();
        }
        
        // Само солнце
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
        
        // Рамка солнца
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.strokeRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
        
        ctx.restore();
      }
    }

    // Создаём облака и солнце
    const clouds: PixelCloud[] = [];
    const cloudCount = Math.min(15, Math.floor(canvas.width / 100));
    
    for (let i = 0; i < cloudCount; i++) {
      clouds.push(new PixelCloud());
    }

    const sun = new PixelSun();

    // Функция анимации
    const animate = () => {
      timeRef.current += 0.01;
      
      // Рисуем небо с градиентом
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      const timeVariation = Math.sin(timeRef.current * 0.3) * 0.1;
      
      skyGradient.addColorStop(0, `hsl(${200 + timeVariation * 5}, 70%, ${85 + timeVariation * 5}%)`);
      skyGradient.addColorStop(0.6, `hsl(${210 + timeVariation * 8}, 60%, ${80 + timeVariation * 3}%)`);
      skyGradient.addColorStop(1, `hsl(${220 + timeVariation * 10}, 50%, ${75 + timeVariation * 2}%)`);
      
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Добавляем пиксельную текстуру неба
      ctx.fillStyle = 'rgba(135, 206, 235, 0.1)';
      const pixelSize = 4;
      for (let x = 0; x < canvas.width; x += pixelSize * 2) {
        for (let y = 0; y < canvas.height * 0.7; y += pixelSize * 2) {
          if (Math.random() > 0.95) {
            ctx.fillRect(x, y, pixelSize, pixelSize);
          }
        }
      }
      
      // Обновляем и рисуем солнце
      sun.update();
      sun.draw();
      
      // Обновляем и рисуем облака
      clouds.forEach(cloud => {
        cloud.update();
        cloud.draw();
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
