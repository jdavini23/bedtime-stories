import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Star, Moon } from 'lucide-react';
console.log('Replacing Globe with a div');

interface SpaceBackgroundProps {
  className?: string;
  starDensity?: number;
  planetCount?: number;
  nebulaCount?: number;
  children?: React.ReactNode;
}

interface StarProps {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
}

interface PlanetProps {
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
}

interface NebulaProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
}

export const SpaceBackground: React.FC<SpaceBackgroundProps> = ({
  className,
  starDensity = 0.0002,
  planetCount = 3,
  nebulaCount = 2,
  children,
}) => {
  const [stars, setStars] = useState<StarProps[]>([]);
  const [planets, setPlanets] = useState<PlanetProps[]>([]);
  const [nebulas, setNebulas] = useState<NebulaProps[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate stars, planets and nebulas
  useEffect(() => {
    if (!containerRef.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();

    // Generate stars
    const area = width * height;
    const numStars = Math.floor(area * starDensity);
    const newStars = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.5,
      twinkleSpeed: 0.3 + Math.random() * 0.7,
    }));
    setStars(newStars);

    // Generate planets
    const newPlanets = Array.from({ length: planetCount }, () => {
      const planetColors = [
        '#FF9D6F', // orange
        '#A2D2FF', // light blue
        '#FFD166', // yellow
        '#9381FF', // purple
        '#F94144', // red
      ];

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 30 + 15,
        color: planetColors[Math.floor(Math.random() * planetColors.length)],
        rotation: Math.random() * 360,
      };
    });
    setPlanets(newPlanets);

    // Generate nebulas
    const nebulaColors = [
      '#FF61D8', // pink
      '#7209B7', // purple
      '#4CC9F0', // blue
      '#4361EE', // indigo
      '#3A0CA3', // dark purple
    ];

    const newNebulas = Array.from({ length: nebulaCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      width: Math.random() * 300 + 200,
      height: Math.random() * 200 + 100,
      color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
      opacity: Math.random() * 0.2 + 0.1,
    }));
    setNebulas(newNebulas);
  }, [starDensity, planetCount, nebulaCount]);

  // Render the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#0F172A'); // dark blue
      gradient.addColorStop(1, '#1E1B4B'); // dark indigo
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw nebulas
      nebulas.forEach((nebula) => {
        const grd = ctx.createRadialGradient(
          nebula.x,
          nebula.y,
          0,
          nebula.x,
          nebula.y,
          nebula.width / 2
        );
        grd.addColorStop(
          0,
          `${nebula.color}${Math.floor(nebula.opacity * 255)
            .toString(16)
            .padStart(2, '0')}`
        );
        grd.addColorStop(1, 'transparent');

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.ellipse(nebula.x, nebula.y, nebula.width / 2, nebula.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw stars
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        const opacity = 0.5 + Math.abs(Math.sin((Date.now() * 0.001) / star.twinkleSpeed) * 0.5);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });

      // Draw planets
      planets.forEach((planet) => {
        ctx.save();
        ctx.translate(planet.x, planet.y);
        ctx.rotate(((planet.rotation + Date.now() * 0.01) * Math.PI) / 180);

        // Planet body
        ctx.beginPath();
        ctx.arc(0, 0, planet.size, 0, Math.PI * 2);
        ctx.fillStyle = planet.color;
        ctx.fill();

        // Planet details
        ctx.beginPath();
        ctx.arc(planet.size * 0.3, -planet.size * 0.3, planet.size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, 0.2)`;
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [stars, planets, nebulas]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn('relative w-full h-full overflow-hidden', className)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="stars absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0)_80%)]" />
      {children && <div className="relative z-10 w-full h-full">{children}</div>}
      <style jsx>{`
        .stars {
          background-image:
            radial-gradient(2px 2px at 20px 30px, #eee, rgba(0, 0, 0, 0)),
            radial-gradient(2px 2px at 40px 70px, #fff, rgba(0, 0, 0, 0)),
            radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0, 0, 0, 0)),
            radial-gradient(2px 2px at 90px 40px, #fff, rgba(0, 0, 0, 0)),
            radial-gradient(2px 2px at 130px 80px, #fff, rgba(0, 0, 0, 0)),
            radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0, 0, 0, 0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: twinkle 5s ease-in-out infinite;
          opacity: 0.5;
        }

        @keyframes twinkle {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export const SpaceIcon: React.FC<{
  type: 'star' | 'planet' | 'moon';
  className?: string;
}> = ({ type, className }) => {
  const icons = {
    star: <Star className={cn('text-yellow-200', className)} />,
    planet: <div className={cn('w-4 h-4 rounded-full bg-blue-300', className)} />,
    moon: <Moon className={cn('text-gray-200', className)} />,
  };

  if (!icons[type]) {
    return null; // Or a default icon, or an error message
  }

  return icons[type];
};
