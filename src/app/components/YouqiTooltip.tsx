import React, { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './types';
import svgPaths from '../../imports/svg-l3hz687f35';
import { ImageWithFallback } from './figma/ImageWithFallback';
import myImage from '../../imports/image-7.png';

interface YouqiTooltipProps {
  isVisible: boolean;
  side?: 'left' | 'right';
}

export function YouqiTooltip({ isVisible, side = 'right' }: YouqiTooltipProps) {
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

  const labels = ["Education", "Personality", "Hobby"];
  const values = {
    Education: ["B.A.Product Design", "M.S.Human-Computer Interaction"],
    Personality: ["Curious", "Adventurous", "Rigorous"],
    Hobby: ["Podcast", "EDM", "Thrilling Activities"]
  };

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
              {labels.map((label) => (
                <div key={label} className="flex gap-[40px] items-start">
                  <span className="text-[#8a91a0] w-[100px] shrink-0">{label}</span>
                  <div className="flex flex-wrap gap-[4px] flex-1">
                    {values[label as keyof typeof values].map((val) => (
                      <div key={val} className="bg-[#edeff6] px-[4px] py-0 rounded-[4px]">
                        <span className="text-[#5a5a5a]">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
              <span className="text-[#8a91a0] w-[100px] shrink-0">Role</span>
              <div className="bg-[#edeff6] px-[4px] py-0 rounded-[4px]">
                <span className="text-[#5a5a5a]">Full-stack Product Designer with ambitions</span>
              </div>
            </div>
          </div>
          
          {/* Image Section */}
          <div className="w-full relative shrink-0 aspect-[1170/662] rounded-[6.6px] overflow-hidden">
            <ImageWithFallback src={myImage} alt="Youqi W." className="absolute inset-0 w-full h-full object-cover" draggable={false} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}