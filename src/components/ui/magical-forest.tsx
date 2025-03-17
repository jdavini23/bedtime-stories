import React, { useEffect, useState, CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Firefly {
  id: string;
  x: string;
  y: string;
  scale: number;
  delay: number;
  duration: number;
}

interface MagicalForestProps {
  className?: string;
  children?: React.ReactNode;
  fireflyCount?: number;
  treeCount?: number;
}

export const MagicalForest = ({
  className,
  children,
  fireflyCount = 20,
  treeCount = 5,
}: MagicalForestProps) => {
  const [fireflies, setFireflies] = useState<Firefly[]>([]);

  useEffect(() => {
    const generateFirefly = (): Firefly => {
      const x = `${Math.random() * 100}%`;
      const y = `${Math.random() * 100}%`;
      const scale = Math.random() * 0.5 + 0.3;
      const delay = Math.random() * 2;
      const duration = Math.random() * 5 + 3;
      const id = `firefly-${x}-${y}-${Date.now()}`;
      return { id, x, y, scale, delay, duration };
    };

    const initializeFireflies = () => {
      const newFireflies = Array.from({ length: fireflyCount }, generateFirefly);
      setFireflies(newFireflies);
    };

    const updateFireflies = () => {
      setFireflies((currentFireflies) =>
        currentFireflies.map((firefly) => {
          if (Math.random() > 0.7) {
            return generateFirefly();
          }
          return firefly;
        })
      );
    };

    initializeFireflies();
    const interval = setInterval(updateFireflies, 3000);

    return () => clearInterval(interval);
  }, [fireflyCount]);

  return (
    <div
      className={cn(
        'relative min-h-[300px] w-full overflow-hidden rounded-xl bg-[#0F172A] p-6',
        className
      )}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0F172A]/80 to-transparent" />
        <div className="absolute inset-0 z-10">
          {fireflies.map((firefly) => (
            <Firefly key={firefly.id} {...firefly} />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-0">
          {Array.from({ length: treeCount }).map((_, index) => (
            <Tree
              key={`tree-${index}`}
              position={`${(index * 100) / (treeCount - 1)}%`}
              height={`${Math.random() * 30 + 20}%`}
              width={`${Math.random() * 10 + 10}%`}
            />
          ))}
        </div>
      </div>
      <div className="relative z-20">{children}</div>
    </div>
  );
};

const Firefly = ({ id, x, y, scale, delay, duration }: Firefly) => {
  return (
    <motion.div
      key={id}
      className="absolute z-10"
      initial={{ opacity: 0, x, y }}
      animate={{
        opacity: [0, 1, 0.5, 1, 0],
        scale: [0, scale, scale * 0.8, scale, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      <div className="h-2 w-2 rounded-full bg-yellow-200 shadow-[0_0_10px_2px_rgba(255,255,0,0.7)]" />
    </motion.div>
  );
};

const Tree = ({ position, height, width }: { position: string; height: string; width: string }) => {
  return (
    <div
      className="absolute bottom-0 z-0"
      style={{
        left: position,
        transform: 'translateX(-50%)',
      }}
    >
      {/* Tree trunk */}
      <div
        className="mx-auto w-[10%] rounded-t-sm bg-[#3E2723]"
        style={{
          height: `${parseInt(height) * 0.3}%`,
          minHeight: '40px',
          maxWidth: '20px',
        }}
      />
      {/* Tree foliage */}
      <div
        className="absolute bottom-[95%] left-1/2 -translate-x-1/2 transform rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-[#1B5E20] shadow-[0_0_15px_rgba(46,125,50,0.3)]"
        style={{
          width,
          height,
          minHeight: '80px',
          minWidth: '40px',
        }}
      />
    </div>
  );
};

export const MagicalForestTitle = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return <h2 className={cn('mb-4 font-bold text-3xl text-white', className)}>{children}</h2>;
};

export const MagicalForestContent = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn('prose prose-invert max-w-none text-white/90', className)}>{children}</div>
  );
};
