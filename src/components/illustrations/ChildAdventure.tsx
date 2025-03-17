export function ChildAdventure() {
  return (
    <svg
      width="200"
      height="250"
      viewBox="0 0 200 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Child Silhouette */}
      <path
        d="M100 50C113.807 50 125 38.8071 125 25C125 11.1929 113.807 0 100 0C86.1929 0 75 11.1929 75 25C75 38.8071 86.1929 50 100 50Z"
        fill="#2D3748"
      />
      <path
        d="M60 180C60 125.858 103.858 82 158 82H42C96.1421 82 140 125.858 140 180V250H60V180Z"
        fill="#2D3748"
      />

      {/* Cape */}
      <path
        d="M140 100C140 100 160 120 160 160C160 200 140 220 140 220"
        stroke="#E53E3E"
        strokeWidth="20"
        strokeLinecap="round"
      />

      {/* Book */}
      <rect x="40" y="120" width="40" height="60" rx="5" fill="#4A5568" />
      <rect x="45" y="125" width="30" height="50" rx="3" fill="#2D3748" />

      {/* Stars around */}
      {[...Array(5)].map((_, i) => (
        <path
          key={i}
          d={`M${30 + i * 35} ${80 + (i % 2) * 20} l5 -15 l5 15 l15 -5 l-15 5 l5 15 l-5 -15 l-15 5 l15 -5`}
          fill="#ECC94B"
        />
      ))}
    </svg>
  );
}
