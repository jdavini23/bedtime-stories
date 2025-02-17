import React from 'react';
import { motion } from 'framer-motion';
import { Github, Chrome } from 'lucide-react';
import { signIn } from 'next-auth/react';

interface LoginButtonProps {
  provider: 'google' | 'github';
  className?: string;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ 
  provider, 
  className = '' 
}) => {
  const buttonConfig = {
    google: {
      text: 'Sign in with Google',
      icon: <Chrome className="mr-2 h-5 w-5" />,
      onClick: () => signIn('google', { callbackUrl: '/dashboard' })
    },
    github: {
      text: 'Sign in with GitHub',
      icon: <Github className="mr-2 h-5 w-5" />,
      onClick: () => signIn('github', { callbackUrl: '/dashboard' })
    }
  };

  const { text, icon, onClick } = buttonConfig[provider];

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        flex items-center justify-center 
        w-full py-2 px-4 
        border border-gray-300 
        rounded-md 
        shadow-sm 
        text-sm font-medium 
        text-gray-700 
        bg-white 
        hover:bg-gray-50 
        focus:outline-none 
        focus:ring-2 
        focus:ring-offset-2 
        focus:ring-indigo-500
        ${className}
      `}
    >
      {icon}
      <span className="ml-2">{text}</span>
    </motion.button>
  );
};
