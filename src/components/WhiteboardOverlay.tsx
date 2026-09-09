import React, { useRef, useState, useEffect } from 'react';
import { 
  PenTool, 
  Square, 
  ArrowRight, 
  Trash2, 
  X, 
  Check, 
  MousePointer, 
  Circle 
} from 'lucide-react';

interface WhiteboardOverlayProps {
  onClose: () => void;
}

type DrawTool = 'pen' | 'rect' | 'arrow' | 'laser';

export const WhiteboardOverlay: React.FC<WhiteboardOverlayProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState<DrawTool>('pen');
  const [strokeColor, setStrokeColor] = useState<string>('#ef4444'); // Red default
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  // Setup canvas resolution to match container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPos({ x, y });

    // Save snapshot for shapes like rectangle / arrow
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

    if (currentTool === 'pen' || currentTool === 'laser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === 'pen') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (currentTool === 'laser') {
      if (snapshot) ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 12;
      ctx.fill();
    } else if (currentTool === 'rect') {
      if (snapshot) ctx.putImageData(snapshot, 0, 0);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
    } else if (currentTool === 'arrow') {
      if (snapshot) ctx.putImageData(snapshot, 0, 0);
      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = strokeColor;
      ctx.lineWidth = strokeWidth;

      // Draw line
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Draw arrowhead
      const angle = Math.atan2(y - startPos.y, x - startPos.x);
      const headlen = 14;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        x - headlen * Math.cos(angle - Math.PI / 6),
        y - headlen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        x - headlen * Math.cos(angle + Math.PI / 6),
        y - headlen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setStartPos(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      {/* Interactive Drawing Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="w-full h-full pointer-events-auto cursor-crosshair"
      />

      {/* Floating Whiteboard Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto bg-slate-900/95 border border-slate-700/80 backdrop-blur-md rounded-xl p-2 shadow-2xl flex items-center space-x-2 text-white text-xs">
        <div className="text-[11px] font-bold text-cyan-400 px-2 uppercase tracking-wider border-r border-slate-700">
          Quadro Branco
        </div>

        {/* Tool Selectors */}
        <button
          onClick={() => setCurrentTool('pen')}
          className={`p-2 rounded-lg transition ${
            currentTool === 'pen' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'
          }`}
          title="Caneta de Desenho Livre"
        >
          <PenTool className="w-4 h-4" />
        </button>

        <button
          onClick={() => setCurrentTool('laser')}
          className={`p-2 rounded-lg transition ${
            currentTool === 'laser' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'
          }`}
          title="Apontador Laser"
        >
          <Circle className="w-4 h-4" />
        </button>

        <button
          onClick={() => setCurrentTool('arrow')}
          className={`p-2 rounded-lg transition ${
            currentTool === 'arrow' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'
          }`}
          title="Seta Indicadora"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => setCurrentTool('rect')}
          className={`p-2 rounded-lg transition ${
            currentTool === 'rect' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'
          }`}
          title="Destacar Retângulo"
        >
          <Square className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-slate-700 mx-1" />

        {/* Colors */}
        <div className="flex items-center space-x-1.5 px-1">
          {[
            { color: '#ef4444', label: 'Vermelho' },
            { color: '#eab308', label: 'Amarelo' },
            { color: '#06b6d4', label: 'Ciano' },
            { color: '#10b981', label: 'Verde' },
          ].map((c) => (
            <button
              key={c.color}
              onClick={() => setStrokeColor(c.color)}
              className={`w-5 h-5 rounded-full border-2 transition ${
                strokeColor === c.color ? 'border-white scale-110 shadow' : 'border-transparent'
              }`}
              style={{ backgroundColor: c.color }}
              title={c.label}
            />
          ))}
        </div>

        <div className="h-5 w-px bg-slate-700 mx-1" />

        <button
          onClick={clearCanvas}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Limpar Desenhos"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1 shadow transition active:scale-95"
          title="Encerrar Anotações"
        >
          <X className="w-3.5 h-3.5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};
