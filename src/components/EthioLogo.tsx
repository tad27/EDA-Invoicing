import React from 'react';

interface EthioLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  wordmarkText?: string;
  accentColor?: string; // defaults to Signal Blue #3D5AFE
  badgeBgColor?: string; // defaults to #000000
  textColor?: string;
  className?: string;
}

export const EthioLogo: React.FC<EthioLogoProps> = ({
  size = 'md',
  showWordmark = true,
  wordmarkText = 'EDA Invoicing',
  accentColor = '#3D5AFE',
  badgeBgColor = '#000000',
  textColor,
  className = '',
}) => {
  // Dimensions for badge
  const sizeMap = {
    sm: { icon: 32, rx: 7, pixel: 4, gap: 1.5, startX: 9, startY: 6, textClass: 'text-base' },
    md: { icon: 42, rx: 10, pixel: 5.2, gap: 2, startX: 11.5, startY: 8, textClass: 'text-xl' },
    lg: { icon: 54, rx: 13, pixel: 6.8, gap: 2.6, startX: 15, startY: 10.5, textClass: 'text-2xl' },
    xl: { icon: 68, rx: 16, pixel: 8.6, gap: 3.2, startX: 19, startY: 13, textClass: 'text-3xl' },
  };

  const config = sizeMap[size];

  // Grid layout for stylized 'E' pixel glyph:
  // 3 columns x 5 rows
  // Row 0: [Blue, Blue, Blue]
  // Row 1: [Blue]
  // Row 2: [Blue, Blue, White] -> the white block detail at the end of middle bar
  // Row 3: [Blue]
  // Row 4: [Blue, Blue, Blue]
  const pixels: Array<{ col: number; row: number; color: 'blue' | 'white' }> = [
    // Row 0
    { col: 0, row: 0, color: 'blue' },
    { col: 1, row: 0, color: 'blue' },
    { col: 2, row: 0, color: 'blue' },
    // Row 1
    { col: 0, row: 1, color: 'blue' },
    // Row 2 (Middle arm with contrasting white block)
    { col: 0, row: 2, color: 'blue' },
    { col: 1, row: 2, color: 'blue' },
    { col: 2, row: 2, color: 'white' },
    // Row 3
    { col: 0, row: 3, color: 'blue' },
    // Row 4
    { col: 0, row: 4, color: 'blue' },
    { col: 1, row: 4, color: 'blue' },
    { col: 2, row: 4, color: 'blue' },
  ];

  return (
    <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      {/* Icon Badge */}
      <svg
        width={config.icon}
        height={config.icon}
        viewBox={`0 0 ${config.icon} ${config.icon}`}
        className="shrink-0 shadow-sm"
        aria-label="Ethio Design Logo"
      >
        {/* Dark rounded square badge foundation */}
        <rect
          x="0"
          y="0"
          width={config.icon}
          height={config.icon}
          rx={config.rx}
          fill={badgeBgColor}
        />

        {/* Pixel glyph 'E' */}
        {pixels.map((p, idx) => {
          const x = config.startX + p.col * (config.pixel + config.gap);
          const y = config.startY + p.row * (config.pixel + config.gap);
          const fill = p.color === 'white' ? '#FFFFFF' : accentColor;

          return (
            <rect
              key={idx}
              x={x}
              y={y}
              width={config.pixel}
              height={config.pixel}
              rx={0.5}
              fill={fill}
            />
          );
        })}
      </svg>

      {/* Wordmark */}
      {showWordmark && (
        <span
          className={`font-medium tracking-tight font-space ${config.textClass} ${
            textColor ? textColor : 'text-current'
          }`}
        >
          {wordmarkText}
        </span>
      )}
    </div>
  );
};
