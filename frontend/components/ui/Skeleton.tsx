import React from 'react';

/**
 * Reusable Skeleton component with shimmer animation.
 * The .skeleton class and @keyframes shimmer must be defined in globals.css.
 */
export interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    className?: string;
    style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width,
    height,
    borderRadius,
    className = '',
    style,
}) => {
    const finalWidth = typeof width === 'number' ? `${width}px` : width || '100%';
    const finalHeight = typeof height === 'number' ? `${height}px` : height || '20px';
    const finalRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius || '4px';

    return (
        <div
            className={`skeleton ${className}`}
            style={{
                width: finalWidth,
                height: finalHeight,
                borderRadius: finalRadius,
                ...style,
            }}
        />
    );
};
