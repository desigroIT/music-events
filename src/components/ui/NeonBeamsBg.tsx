// Pure CSS animated beams — GPU compositor thread, zero JS animation overhead
export default function NeonBeamsBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 neon-beams-container">
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        className="absolute w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Neon Glow Filters — reduced stdDeviation for less GPU blur cost */}
          <filter id="glow-orange-beam" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-blue-beam" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-purple-beam" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients */}
          <linearGradient id="grad-orange-beam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5B00" stopOpacity="0" />
            <stop offset="40%" stopColor="#FF5B00" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FF5B00" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF5B00" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="grad-blue-beam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0" />
            <stop offset="40%" stopColor="#00D4FF" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#00D4FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="grad-purple-beam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9D4EDD" stopOpacity="0" />
            <stop offset="40%" stopColor="#9D4EDD" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#9D4EDD" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#9D4EDD" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Beam 1: Orange diagonal TL→BR */}
        <path
          d="M -100 -50 L 2020 1130"
          stroke="url(#grad-orange-beam)"
          strokeWidth="3"
          fill="none"
          filter="url(#glow-orange-beam)"
          className="beam-orange-1"
          strokeDasharray="400 2500"
        />

        {/* Beam 2: Blue diagonal TR→BL */}
        <path
          d="M 2020 -50 L -100 1130"
          stroke="url(#grad-blue-beam)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#glow-blue-beam)"
          className="beam-blue-1"
          strokeDasharray="350 2500"
        />

        {/* Beam 3: Purple wave */}
        <path
          d="M -100 540 Q 480 180, 960 540 T 2020 540"
          stroke="url(#grad-purple-beam)"
          strokeWidth="2"
          fill="none"
          filter="url(#glow-purple-beam)"
          className="beam-purple-1"
          strokeDasharray="300 2200"
        />

        {/* Beam 4: Orange lower wave */}
        <path
          d="M -100 850 Q 600 650, 1300 950 T 2020 750"
          stroke="url(#grad-orange-beam)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#glow-orange-beam)"
          className="beam-orange-2"
          strokeDasharray="380 2200"
        />
      </svg>
    </div>
  );
}
