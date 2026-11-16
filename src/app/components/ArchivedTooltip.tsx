import React, { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './types';
import svgPaths from '../../imports/svg-lt7gauyhkb';

interface ArchivedTooltipProps {
  isVisible: boolean;
  side?: 'left' | 'right';
}

export function ArchivedTooltip({ isVisible, side = 'right' }: ArchivedTooltipProps) {
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
                <span className="text-[#8a91a0] w-[100px] shrink-0">Company</span>
                <div className="flex flex-wrap gap-[4px] flex-1">
                  <div className="bg-[#edeff6] px-[4px] py-0 rounded-[2px]">
                    <span className="text-[#5a5a5a]">CDK Global</span>
                  </div>
                  <div className="bg-[#edeff6] px-[4px] py-0 rounded-[2px]">
                    <span className="text-[#5a5a5a]">Essilorluxottica</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-[40px] items-start">
                <span className="text-[#8a91a0] w-[100px] shrink-0">Time</span>
                <div className="bg-[#edeff6] px-[4px] py-0 rounded-[2px]">
                  <span className="text-[#5a5a5a]">2021 - 2022</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#EDEDED]" />

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
              <span className="text-[#8a91a0] w-[100px] shrink-0">Project</span>
              <div className="flex flex-col gap-[6px] flex-1">
                <div className="bg-[#edeff6] px-[4px] py-0 rounded-[4px]">
                  <span className="text-[#5a5a5a]">Enhance dealerships' accessing document efficiency by revamping document search</span>
                </div>
                <div className="bg-[#edeff6] px-[4px] py-0 rounded-[4px]">
                  <span className="text-[#5a5a5a]">Facilitate digital transformation planning by informative storyboard</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}