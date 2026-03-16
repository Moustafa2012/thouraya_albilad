"use client"

import React from 'react';

/**
 * Props for the GeometricPattern component
 * @interface GeometricPatternProps
 * @property {string} [color='#215b63'] - The color of the pattern
 * @property {string} [backgroundColor] - The background color (currently not used)
 * @property {number} [opacity=0.03] - The opacity of the pattern
 * @property {string} [className=''] - Additional CSS classes to apply
 */
interface GeometricPatternProps {
  color?: string;
  backgroundColor?: string;
  opacity?: number;
  className?: string;
}

/**
 * A decorative Islamic geometric pattern component that renders a star-like design.
 * This component creates an SVG-based pattern that can be used as a background.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <StarsPattern />
 * 
 * // Custom color and opacity
 * <StarsPattern color="#4a6b8a" opacity={0.05} className="absolute inset-0" />
 * 
 * // As a background
 * <div className="relative">
 *   <StarsPattern />
 *   <div className="relative z-10">
 *     Your content here
 *   </div>
 * </div>
 * ```
 * 
 * @param {GeometricPatternProps} props - The component props
 * @returns {JSX.Element} Rendered pattern component
 */
export const StarsPattern: React.FC<GeometricPatternProps> = ({
  color = '#215b63',
  opacity = 0.03,
  className = '',
}) => {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        id="uuid-e6de3699-0df6-4eb6-83f8-b049b2310057"
        data-name="Layer 2"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 500 497.18"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ color }}
        aria-hidden="true"
      >
        {/* ... rest of the SVG content remains the same ... */}
      </svg>
    </div>
  );
};

export default StarsPattern;
