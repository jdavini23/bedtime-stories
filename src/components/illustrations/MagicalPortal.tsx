import { motion } from 'framer-motion';

export function MagicalPortal() {
  return (
    <svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.g
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Outer Ring */}
        <circle cx="150" cy="150" r="145" stroke="url(#portalGradient)" strokeWidth="10" />
      </motion.g>

      <motion.g
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Middle Ring */}
        <circle cx="150" cy="150" r="120" stroke="url(#portalGradient2)" strokeWidth="8" />
      </motion.g>

      {/* Inner Portal */}
      <motion.circle
        cx="150"
        cy="150"
        r="100"
        fill="url(#portalGradient3)"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Stars */}
      <motion.g
        animate={{
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {[...Array(12)].map((_, i) => (
          <circle
            key={i}
            cx={150 + 80 * Math.cos((i * Math.PI * 2) / 12)}
            cy={150 + 80 * Math.sin((i * Math.PI * 2) / 12)}
            r="2"
            fill="white"
          />
        ))}
      </motion.g>

      {/* Gradients */}
      <defs>
        <radialGradient
          id="portalGradient"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(150 150) rotate(90) scale(150)"
        >
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="portalGradient2"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(150 150) rotate(90) scale(120)"
        >
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="portalGradient3"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(150 150) rotate(90) scale(100)"
        >
          <stop offset="0%" stopColor="#BFDBFE" />
          <stop offset="100%" stopColor="#93C5FD" />
        </radialGradient>
      </defs>
    </svg>
  );
}
