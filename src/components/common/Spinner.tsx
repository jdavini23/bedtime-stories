import React from 'react';
import { motion } from 'framer-motion';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <motion.div
        className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        animate={{
          rotate: 360,
          transition: {
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }
        }}
      />
    </div>
  );
};

export default Spinner;


