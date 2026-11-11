import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Renders storefront media with native lazy loading by default and an inline
 * accessible empty-image state if `src` is absent or fails to load (no external
 * stock photo fallbacks).
 */
const ProductImage = ({
  src,
  alt = '',
  className = '',
  containerClassName = '',
  eager = false,
  fallbackLabel = 'Image unavailable',
  iconClassName = 'w-8 h-8 text-slate-400',
  onLoad,
  ...rest
}) => {
  const [failedSrc, setFailedSrc] = useState(null);
  const hasValidSrc = Boolean(src && String(src).trim() && failedSrc !== src);

  if (!hasValidSrc) {
    return (
      <div
        role="img"
        aria-label={alt || fallbackLabel}
        className={`flex flex-col items-center justify-center bg-slate-100 text-slate-400 select-none ${containerClassName || className}`}
      >
        <ImageOff className={iconClassName} />
        {fallbackLabel && (
          <span className="mt-1.5 text-[11px] font-medium text-slate-500 px-2 text-center">
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
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding={eager ? 'sync' : 'async'}
      className={className}
      onLoad={onLoad}
      onError={() => setFailedSrc(src)}
      {...rest}
    />
  );
};

export default ProductImage;
