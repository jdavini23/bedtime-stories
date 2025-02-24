"use client";

import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

interface StoryCardProps {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
}

const StoryCard = React.forwardRef<HTMLDivElement, StoryCardProps>(
  ({ className, title, description, icon, color = "#FFB6C1" }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow",
          "border-2 border-opacity-30",
          className
        )}
        style={{ borderColor: color }}
      >
        <div className="relative h-20 w-20 mx-auto mb-4">
          <AnimatedIcon>{icon}</AnimatedIcon>
        </div>
        
        {title && (
          <h3 className="text-xl font-bold text-center mb-2 text-gray-800 dark:text-white">
            {title}
          </h3>
        )}
        
        {description && (
          <p className="text-sm text-center text-gray-600 dark:text-gray-300">
            {description}
          </p>
        )}
      </motion.div>
    );
  }
);

StoryCard.displayName = "StoryCard";

const AnimatedIcon = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="w-full h-full flex items-center justify-center"
    >
      {children}
    </motion.div>
  );
};

export function StoryFeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <StoryCard
        title="Interactive Stories"
        description="Engage with magical tales that come to life"
        color="#FFB6C1"
        icon={
          <BookIcon className="w-12 h-12 text-pink-500" />
        }
      />
      
      <StoryCard
        title="Fun Characters"
        description="Meet delightful friends along the journey"
        color="#98FB98"
        icon={
          <StarIcon className="w-12 h-12 text-green-500" />
        }
      />
      
      <StoryCard
        title="Learning Adventures"
        description="Discover new worlds while learning"
        color="#87CEEB"
        icon={
          <RocketIcon className="w-12 h-12 text-blue-500" />
        }
      />
    </div>
  );
}

const BookIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none" 
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const RocketIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"  
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2" 
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

export { StoryCard }; 