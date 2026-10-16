import { useState } from "react";
import {
  buildSrcSet,
  optimizeImageUrl,
  resolveProductImageUrl,
} from "../../utils/imageUrl";

/**
 * Product/category image with responsive sources and a branded fallback when
 * the file is missing or fails to load (replaces the absent fallback PNG).
 */
export default function SmartImage({
  src,
  alt = "",
  sizes = "(min-width: 1024px) 25vw, 50vw",
  width = 960,
  className = "",
  fallbackClassName = "",
  loading = "lazy",
  fetchPriority,
  ...rest
}) {
  const resolved = resolveProductImageUrl(src);
  const [failedSrc, setFailedSrc] = useState(null);

  if (!resolved || failedSrc === resolved) {
    return (
      <div
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        className={`flex items-center justify-center bg-cream-dim text-ink/25 ${className} ${fallbackClassName}`}
      >
        <span className="font-serif text-2xl italic">Notervo</span>
      </div>
    );
  }

  return (
    <img
      src={optimizeImageUrl(resolved, width)}
      srcSet={buildSrcSet(resolved)}
      sizes={sizes}
      alt={alt}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      onError={() => setFailedSrc(resolved)}
      className={className}
      {...rest}
    />
  );
}
