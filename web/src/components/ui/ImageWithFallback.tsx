import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Texto corto que se muestra si la foto no carga. */
  fallbackLabel?: string;
}

/** Imagen que, si falla la carga, muestra un placeholder de marca en vez de un ícono roto. */
export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  fallbackLabel,
  className = '',
  alt = '',
  onError,
  src,
  ...rest
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt || fallbackLabel || 'Imagen no disponible'}
        className={`flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-[#FFF2DE] to-[#FDE1C0] text-[#C5161D] ${className}`}
      >
        <span className="text-2xl leading-none" aria-hidden="true">🧀</span>
        {fallbackLabel && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B7791F] px-2 text-center line-clamp-1">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
      {...rest}
    />
  );
};
