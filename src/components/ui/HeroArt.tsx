export function HeroArt() {
  return (
    <svg
      className="hero-svg"
      viewBox="0 0 560 480"
      role="img"
      aria-label="A shield protecting a connected network of devices — symbolising cyber safety"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B3D91" />
          <stop offset="1" stopColor="#06038D" />
        </linearGradient>
      </defs>

      {/* Connection lines from centre to nodes */}
      <g stroke="#E2DCCE" strokeWidth="2.5" strokeDasharray="2 8" strokeLinecap="round">
        <line x1="280" y1="232" x2="132" y2="128" />
        <line x1="280" y1="232" x2="432" y2="150" />
        <line x1="280" y1="232" x2="420" y2="356" />
      </g>

      {/* Centre shield */}
      <g>
        <path
          d="M280 150
             C 322 134, 372 134, 372 150
             L 372 238
             C 372 286, 332 318, 280 338
             C 228 318, 188 286, 188 238
             L 188 150
             C 188 134, 238 134, 280 150 Z"
          fill="url(#shield)"
        />
        {/* white check */}
        <path
          d="M244 244 L268 270 L320 212"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Node A — saffron, lock */}
      <g>
        <circle cx="132" cy="128" r="38" fill="#FF671F" />
        <g transform="translate(132 128)" fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="-12" y="-4" width="24" height="20" rx="5" fill="#FFFFFF" stroke="none" />
          <path d="M-8 -2 V-10 a8 8 0 0 1 16 0 V-2" />
          <circle cx="0" cy="6" r="3" fill="#FF671F" stroke="none" />
        </g>
      </g>

      {/* Node B — green, shield-check */}
      <g>
        <circle cx="432" cy="150" r="38" fill="#046A38" />
        <g transform="translate(432 150)">
          <path
            d="M0 -16 C 12 -21, 22 -21, 22 -16 L 22 4 C 22 17, 11 26, 0 31 C -11 26, -22 17, -22 4 L -22 -16 C -22 -21, -12 -21, 0 -16 Z"
            fill="#FFFFFF"
          />
          <path d="M-9 3 L-2 11 L12 -7" fill="none" stroke="#046A38" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* Node C — navy, device */}
      <g>
        <circle cx="420" cy="356" r="38" fill="#06038D" />
        <g transform="translate(420 356)" fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="-15" y="-12" width="30" height="22" rx="4" fill="#FFFFFF" stroke="none" />
          <rect x="-15" y="-12" width="30" height="22" rx="4" />
          <line x1="-7" y1="16" x2="7" y2="16" />
        </g>
      </g>

      {/* small accent dots */}
      <circle cx="92" cy="300" r="5" fill="#FF671F" opacity="0.7" />
      <circle cx="478" cy="288" r="5" fill="#046A38" opacity="0.7" />
      <circle cx="300" cy="408" r="5" fill="#06038D" opacity="0.7" />
    </svg>
  );
}
