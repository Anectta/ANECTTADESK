import React from 'react';

interface RotatingLoopArrowsProps {
  className?: string;
  size?: number;
  gap?: number;
  title?: string;
}

export const RotatingLoopArrows: React.FC<RotatingLoopArrowsProps> = ({
  className = '',
  size = 42,
  title = 'Túnel P2P Bidirecional Ativo • Tráfego Simétrico em Tempo Real',
}) => {
  return (
    <div 
      className={`inline-flex items-center justify-center gap-36 select-none group relative py-0 ${className}`}
      title={title}
    >
      <style>{`
        @keyframes microStreamUp {
          0% {
            opacity: 0.4;
            transform: translateY(0);
            filter: drop-shadow(0 0 1px rgba(0, 160, 255, 0.2));
          }
          20% {
            opacity: 1;
            transform: translateY(-1.5px);
            filter: drop-shadow(0 0 5px rgba(0, 240, 255, 0.85)) drop-shadow(0 0 10px rgba(0, 140, 255, 0.6));
          }
          45%, 100% {
            opacity: 0.4;
            transform: translateY(0);
            filter: drop-shadow(0 0 1px rgba(0, 160, 255, 0.2));
          }
        }

        @keyframes microStreamDown {
          0% {
            opacity: 0.4;
            transform: translateY(0);
            filter: drop-shadow(0 0 1px rgba(0, 160, 255, 0.2));
          }
          20% {
            opacity: 1;
            transform: translateY(1.5px);
            filter: drop-shadow(0 0 5px rgba(0, 240, 255, 0.85)) drop-shadow(0 0 10px rgba(0, 140, 255, 0.6));
          }
          45%, 100% {
            opacity: 0.4;
            transform: translateY(0);
            filter: drop-shadow(0 0 1px rgba(0, 160, 255, 0.2));
          }
        }

        /* Micro-interação contínua em onda subindo (de baixo para cima) - Cadência suave e relaxada */
        .stream-up-6 { animation: microStreamUp 2.8s ease-in-out infinite; animation-delay: 0s; }
        .stream-up-5 { animation: microStreamUp 2.8s ease-in-out infinite; animation-delay: 0.32s; }
        .stream-up-4 { animation: microStreamUp 2.8s ease-in-out infinite; animation-delay: 0.64s; }
        .stream-up-3 { animation: microStreamUp 2.8s ease-in-out infinite; animation-delay: 0.96s; }
        .stream-up-2 { animation: microStreamUp 2.8s ease-in-out infinite; animation-delay: 1.28s; }
        .stream-up-1 { animation: microStreamUp 2.8s ease-in-out infinite; animation-delay: 1.60s; }

        /* Micro-interação contínua em onda descendo (de cima para baixo) - Cadência suave e relaxada */
        .stream-down-1 { animation: microStreamDown 2.8s ease-in-out infinite; animation-delay: 0s; }
        .stream-down-2 { animation: microStreamDown 2.8s ease-in-out infinite; animation-delay: 0.32s; }
        .stream-down-3 { animation: microStreamDown 2.8s ease-in-out infinite; animation-delay: 0.64s; }
        .stream-down-4 { animation: microStreamDown 2.8s ease-in-out infinite; animation-delay: 0.96s; }
        .stream-down-5 { animation: microStreamDown 2.8s ease-in-out infinite; animation-delay: 1.28s; }
        .stream-down-6 { animation: microStreamDown 2.8s ease-in-out infinite; animation-delay: 1.60s; }

        .group:hover .stream-up-1,
        .group:hover .stream-up-2,
        .group:hover .stream-up-3,
        .group:hover .stream-up-4,
        .group:hover .stream-up-5,
        .group:hover .stream-up-6,
        .group:hover .stream-down-1,
        .group:hover .stream-down-2,
        .group:hover .stream-down-3,
        .group:hover .stream-down-4,
        .group:hover .stream-down-5,
        .group:hover .stream-down-6 {
          animation-duration: 1.6s;
        }
      `}</style>

      {/* COLUNA ESQUERDA: 6 CHEVRONS COM ESPAÇAMENTO DOBRADO SUBINDO (HOST PC) */}
      <div className="flex flex-col items-center">
        <svg
          width={Math.round(size * 0.48)}
          height={size}
          viewBox="0 0 22 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-200 group-hover:scale-105"
        >
          {/* Chevron 1 (Topo / Ponta Guia - Ciano Mais Claro) */}
          <path
            d="M 11 2 L 22 6.5 L 22 9.7 L 11 5.2 L 0 9.7 L 0 6.5 Z"
            fill="#00f0ff"
            className="stream-up-1"
          />

          {/* Chevron 2 */}
          <path
            d="M 11 9.2 L 22 13.7 L 22 16.9 L 11 12.4 L 0 16.9 L 0 13.7 Z"
            fill="#00d2ff"
            className="stream-up-2"
          />

          {/* Chevron 3 */}
          <path
            d="M 11 16.4 L 22 20.9 L 22 24.1 L 11 19.6 L 0 24.1 L 0 20.9 Z"
            fill="#00b4d8"
            className="stream-up-3"
          />

          {/* Chevron 4 */}
          <path
            d="M 11 23.6 L 22 28.1 L 22 31.3 L 11 26.8 L 0 31.3 L 0 28.1 Z"
            fill="#0284c7"
            className="stream-up-4"
          />

          {/* Chevron 5 */}
          <path
            d="M 11 30.8 L 22 35.3 L 22 38.5 L 11 34 L 0 38.5 L 0 35.3 Z"
            fill="#2563eb"
            className="stream-up-5"
          />

          {/* Chevron 6 (Base / Traseira - Azul Real Profundo) */}
          <path
            d="M 11 38 L 22 42.5 L 22 45.7 L 11 41.2 L 0 45.7 L 0 42.5 Z"
            fill="#1d4ed8"
            className="stream-up-6"
          />
        </svg>
      </div>

      {/* COLUNA DIREITA: 6 CHEVRONS COM ESPAÇAMENTO DOBRADO DESCENDO (REMOTE CLIENT) */}
      <div className="flex flex-col items-center">
        <svg
          width={Math.round(size * 0.48)}
          height={size}
          viewBox="0 0 22 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-200 group-hover:scale-105"
        >
          {/* Chevron 1 (Topo / Base - Azul Real Profundo) */}
          <path
            d="M 11 9.7 L 0 5.2 L 0 2 L 11 6.5 L 22 2 L 22 5.2 Z"
            fill="#1d4ed8"
            className="stream-down-1"
          />

          {/* Chevron 2 */}
          <path
            d="M 11 16.9 L 0 12.4 L 0 9.2 L 11 13.7 L 22 9.2 L 22 12.4 Z"
            fill="#2563eb"
            className="stream-down-2"
          />

          {/* Chevron 3 */}
          <path
            d="M 11 24.1 L 0 19.6 L 0 16.4 L 11 20.9 L 22 16.4 L 22 19.6 Z"
            fill="#0284c7"
            className="stream-down-3"
          />

          {/* Chevron 4 */}
          <path
            d="M 11 31.3 L 0 26.8 L 0 23.6 L 11 28.1 L 22 23.6 L 22 26.8 Z"
            fill="#00b4d8"
            className="stream-down-4"
          />

          {/* Chevron 5 */}
          <path
            d="M 11 38.5 L 0 34 L 0 30.8 L 11 35.3 L 22 30.8 L 22 34 Z"
            fill="#00d2ff"
            className="stream-down-5"
          />

          {/* Chevron 6 (Inferior / Ponta Guia - Ciano Mais Claro) */}
          <path
            d="M 11 45.7 L 0 41.2 L 0 38 L 11 42.5 L 22 38 L 22 41.2 Z"
            fill="#00f0ff"
            className="stream-down-6"
          />
        </svg>
      </div>
    </div>
  );
};
