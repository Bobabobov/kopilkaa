"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import { stackService } from '../../../services/games/stackService';

// Интерфейс для блока в игре
interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

// Хук с игровой логикой Stack Game
// Управляет состоянием игры: блоки, коллизии, счёт, анимация
export const useStackGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const gameLoopRef = useRef<number | undefined>(undefined);

  // Основное состояние игры
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Игровые объекты
  const [stack, setStack] = useState<Block[]>([]);
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
  const [blockDirection, setBlockDirection] = useState<'left' | 'right'>('right');
  const [blockSpeed, setBlockSpeed] = useState(2);

  // Инициализация игры
  const initializeGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Загружаем лучший результат из localStorage
    const savedBestScore = localStorage.getItem('stackGameBestScore');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }

    // Создаём базовый блок
    const baseBlock: Block = {
      x: 50,
      y: canvas.height - 30,
      width: 300,
      height: 30,
      color: '#4F46E5'
    };

    setStack([baseBlock]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  // Создание нового движущегося блока (классическая Stack механика)
  const createNewBlock = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const lastBlock = stack[stack.length - 1];
    const newY = lastBlock.y - 30; // Над последним блоком
    
    // Блок начинается с края экрана и движется горизонтально
    const startX = blockDirection === 'right' ? 0 : canvas.width - lastBlock.width;

    const newBlock: Block = {
      x: startX,
      y: newY,
      width: lastBlock.width, // Начинаем с ширины предыдущего блока
      height: 30,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    };

    setCurrentBlock(newBlock);
    setBlockDirection(blockDirection === 'right' ? 'left' : 'right');
    
    // Увеличиваем скорость каждые 3 блока
    const speedIncrease = Math.floor(stack.length / 3) * 0.3;
    setBlockSpeed(Math.min(2 + speedIncrease, 8));
  }, [stack.length, blockDirection]);

  // Движение блока горизонтально (классическая Stack механика)
  const moveBlock = useCallback(() => {
    setCurrentBlock(prev => {
      if (!prev) return prev;
      
      const canvas = canvasRef.current;
      if (!canvas) return prev;

      let newX = prev.x;
      
      // Движение в зависимости от направления
      if (blockDirection === 'right') {
        newX = Math.min(prev.x + blockSpeed, canvas.width - prev.width);
      } else {
        newX = Math.max(prev.x - blockSpeed, 0);
      }

      return { ...prev, x: newX };
    });
  }, [blockDirection, blockSpeed]);

  // Размещение блока с алгоритмом обрезки (классическая Stack механика)
  const placeBlock = useCallback(() => {
    if (!currentBlock || stack.length === 0) return;

    const lastBlock = stack[stack.length - 1];
    const tolerance = 15; // Допустимое отклонение для идеального попадания
    
    // Вычисляем границы блоков
    const currentLeft = currentBlock.x;
    const currentRight = currentBlock.x + currentBlock.width;
    const topLeft = lastBlock.x;
    const topRight = lastBlock.x + lastBlock.width;
    
    // Алгоритм обрезки: overlap = min(right_current, right_top) - max(left_current, left_top)
    const overlap = Math.min(currentRight, topRight) - Math.max(currentLeft, topLeft);
    
    if (overlap <= 0) {
      // Нет пересечения - игра окончена
      setGameOver(true);
      setIsPlaying(false);
      
      // Сохраняем результат
      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem('stackGameBestScore', score.toString());
      }
      
      // Отправляем результат на сервер
      stackService.submitScore(score, undefined).catch(() => {
        // Игнорируем ошибки сервера для UX
      });
      
      return;
    }
    
    // Проверяем на идеальное попадание (в пределах tolerance)
    const currentCenter = currentBlock.x + currentBlock.width / 2;
    const topCenter = lastBlock.x + lastBlock.width / 2;
    const offset = Math.abs(currentCenter - topCenter);
    
    let newWidth = overlap;
    let newX = Math.max(currentLeft, topLeft);
    
    if (offset <= tolerance) {
      // Идеальное попадание - не уменьшаем ширину, только корректируем позицию
      newWidth = currentBlock.width;
      newX = topCenter - newWidth / 2; // Центрируем по предыдущему блоку
    }
    
    // Создаём новый блок с обрезанными параметрами
    const newBlock: Block = {
      x: newX,
      y: currentBlock.y,
      width: newWidth,
      height: currentBlock.height,
      color: currentBlock.color
    };
    
    setStack(prev => [...prev, newBlock]);
    setCurrentBlock(null);
    setScore(prev => prev + 1);
    
    // Отправляем результат на сервер
    stackService.submitScore(score + 1, undefined).catch(() => {
      // Игнорируем ошибки сервера для UX
    });
    
    // Создаём следующий блок через небольшую задержку
    setTimeout(() => {
      if (!gameOver) {
        createNewBlock();
      }
    }, 100);
  }, [currentBlock, stack, score, bestScore, gameOver, createNewBlock]);

  // Игровой цикл
  const gameLoop = useCallback(() => {
    if (!isPlaying || isPaused || gameOver) return;

    moveBlock();
  }, [isPlaying, isPaused, gameOver, moveBlock]);

  // Анимация
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем стопку блоков
    stack.forEach(block => {
      ctx.fillStyle = block.color;
      ctx.fillRect(block.x, block.y, block.width, block.height);
      
      // Добавляем тень
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(block.x, block.y, block.width, block.height);
    });

    // Рисуем текущий движущийся блок
    if (currentBlock) {
      ctx.fillStyle = currentBlock.color;
      ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.width, currentBlock.height);
      
      // Добавляем тень
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 3;
      ctx.strokeRect(currentBlock.x, currentBlock.y, currentBlock.width, currentBlock.height);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [stack, currentBlock]);

  // Управление игрой
  const startGame = useCallback(() => {
    setIsPlaying(true);
    setIsPaused(false);
    setGameOver(false);
    
    if (stack.length <= 1) {
      createNewBlock();
    }
  }, [stack.length, createNewBlock]);

  const pauseGame = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  const restartGame = useCallback(() => {
    initializeGame();
    setTimeout(() => {
      startGame();
    }, 100);
  }, [initializeGame, startGame]);

  // Обработка клика
  const handleCanvasClick = useCallback(() => {
    if (isPlaying && !isPaused && currentBlock && !gameOver) {
      placeBlock();
    }
  }, [isPlaying, isPaused, currentBlock, gameOver, placeBlock]);

  // Эффекты
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      gameLoopRef.current = window.setInterval(gameLoop, 16); // ~60 FPS
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, isPaused, gameLoop]);

  useEffect(() => {
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Добавляем обработчик клика на canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('click', handleCanvasClick);
    
    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [handleCanvasClick]);

  return {
    canvasRef,
    isPlaying,
    isPaused,
    gameOver,
    score,
    bestScore,
    stack,
    currentBlock,
    startGame,
    pauseGame,
    restartGame
  };
};
