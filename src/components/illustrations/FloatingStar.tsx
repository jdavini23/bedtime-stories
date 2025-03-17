import { motion } from 'framer-motion';

export function FloatingStar() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Main Star */}
        <path
          d="M40 0L48.7868 31.2132L80 40L48.7868 48.7868L40 80L31.2132 48.7868L0 40L31.2132 31.2132L40 0Z"
          fill="url(#starGradient)"
        />

        {/* Inner Star */}
        <path
          d="M40 15L44.3934 31.6066L60 36L44.3934 40.3934L40 57L35.6066 40.3934L20 36L35.6066 31.6066L40 15Z"
          fill="url(#innerStarGradient)"
        />
      </motion.g>

      {/* Sparkles */}
      <motion.g
        animate={{
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {[...Array(8)].map((_, i) => (
          <circle
            key={i}
            cx={40 + 35 * Math.cos((i * Math.PI * 2) / 8)}
            cy={40 + 35 * Math.sin((i * Math.PI * 2) / 8)}
            r="1.5"
            fill="white"
          />
        ))}
      </motion.g>

      {/* Gradients */}
      <defs>
        <radialGradient
          id="starGradient"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(40 40) rotate(90) scale(40)"
        >
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
        <radialGradient
          id="innerStarGradient"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(40 36) rotate(90) scale(21)"
        >
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#FCD34D" />
        </radialGradient>
      </defs>
    </svg>
  );
}
