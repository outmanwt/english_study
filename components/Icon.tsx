
import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: keyof typeof LucideIcons;
  size?: number;
  className?: string;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({ name, size = 20, className = "", onClick }) => {
  const LucideIcon = LucideIcons[name] as React.ElementType;
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} onClick={onClick} />;
};

export default Icon;
