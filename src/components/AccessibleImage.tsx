import React, { useState } from "react";

type AccessibleImageProps = {
  src?: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
};

const DEFAULT_FALLBACK =
  "https://via.placeholder.com/150?text=No+Image"; // replace with your design system asset

export const AccessibleImage: React.FC<AccessibleImageProps> = ({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  className,
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  // If no src at all, immediately fallback
  React.useEffect(() => {
    if (!src) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  }, [src, fallbackSrc]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};