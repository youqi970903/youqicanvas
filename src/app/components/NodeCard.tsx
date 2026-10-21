import React from 'react';
import { motion, MotionValue, useMotionValue } from 'motion/react';
import { NodeData, Connection, NODE_TYPES } from './types';
import { cn } from './types';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import CharacterIcon from '../../imports/Frame481977';
import BenchlingIconImg from "figma:asset/df786e5d439dc742ee412d3a1491c696f532139a.png";
import ProjectIconImg from "figma:asset/582b64d71fa84f3955e59f2dd1989af0ad65d648.png";
import Project3IconImg from "figma:asset/f4b127bc67f06a7af7574b7cd24cf609299851f9.png";
import TagIcon from "../../imports/Tag-1";

interface NodeCardProps {
  id: string;
  label: string;
  icon?: string;
  image?: string;
  x: MotionValue<number>;
  y: MotionValue<number>;
  onResize: (id: string, width: number, height: number) => void;
  onHoverChange: (id: string | null) => void;
  scale: number;
}

export function NodeCard({ 
  id,
  label,
  icon,
  image,
  x,
  y,
  onResize,
  onHoverChange,
  scale
}: NodeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (cardRef.current && onResize) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          // Report both width and height
          onResize(id, entry.contentRect.width + 16, entry.contentRect.height + 16);
        }
      });
      resizeObserver.observe(cardRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [id, onResize]);

  const getIconBgColor = () => {
    if (label === 'Born!') return 'bg-[#fff5d9]';
    if (label === 'Youqi W.') return 'bg-[#d9ebff]';
    if (label === 'Work') return 'bg-[#ffe7d9]';
    if (label === 'Creative') return 'bg-[#d8fce9]';
    if (label === 'Benchling') return 'bg-[#edeff6]';
    if (label === 'Archived') return 'bg-[#edeff6]';
    if (label.includes('Project')) {
      return 'bg-[#EDEFF6]';
    }
    return 'bg-[#edeff6]';
  };

  const getIconTextColor = () => {
    if (label.includes('Project')) {
      // Unifying project node text colors to match Project 3
      return 'text-[#4d7c0f]';
    }
    return 'text-[#262626]';
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{
        x,
        y,
        position: 'absolute',
        zIndex: isHovered ? 50 : 10
      }}
      className={cn(
        "group transition-colors",
        (label === 'Ragene' || label === 'Ragene AI' || label === 'Marlo' || label === 'Archived' || label === 'Benchling') 
          ? "custom-project-cursor" 
          : "custom-node-cursor"
      )}
      onMouseEnter={() => {
        setIsHovered(true);
        onHoverChange(id);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHoverChange(null);
      }}
    >
      <motion.div 
        ref={cardRef}
        onTap={() => {
          if (label === 'Ragene') {
            window.location.href = 'https://latin-rabbit.super.site/ragene';
          } else if (label === 'Ragene AI') {
            window.location.href = 'https://latin-rabbit.super.site/rageneai';
          } else if (label === 'Marlo') {
            window.location.href = 'https://latin-rabbit.super.site/marlo';
          } else if (label === 'Archived') {
            window.location.href = 'https://latin-rabbit.super.site/archived';
          } else if (label === 'Benchling') {
            window.location.href = 'https://latin-rabbit.super.site/benchling';
          }
        }}
        className={cn(
          "bg-white rounded-[8px] p-[8px] w-[180px] min-h-[52px] shadow-[0px_0px_5px_0px_rgba(142,149,165,0.1)] border-[0.5px] border-[#d2d6dd] hover:shadow-[0px_4px_20px_0px_rgba(0,0,0,0.08)] transition-shadow duration-200 overflow-hidden",
          (label === 'Ragene' || label === 'Ragene AI' || label === 'Marlo' || label === 'Archived' || label === 'Benchling') && "hover:border-[#8e95a5] active:bg-[#f8f9fb]"
        )}
      >
        <div className="flex items-center justify-between gap-[12px]">
          <div className="flex items-center gap-[12px] flex-1 min-w-0">
            <div className={cn(
              "flex items-center justify-center size-[36px] rounded-[6.6px] shrink-0 overflow-hidden",
              label === 'Born!' ? "bg-[#F1E6FF]" : 
              label === 'Youqi W.' ? "bg-[#D9EBFF]" : 
              (label === 'Creative' || label === 'Work') ? "bg-[#D8FCE9]" : 
              label.includes('Project') ? "bg-[#EDEFF6]" :
              label === 'Benchling' ? "bg-[#EDEFF6]" : "bg-[#EDEFF6]"
            )}>
              <div className={cn("flex items-center justify-center w-full h-full text-[20px] font-medium font-['Fira_Code'] leading-none", getIconTextColor())}>
                {label === 'Youqi W.' ? (
                  <CharacterIcon />
                ) : label === 'Benchling' ? (
                  <ImageWithFallback 
                    src={BenchlingIconImg} 
                    alt="Benchling" 
                    className="size-[24px] object-contain"
                    draggable={false}
                  />
                ) : (label === 'Ragene' || label === 'Ragene AI') ? (
                  <TagIcon />
                ) : label === 'Marlo' ? (
                  <ImageWithFallback 
                    src={Project3IconImg} 
                    alt="Project 3" 
                    className="size-full object-cover"
                    draggable={false}
                  />
                ) : (label === 'Born!' ? '🐣' : icon)}
              </div>
            </div>
            <span className="text-[14px] font-medium text-[#262626] font-['Fira_Code'] tracking-[-0.56px] truncate">
              {label}
            </span>
          </div>
          
          <div className="flex gap-[2px] opacity-40 group-hover:opacity-100 transition-opacity">
            <div className="size-[3px] bg-black rounded-full" />
            <div className="size-[3px] bg-black rounded-full" />
            <div className="size-[3px] bg-black rounded-full" />
          </div>
        </div>

        {image && (
          <div className={cn(
            "mt-[8px] rounded-[6px] overflow-hidden border-[0.5px] border-[#e2e4ec]",
            (label === 'Ragene' || label === 'Ragene AI' || label === 'Marlo' || label === 'Benchling') ? "h-[116px]" : "aspect-video"
          )}>
            <ImageWithFallback
              src={image}
              alt={label}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}