import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';

interface WavySeekbarProps {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  className?: string;
  isMini?: boolean;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatNegativeRemaining(currentTime: number, duration: number): string {
  if (isNaN(duration) || duration <= 0) return '-0:00';
  const remaining = Math.max(0, duration - currentTime);
  const mins = Math.floor(remaining / 60);
  const secs = Math.floor(remaining % 60);
  return `-${mins}:${secs.toString().padStart(2, '0')}`;
}

export const WavySeekbar: React.FC<WavySeekbarProps> = ({
  currentTime,
  duration,
  onSeek,
  className = '',
  isMini = false,
}) => {
  const wavySeekbarSetting = useSettingsStore((s) => s.wavySeekbar);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [containerWidth, setContainerWidth] = useState(320);

  // ResizeObserver to calculate precise SVG pixel width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        setContainerWidth(rect.width);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const effectiveProgress = duration > 0 ? (isDragging ? dragProgress : Math.min(1, Math.max(0, currentTime / duration))) : 0;
  const currentDisplayTime = isDragging ? dragProgress * duration : currentTime;

  const calculateProgressFromEvent = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return 0;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      return Math.min(1, Math.max(0, relativeX / rect.width));
    },
    []
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    const p = calculateProgressFromEvent(e.clientX);
    setDragProgress(p);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const p = calculateProgressFromEvent(e.clientX);
    setDragProgress(p);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const p = calculateProgressFromEvent(e.clientX);
    onSeek(p * duration);
  };

  // Generate Wavy SVG Path
  const svgHeight = isMini ? 16 : 24;
  const centerY = svgHeight / 2;
  const elapsedWidth = Math.max(0, Math.min(containerWidth, containerWidth * effectiveProgress));
  const amplitude = isMini ? 2 : 3.5;
  const wavelength = isMini ? 14 : 18;

  let wavyPathD = `M 0 ${centerY}`;
  if (wavySeekbarSetting) {
    const step = 2;
    for (let x = step; x <= elapsedWidth; x += step) {
      const y = centerY + amplitude * Math.sin((x / wavelength) * 2 * Math.PI);
      wavyPathD += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    // Connect to current elapsed endpoint
    wavyPathD += ` L ${elapsedWidth.toFixed(1)} ${centerY}`;
  } else {
    wavyPathD = `M 0 ${centerY} L ${elapsedWidth.toFixed(1)} ${centerY}`;
  }

  return (
    <div className={`w-full select-none ${className}`}>
      {/* Interactive Track Area */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative py-2.5 cursor-pointer touch-none flex items-center group"
      >
        <svg
          width="100%"
          height={svgHeight}
          className="overflow-visible"
          viewBox={`0 0 ${containerWidth || 100} ${svgHeight}`}
        >
          {/* Unplayed Background Track (Sleek Straight Line) */}
          <line
            x1={elapsedWidth}
            y1={centerY}
            x2={containerWidth}
            y2={centerY}
            stroke="#453840"
            strokeWidth={isMini ? 2 : 2.5}
            strokeLinecap="round"
          />

          {/* Played Elapsed Track (Wavy Sine Wave or Straight Line) */}
          <path
            d={wavyPathD}
            fill="none"
            stroke="var(--color-accent-primary)"
            strokeWidth={isMini ? 2 : 2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Circular Draggable Thumb Handle */}
        <div
          style={{ left: `${elapsedWidth}px` }}
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent-glow)] transition-transform pointer-events-none ${
            isMini ? 'w-3 h-3' : 'w-4 h-4'
          } ${isDragging ? 'scale-125' : 'group-hover:scale-110'}`}
        />
      </div>

      {/* Timestamp Row: Elapsed on left, Negative Remaining on right */}
      {!isMini && (
        <div className="flex items-center justify-between text-xs font-sans tabular-nums font-medium text-[#9E9094] px-0.5 mt-0.5">
          <span>{formatTime(currentDisplayTime)}</span>
          <span>{formatNegativeRemaining(currentDisplayTime, duration)}</span>
        </div>
      )}
    </div>
  );
};

export default WavySeekbar;
