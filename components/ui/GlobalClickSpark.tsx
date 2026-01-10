"use client";

import { useEffect, useRef, useCallback } from "react";

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

export default function GlobalClickSpark() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const sparkColor = "#c28642";
  const sparkSize = 10;
  const sparkRadius = 20;
  const sparkCount = 10;
  const duration = 500;

  const easeFunc = useCallback((t: number): number => {
    return t * (2 - t); // ease-out
  }, []);

  // Создание canvas и запуск анимации
  useEffect(() => {
    // Создаем canvas элемент
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Обновляем размер при изменении окна
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Функция отрисовки - работает постоянно
    const animate = (timestamp: number) => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Фильтруем и рисуем искры
      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) {
          return false;
        }

        const progress = elapsed / duration;
        const eased = easeFunc(progress);

        const distance = eased * sparkRadius;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      // Продолжаем анимацию постоянно
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Запускаем анимацию
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (canvas && canvas.parentElement) {
        canvas.parentElement.removeChild(canvas);
      }
    };
  }, [easeFunc, sparkColor, sparkSize, sparkRadius, duration]);

  // Обработчик клика на весь документ
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Игнорируем клики на canvas сам по себе
      const target = e.target as HTMLElement;
      if (target.tagName === "CANVAS") return;

      const x = e.clientX;
      const y = e.clientY;

      const now = performance.now();
      const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
      }));

      sparksRef.current.push(...newSparks);
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [sparkCount]);

  return null; // Компонент не рендерит ничего, работает через DOM API
}
