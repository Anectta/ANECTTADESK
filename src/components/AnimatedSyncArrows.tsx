import React from 'react';

interface AnimatedSyncArrowsProps {
  className?: string;
  size?: number;
  title?: string;
}

export const AnimatedSyncArrows: React.FC<AnimatedSyncArrowsProps> = ({
  className = '',
  size = 64,
  title = 'Tráfego P2P Contínuo Bidirecional',
}) => {
  return (
    <div 
      className={`inline-flex items-center justify-center select-none group relative ${className}`}
      title={title}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_4px_12px_rgba(14,165,233,0.35)] transition-transform duration-300 group-hover:scale-110"
      >
        <defs>
          <style>{`
            @keyframes arrowSlideTopRight {
              0%, 100% {
                transform: translate(68px, 48px) rotate(-40deg) translateX(-8px);
              }
              50% {
                transform: translate(68px, 48px) rotate(-40deg) translateX(10px);
              }
            }

            @keyframes arrowSlideBottomLeft {
              0%, 100% {
                transform: translate(52px, 72px) rotate(140deg) translateX(-8px);
              }
              50% {
                transform: translate(52px, 72px) rotate(140deg) translateX(10px);
              }
            }

            @keyframes arrowsPulseGlow {
              0%, 100% {
                opacity: 0.8;
                filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.5));
              }
              50% {
                opacity: 1;
                filter: drop-shadow(0 0 14px rgba(34, 211, 238, 0.95));
              }
            }

            .p2p-arrow-top {
              animation: arrowSlideTopRight 2.2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
              transform-origin: center;
              will-change: transform;
            }

            .p2p-arrow-bottom {
              animation: arrowSlideBottomLeft 2.2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
              transform-origin: center;
              will-change: transform;
            }

            .group:hover .p2p-arrow-top {
              animation-duration: 1.2s;
            }

            .group:hover .p2p-arrow-bottom {
              animation-duration: 1.2s;
            }

            .p2p-glow {
              animation: arrowsPulseGlow 2.4s ease-in-out infinite;
            }
          `}</style>

          <linearGradient id="p2pArrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a5f3fc" />
          </linearGradient>

          <filter id="p2pShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0369a1" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* SETAS BIDIRECIONAIS COM MICRO-INTERAÇÃO CONTÍNUA */}
        <g className="p2p-glow">
          {/* Seta Superior (Apontando para a Tela da Direita ↗) */}
          <g className="p2p-arrow-top" filter="url(#p2pShadow)">
            <path
              d="M -30 -7.5 
                 L 10 -7.5 
                 L 10 -15 
                 C 10 -16.8 12.1 -17.7 13.5 -16.4 
                 L 33 -1.4 
                 C 34 -0.6 34 0.6 33 1.4 
                 L 13.5 16.4 
                 C 12.1 17.7 10 16.8 10 15 
                 L 10 7.5 
                 L -30 7.5 
                 C -33 7.5 -35.5 5 -35.5 2 
                 L -35.5 -2 
                 C -35.5 -5 -33 -7.5 -30 -7.5 Z"
              fill="url(#p2pArrowGradient)"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>

          {/* Seta Inferior (Apontando para a Tela da Esquerda ↙) */}
          <g className="p2p-arrow-bottom" filter="url(#p2pShadow)">
            <path
              d="M -30 -7.5 
                 L 10 -7.5 
                 L 10 -15 
                 C 10 -16.8 12.1 -17.7 13.5 -16.4 
                 L 33 -1.4 
                 C 34 -0.6 34 0.6 33 1.4 
                 L 13.5 16.4 
                 C 12.1 17.7 10 16.8 10 15 
                 L 10 7.5 
                 L -30 7.5 
                 C -33 7.5 -35.5 5 -35.5 2 
                 L -35.5 -2 
                 C -35.5 -5 -33 -7.5 -30 -7.5 Z"
              fill="url(#p2pArrowGradient)"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
