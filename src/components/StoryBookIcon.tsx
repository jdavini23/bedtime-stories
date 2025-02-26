import React from 'react';

const StoryBookIcon: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Stack of books */}
      <rect x="40" y="120" width="120" height="30" rx="3" fill="#8B5CF6" />
      <rect x="45" y="120" width="110" height="25" rx="2" fill="#A78BFA" />
      <rect x="45" y="120" width="110" height="5" fill="#C4B5FD" />

      <rect x="50" y="90" width="110" height="30" rx="3" fill="#EC4899" />
      <rect x="55" y="90" width="100" height="25" rx="2" fill="#F472B6" />
      <rect x="55" y="90" width="100" height="5" fill="#FBCFE8" />

      <rect x="60" y="60" width="100" height="30" rx="3" fill="#3B82F6" />
      <rect x="65" y="60" width="90" height="25" rx="2" fill="#60A5FA" />
      <rect x="65" y="60" width="90" height="5" fill="#BFDBFE" />

      {/* Open book on top */}
      <path d="M50 60C50 55 55 50 65 50H135C145 50 150 55 150 60V60H50V60Z" fill="#F9FAFB" />
      <path d="M50 60H100V30C100 25 95 20 85 20H65C55 20 50 25 50 30V60Z" fill="#F3F4F6" />
      <path d="M150 60H100V30C100 25 105 20 115 20H135C145 20 150 25 150 30V60Z" fill="#F3F4F6" />
      <path d="M100 30V60" stroke="#6B7280" strokeWidth="1" />

      {/* Text lines on pages */}
      <path d="M60 30H90" stroke="#D1D5DB" strokeWidth="1" />
      <path d="M60 35H90" stroke="#D1D5DB" strokeWidth="1" />
      <path d="M60 40H90" stroke="#D1D5DB" strokeWidth="1" />
      <path d="M60 45H90" stroke="#D1D5DB" strokeWidth="1" />
      <path d="M60 50H90" stroke="#D1D5DB" strokeWidth="1" />

      <path d="M110 30H140" stroke="#D1D5DB" strokeWidth="1" />
      <path d="M110 35H140" stroke="#D1D5DB" strokeWidth="1" />
      <path d="M110 40H140" stroke="#D1D5DB" strokeWidth="1" />
      <path d="M110 45H140" stroke="#D1D5DB" strokeWidth="1" />
      <path d="M110 50H140" stroke="#D1D5DB" strokeWidth="1" />

      {/* Bookmark */}
      <path d="M130 20V35L125 30L120 35V20H130Z" fill="#EF4444" />
    </svg>
  );
};

export default StoryBookIcon;
