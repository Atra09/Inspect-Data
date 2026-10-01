import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

export default function ScanPopup() {
  const [visible, setVisible] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [position, setPosition] = useState(null);

  const navigate = useNavigate();
  const isDraggingRef = useRef(false);
  const startCoordsRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleCamera = (e) => {
      if (typeof e.detail?.isOpen === 'boolean') setIsCameraActive(e.detail.isOpen);
    };
    window.addEventListener('ksop-camera-state', handleCamera);
    return () => window.removeEventListener('ksop-camera-state', handleCamera);
  }, []);

  const handleScanClick = (e) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (window.location.pathname === '/inspeksi') {
      window.dispatchEvent(new CustomEvent('ksop-trigger-open-camera'));
    } else {
      navigate('/inspeksi', { state: { autoOpen: true } });
    }
  };

  const handleStart = (clientX, clientY) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startCoordsRef.current = { x: clientX, y: clientY };
    startPosRef.current = { x: rect.left, y: rect.top };
  };

  const handleMove = (clientX, clientY) => {
    if (!isDraggingRef.current) return;
    const deltaX = clientX - startCoordsRef.current.x;
    const deltaY = clientY - startCoordsRef.current.y;
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) hasMovedRef.current = true;

    setPosition({
      x: Math.max(10, Math.min(window.innerWidth - 80, startPosRef.current.x + deltaX)),
      y: Math.max(10, Math.min(window.innerHeight - 80, startPosRef.current.y + deltaY)),
    });
  };

  const handleEnd = () => { isDraggingRef.current = false; };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    handleStart(e.clientX, e.clientY);
    const onMove = (m) => handleMove(m.clientX, m.clientY);
    const onUp = () => {
      handleEnd();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  if (!visible || isCameraActive) return null;

  return (
    <div
      ref={containerRef}
      style={position ? { left: `${position.x}px`, top: `${position.y}px`, bottom: 'auto', right: 'auto' } : undefined}
      className={`fixed z-40 select-none touch-none animate-in fade-in zoom-in duration-200 ${!position ? 'bottom-12 right-10' : ''}`}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
      onMouseDown={handleMouseDown}
    >
      <div className="relative group">
        <button
          type="button"
          onClick={handleScanClick}
          className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] text-white border-2 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-grab active:cursor-grabbing outline-none relative overflow-hidden shadow-sm"
          title="Geser atau Klik untuk Buka Scan Kamera"
        >
          <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors pointer-events-none" />
          <img src="/scan.svg" alt="Scan Icon" className="w-7 h-7 filter brightness-0 invert group-hover:scale-110 transition-transform relative z-10 pointer-events-none" />
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setVisible(false); }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-rose-500 hover:text-white hover:border-rose-500 flex items-center justify-center transition-all shadow-sm outline-none cursor-pointer z-20"
          title="Tutup Tombol Scan"
        >
          <X size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
