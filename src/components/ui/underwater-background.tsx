'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type UnderwaterBackgroundProps = {
  children?: React.ReactNode;
  className?: string;
  bubbleCount?: number;
  fishCount?: number;
  coralCount?: number;
};

const Bubble = ({
  delay,
  size,
  duration,
  left,
}: {
  delay: number;
  size: number;
  duration: number;
  left: string;
}) => {
  return (
    <motion.div
      className="absolute rounded-full bg-white/20 backdrop-blur-[1px] border border-white/30"
      style={{
        width: size,
        height: size,
        left,
        bottom: '-5%',
      }}
      initial={{ y: 0, opacity: 0.2 }}
      animate={{
        y: -window.innerHeight * 1.1,
        opacity: [0.2, 0.6, 0.2],
        x: [0, 10, -10, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
        x: {
          duration: duration / 3,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
    />
  );
};

const FishElement = ({
  delay,
  size,
  duration,
  left,
  flip,
}: {
  delay: number;
  size: number;
  duration: number;
  left: string;
  flip: boolean;
}) => {
  return (
    <motion.div
      className="absolute text-cyan-200/70"
      style={{
        left,
        top: `${30 + Math.random() * 40}%`,
      }}
      initial={{ x: flip ? window.innerWidth : -100, rotate: flip ? 180 : 0 }}
      animate={{
        x: flip ? -100 : window.innerWidth,
        y: [0, 20, -20, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
        y: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
    >
      {/* @ts-expect-error */}
      <DynamicIcon name="fish" size={size} />
    </motion.div>
  );
};

const Coral = ({ left, size, color }: { left: string; size: number; color: string }) => {
  return (
    <motion.div
      className={`absolute ${color}`}
      style={{
        left,
        bottom: '0%',
        transformOrigin: 'bottom center',
      }}
      initial={{ scaleY: 0.9 }}
      animate={{ scaleY: [0.9, 1.05, 0.9] }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* @ts-expect-error */}
      <DynamicIcon name="droplets" size={size} />
    </motion.div>
  );
};

export function UnderwaterBackground({
  children,
  className,
  bubbleCount = 20,
  fishCount = 6,
  coralCount = 8,
}: UnderwaterBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create gradient background
    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0c4a6e'); // Deep blue at top
      gradient.addColorStop(0.6, '#0e7490'); // Teal in middle
      gradient.addColorStop(1, '#0891b2'); // Lighter blue at bottom

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Draw light rays
    const drawLightRays = () => {
      for (let i = 0; i < 8; i++) {
        const x = Math.random() * canvas.width;
        const width = 50 + Math.random() * 100;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + width, canvas.height);
        ctx.lineTo(x - width, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.02)');

        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };

    const render = () => {
      drawBackground();
      drawLightRays();
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Generate bubbles
  const bubbles = Array.from({ length: bubbleCount }).map((_, i) => ({
    id: i,
    delay: Math.random() * 10,
    size: 5 + Math.random() * 20,
    duration: 15 + Math.random() * 20,
    left: `${Math.random() * 100}%`,
  }));

  // Generate fish
  const fishes = Array.from({ length: fishCount }).map((_, i) => ({
    id: i,
    delay: Math.random() * 5,
    size: 20 + Math.random() * 30,
    duration: 20 + Math.random() * 40,
    left: `${Math.random() * 100}%`,
    flip: Math.random() > 0.5,
  }));

  // Generate coral
  const corals = Array.from({ length: coralCount }).map((_, i) => ({
    id: i,
    left: `${(i / coralCount) * 100}%`,
    size: 30 + Math.random() * 50,
    color:
      i % 3 === 0 ? 'text-rose-400/80' : i % 3 === 1 ? 'text-amber-300/80' : 'text-emerald-400/80',
  }));

  return (
    <div className={cn('relative min-h-screen w-full overflow-hidden bg-cyan-800', className)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Bubbles */}
      {bubbles.map((bubble) => (
        <Bubble key={`bubble-${bubble.id}`} {...bubble} />
      ))}

      {/* Fish */}
      {fishes.map((fish) => (
        <FishElement key={`fish-${fish.id}`} {...fish} />
      ))}

      {/* Coral */}
      {corals.map((coral) => (
        <Coral key={`coral-${coral.id}`} {...coral} />
      ))}

      {/* Waves at the top */}
      <div className="absolute top-0 left-0 w-full opacity-30">
        <motion.div
          animate={{ x: [-100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <motion.div
            animate={{ x: [-100, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            {/* @ts-expect-error */}
            <DynamicIcon name="waves" className="w-[200%] h-20 text-cyan-100/30" />
          </motion.div>
        </motion.div>
      </div>

      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 py-12">{children}</div>
    </div>
  );
}
