import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const NODE_TYPES = {
  START: 'Start point',
  ROLE: 'Role',
  EXPERIENCE: 'Experience',
  RESULT: 'Result'
} as const;

export type NodeType = typeof NODE_TYPES[keyof typeof NODE_TYPES];

export interface NodeData {
  id: string;
  type: NodeType;
  label: string;
  icon: string | React.ReactNode;
  position: { x: number; y: number };
  image?: string;
  bgColor?: string;
}

export interface Connection {
  sourceId: string;
  targetId: string;
}
