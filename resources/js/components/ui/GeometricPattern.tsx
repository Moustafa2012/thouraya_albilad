import React from 'react';
import { StarsPattern } from '@/components/ui/pattren';

export const GeometricPattern = ({
  variant = 'dense',
  className = '',
}: {
  variant?: 'dense' | 'sparse';
  className?: string;
}) => {
  return (
    <StarsPattern
      color="#d4af37" // Gold color
      opacity={0.1}
      className={className}
    />
  );
};

export const GoldenBorder = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`h-px w-full bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50 ${className}`} />
  );
};
