import React from 'react';
import { motion, useTransform, MotionValue } from 'motion/react';

interface ConnectorProps {
  sourceX: MotionValue<number>;
  sourceY: MotionValue<number>;
  targetX: MotionValue<number>;
  targetY: MotionValue<number>;
  sourceWidth: number;
  sourceHeight: number;
  targetHeight: number;
}

export function Connector({ sourceX, sourceY, targetX, targetY, sourceWidth, sourceHeight, targetHeight }: ConnectorProps) {
  // Anchoring logic: Source (Right Edge) -> Target (Left Edge)
  const sx = useTransform(sourceX, (v) => v + sourceWidth);
  const sy = useTransform(sourceY, (v) => v + sourceHeight / 2);
  const ex = targetX; // Left edge of target node bounding box
  const ey = useTransform(targetY, (v) => v + targetHeight / 2);

  const pathData = useTransform(
    [sx, sy, ex, ey],
    ([currSx, currSy, currEx, currEy]) => {
      const dx = currEx - currSx;
      // Adjust offset for smoother horizontal flow
      const horizontalOffset = Math.min(Math.max(Math.abs(dx) / 1.5, 60), 160);
      
      const cp1x = currSx + horizontalOffset;
      const cp1y = currSy;
      const cp2x = currEx - horizontalOffset;
      const cp2y = currEy;

      // Stop the line exactly 1px before the arrow tip to maintain visual contact 
      // without stroke overlapping the arrowhead point
      return `M ${currSx} ${currSy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${currEx - 0.5} ${currEy}`;
    }
  );

  const arrowTransform = useTransform(
    [ex, ey],
    ([currEx, currEy]) => {
      // Anchored to the LEFT edge (currEx)
      return `translate(${currEx}, ${currEy})`;
    }
  );

  return (
    <g className="pointer-events-none">
      {/* Curved dashed line - Directed Edge */}
      <motion.path
        d={pathData}
        fill="none"
        stroke="#8e95a5"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        strokeLinecap="butt"
      />
      
      {/* Target Arrowhead - Anchored to Left Edge */}
      <motion.path
        d={useTransform([ex, ey], ([x, y]) => `M ${x-8} ${y-5} L ${x} ${y} L ${x-8} ${y+5} Z`)}
        fill="#8e95a5"
        stroke="none"
      />

      {/* Visual anchor point on source node (Right Edge) */}
      <motion.circle cx={sx} cy={sy} r="2.5" fill="#8e95a5" />
    </g>
  );
}