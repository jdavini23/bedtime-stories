export function FloatingBook() {
  return (
    <svg
      width="120"
      height="160"
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 20C10 14.4772 14.4772 10 20 10H100C105.523 10 110 14.4772 110 20V140C110 145.523 105.523 150 100 150H20C14.4772 150 10 145.523 10 140V20Z"
        fill="#4A5568"
        className="drop-shadow-lg"
      />
      <path
        d="M15 25C15 19.4772 19.4772 15 25 15H95C100.523 15 105 19.4772 105 25V135C105 140.523 100.523 145 95 145H25C19.4772 145 15 140.523 15 135V25Z"
        fill="#2D3748"
      />
      <path d="M20 30H100V140H20V30Z" fill="#1A202C" />
      <path d="M30 45H90M30 65H90M30 85H90M30 105H90" stroke="#A0AEC0" strokeWidth="2" />
      <circle cx="60" cy="20" r="5" fill="#E2E8F0" />
    </svg>
  );
}
