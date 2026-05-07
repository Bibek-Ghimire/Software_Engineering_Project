import React from "react";
import { User } from "lucide-react";

const HumanoidAvatar = ({ src, name, size = 40, className = "" }) => {
  const px = typeof size === "number" ? `${size}px` : size;
  const iconSize = typeof size === "number" ? Math.round(size * 0.5) : "50%";

  if (src) {
    return (
      <img
        src={src}
        alt={name || "Avatar"}
        style={{ width: px, height: px }}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      style={{ width: px, height: px }}
      className={`rounded-full bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-white dark:text-stone-900 overflow-hidden ${className}`}
    >
      <User style={{ width: iconSize, height: iconSize }} />
    </div>
  );
};

export default HumanoidAvatar;
