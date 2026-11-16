import React, { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './types';
import svgPaths from '../../imports/svg-6hys7zjo9y';
import img3 from "figma:asset/465ff88ebe2c44caf85e409db10cb72c0dc0b390.png";
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WorkTooltipProps {
  isVisible: boolean;
  side?: 'left' | 'right';
}

export function WorkTooltip({ isVisible, side = 'right' }: WorkTooltipProps) {
  const industries = ["SaaS", "B2B", "AI", "Data", "B2C", "Life Science"];
  const skills = ["Communication", "Collaboration", "Prioritization"];
  const containerRef = useRef<HTMLDivElement>(null);
  const [yOffset, setYOffset] = useState(0);

  useLayoutEffect(() => {
    if (isVisible && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const buffer = 20;
      const viewportHeight = window.innerHeight;
      
      let offset = 0;
      if (rect.bottom > viewportHeight - buffer) {
        offset = viewportHeight - buffer - rect.bottom;
      } else if (rect.top < buffer) {
        offset = buffer - rect.top;
      }
      setYOffset(offset);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: yOffset, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(
            "relative w-[432px] pointer-events-none",
            "bg-white rounded-[8.8px] shadow-[0px_6px_20px_0px_rgba(142,149,165,0.25)] border-[0.7px] border-[#d2d6dd]",
            "p-[14px] flex flex-col gap-[20px]"
          )}
        >
          {/* Input Section */}
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center gap-[6px]">
              <div className="size-[18px] flex items-center justify-center rotate-90 shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d={svgPaths.p30557bf0} fill="#262626" />
                </svg>
              </div>
              <span className="text-[#262626]">Input</span>
            </div>
            
            <div className="flex flex-col gap-[12px]">
              <div className="flex gap-[40px] items-start">
                <span className="text-[#8a91a0] w-[100px] shrink-0">Timeline</span>
                <div className="bg-[#edeff6] px-[4px] py-0 rounded-[2px]">
                  <span className="text-[#5a5a5a]">2020 - Present</span>
                </div>
              </div>

              <div className="flex gap-[40px] items-start">
                <span className="text-[#8a91a0] w-[100px] shrink-0">Industry</span>
                <div className="flex flex-wrap gap-[4px] flex-1">
                  {industries.map((item, i) => (
                    <div key={`${item}-${i}`} className="bg-[#edeff6] px-[4px] py-0 rounded-[2px]">
                      <span className="text-[#5a5a5a]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-[40px] items-start">
                <span className="text-[#8a91a0] w-[100px] shrink-0">Skills</span>
                <div className="flex flex-wrap gap-[4px] flex-1">
                  {skills.map((item, i) => (
                    <div key={`${item}-${i}`} className="bg-[#edeff6] px-[4px] py-0 rounded-[2px]">
                      <span className="text-[#5a5a5a]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#EDEFF6]" />

          {/* Output Section */}
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center gap-[6px]">
              <div className="size-[18px] flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d={svgPaths.p28804b40} fill="#262626" />
                </svg>
              </div>
              <span className="text-[#262626]">Output</span>
            </div>
            
            <div className="flex gap-[40px] items-start">
              <span className="text-[#8a91a0] w-[100px] shrink-0">Achievement</span>
              <div className="flex flex-col gap-[4px] flex-1">
                <div className="bg-[#edeff6] self-start px-[4px] py-0 rounded-[4px]">
                  <span className="text-[#5a5a5a]">Selected Projects</span>
                </div>
                <div className="flex items-center gap-[4px]">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="size-[16px] flex items-center justify-center relative"
                  >
                    <ImageWithFallback src={img3} alt="Processing" className="size-full" />
                    <div className="absolute left-[6.88px] top-[13.6px] size-[2.4px] bg-[#5a5a5a] rounded-full" />
                  </motion.div>
                  <span className="text-[#5a5a5a]">Processing more...</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}