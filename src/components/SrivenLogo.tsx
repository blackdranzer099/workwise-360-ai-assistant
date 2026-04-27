// SVG logo component recreated from Sriven Solutions brand identity
// Red badge with "SV" monogram + "SRIVEN SOLUTIONS®" wordmark

export function SrivenLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size * 1.6}
      height={size}
      viewBox="0 0 64 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Sriven Solutions"
    >
      {/* Red badge background */}
      <rect x="0" y="0" width="40" height="40" rx="5" ry="5" fill="#C0392B" />
      {/* Inner border highlight */}
      <rect x="2" y="2" width="36" height="36" rx="4" ry="4" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      {/* S letter */}
      <text
        x="7"
        y="28"
        fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900"
        fontSize="22"
        fill="white"
        letterSpacing="-1"
      >S</text>
      {/* V letter */}
      <text
        x="22"
        y="28"
        fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900"
        fontSize="22"
        fill="white"
        letterSpacing="-1"
      >V</text>
    </svg>
  );
}

export function SrivenLogoFull({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <SrivenLogo size={32} />
      <div className="flex flex-col leading-tight">
        <span className="text-[11px] font-black tracking-widest text-[#C0392B] uppercase">
          Sriven Solutions
        </span>
        <span className="text-[9px] font-medium tracking-wider text-gray-400 uppercase">
          Enterprise AI
        </span>
      </div>
    </div>
  );
}
