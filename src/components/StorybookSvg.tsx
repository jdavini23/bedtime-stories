import React from 'react';

const StorybookSvg: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Simple book icon */}
      <rect x="40" y="60" width="120" height="80" rx="5" fill="#8B5CF6" />
      <rect x="45" y="65" width="110" height="70" rx="3" fill="#A78BFA" />
      <rect x="100" y="65" width="2" height="70" fill="#7C3AED" />

      {/* Book pages */}
      <rect x="50" y="75" width="45" height="5" fill="#EDE9FE" />
      <rect x="50" y="85" width="45" height="5" fill="#EDE9FE" />
      <rect x="50" y="95" width="45" height="5" fill="#EDE9FE" />
      <rect x="50" y="105" width="45" height="5" fill="#EDE9FE" />
      <rect x="50" y="115" width="45" height="5" fill="#EDE9FE" />

      <rect x="105" y="75" width="45" height="5" fill="#EDE9FE" />
      <rect x="105" y="85" width="45" height="5" fill="#EDE9FE" />
      <rect x="105" y="95" width="45" height="5" fill="#EDE9FE" />
      <rect x="105" y="105" width="45" height="5" fill="#EDE9FE" />
      <rect x="105" y="115" width="45" height="5" fill="#EDE9FE" />

      {/* Bookmark */}
      <path d="M150 65V90L145 85L140 90V65H150Z" fill="#EF4444" />

      {/* Text */}
      <text x="100" y="140" fontFamily="Arial" fontSize="16" fill="#4B5563" textAnchor="middle">
        Story Book
      </text>
    </svg>
  );
};

export default StorybookSvg;
