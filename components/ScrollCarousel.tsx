"use client";

import { useRef, useEffect, useCallback } from "react";

/**
 * Бесконечная горизонтальная карусель с автопрокруткой и drag-scroll.
 * REASON: портирован из проекта Гравитация — проверенный паттерн.
 *
 * КОНТРАКТ:
 * - children: элементы карусели (должны иметь flex-shrink:0 и фиксированную ширину)
 * - speed: px/frame (по умолчанию 0.5)
 * - className: дополнительный CSS-класс
 * - Дублирует children для бесшовного бесконечного скролла
 * - Автопрокрутка справа налево, пауза при hover/touch
 */
export default function ScrollCarousel({
  children,
  speed = 0.5,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });

  // Бесшовный loop — при достижении середины перематывает обратно
  const checkLoop = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const halfWidth = el.scrollWidth / 2;
    if (halfWidth <= 0) return;
    if (el.scrollLeft >= halfWidth) el.scrollLeft -= halfWidth;
    if (el.scrollLeft <= 0) el.scrollLeft += halfWidth;
  }, []);

  // Автопрокрутка через requestAnimationFrame
  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (el && !pausedRef.current && !draggingRef.current) {
      el.scrollLeft += speed;
    }
    checkLoop();
    animRef.current = requestAnimationFrame(animate);
  }, [speed, checkLoop]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate]);

  // Пауза при hover
  const handleMouseEnter = () => { pausedRef.current = true; };
  const handleMouseLeave = () => {
    pausedRef.current = false;
    draggingRef.current = false;
  };

  // Drag мышкой
  const handleMouseDown = (e: React.MouseEvent) => {
    draggingRef.current = true;
    dragStartRef.current = {
      x: e.pageX,
      scrollLeft: scrollRef.current?.scrollLeft || 0,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const dx = e.pageX - dragStartRef.current.x;
    scrollRef.current.scrollLeft = dragStartRef.current.scrollLeft - dx;
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
  };

  // Touch: пауза при касании
  const handleTouchStart = () => { pausedRef.current = true; };
  const handleTouchEnd = () => { pausedRef.current = false; };

  return (
    <div
      ref={scrollRef}
      className={`scroll-carousel no-scrollbar ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Оригинал + дубль для бесшовного loop */}
      {children}
      {children}
    </div>
  );
}
