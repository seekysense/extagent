import * as Icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function LucideIcon({ name, size = 16, strokeWidth = 1.5, color }: LucideIconProps) {
  const Cmp = (Icons as any)[name] as React.ElementType | undefined;
  if (!Cmp) return <span style={{ display: 'inline-block', width: size, height: size }} />;
  return <Cmp size={size} strokeWidth={strokeWidth} color={color} />;
}
