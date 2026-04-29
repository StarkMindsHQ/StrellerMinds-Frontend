import React from "react";
import { AccessibleImage } from "./AccessibleImage";

type AvatarProps = {
  name: string;
  src?: string;
  className?: string;
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  className,
}) => {
  return (
    <AccessibleImage
      src={src}
      alt={`User avatar: ${name}`}
      className={className}
      fallbackSrc="https://via.placeholder.com/150?text=Avatar"
    />
  );
};