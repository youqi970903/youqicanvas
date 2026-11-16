import React, { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './types';
import svgPaths from '../../imports/Frame48190808-1/svg-rrqu2zgazu';
import { ImageWithFallback } from './figma/ImageWithFallback';
import imgBenchlingBanner from '../../imports/image-10.png';

interface BenchlingTooltipProps {
  isVisible: boolean;
  side?: 'left' | 'right';
}

export function BenchlingTooltip({ isVisible, side = 'right' }: BenchlingTooltipProps) {
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
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="relative w-[412px] bg-white rounded-[8.803px] pointer-events-none shrink-0"
        >
          <div className="flex flex-col gap-[20px] items-start justify-center overflow-clip px-[12px] py-[14px] relative rounded-[inherit] w-full">
            {/* Input Section */}
            <div className="flex flex-col gap-[16px] items-start relative shrink-0 w-full">
              <div className="flex gap-[6px] items-center relative shrink-0">
                <div className="flex items-center justify-center relative shrink-0 size-[18px]">
                  <div className="flex-none rotate-90">
                    <div className="relative size-[18px]">
                      <div className="absolute inset-[12.46%_12.54%_8.37%_12.46%]">
                        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 14.25">
                          <path d={svgPaths.p2b0ceb00} fill="#262626" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#262626] whitespace-nowrap">
                  <p className="leading-[normal]">Input</p>
                </div>
              </div>

              <div className="flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                <div className="flex gap-[40px] items-start relative shrink-0 w-full">
                  <p className="leading-[normal] relative shrink-0 text-[#8a91a0] w-[100px]">Role</p>
                  <div className="flex flex-col items-start relative shrink-0">
                    <div className="bg-[#edeff6] flex items-center justify-center px-[4px] py-[2px] relative rounded-[2px] shrink-0">
                      <p className="leading-[normal] relative shrink-0 text-[#5a5a5a] whitespace-nowrap">Product Designer</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-[40px] items-start relative shrink-0 w-full">
                  <p className="leading-[normal] relative shrink-0 text-[#8a91a0] w-[100px]">Team</p>
                  <div className="flex flex-[1_0_0] flex-wrap gap-[4px] items-start min-w-0 relative">
                    <div className="bg-[#edeff6] flex items-center justify-center px-[4px] py-[2px] relative rounded-[2px] shrink-0">
                      <p className="leading-[normal] relative shrink-0 text-[#5a5a5a] whitespace-nowrap">InVivo Team</p>
                    </div>
                    <div className="bg-[#edeff6] flex items-center justify-center px-[4px] py-[2px] relative rounded-[2px] shrink-0">
                      <p className="leading-[normal] relative shrink-0 text-[#5a5a5a] whitespace-nowrap">Core Benchling Team</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-[40px] items-start relative shrink-0 w-full">
                  <p className="leading-[normal] relative shrink-0 text-[#8a91a0] w-[100px]">Time</p>
                  <div className="flex items-start justify-end relative shrink-0">
                    <div className="bg-[#edeff6] flex items-center justify-center px-[4px] py-[2px] relative rounded-[2px] shrink-0">
                      <p className="leading-[normal] relative shrink-0 text-[#5a5a5a] whitespace-nowrap">2025 - 2026</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[1px] relative shrink-0 w-full bg-[#EDEDED]" />

            {/* Output Section */}
            <div className="flex flex-col gap-[16px] items-start relative shrink-0 w-full">
              <div className="flex gap-[6px] items-center relative shrink-0">
                <div className="relative shrink-0 size-[18px]">
                  <div className="absolute inset-[12.46%_8.32%_12.54%_12.46%]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.2586 13.5">
                      <path d={svgPaths.p2972c400} fill="#262626" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#262626] whitespace-nowrap">
                  <p className="leading-[normal]">Output</p>
                </div>
              </div>

              <div className="flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                <div className="flex gap-[40px] items-start relative shrink-0 w-full">
                  <p className="leading-[normal] relative shrink-0 text-[#8a91a0] w-[100px]">Project</p>
                  <div className="flex flex-[1_0_0] flex-col items-start min-w-0 relative">
                    <div className="bg-[#edeff6] flex items-start px-[4px] py-[2px] relative rounded-[2px]">
                      <p className="leading-[1.4] relative text-[#5a5a5a] whitespace-normal break-words">Build a solid design environment for effective, efficient, and sustainable product development in AI era</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-[40px] items-start relative shrink-0 w-full">
                  <p className="leading-[normal] relative shrink-0 text-[#8a91a0] w-[100px]">Tag</p>
                  <div className="flex flex-[1_0_0] flex-wrap gap-[4px] items-start min-w-0 relative">
                    <div className="bg-[#edeff6] flex items-center justify-center px-[4px] py-[2px] relative rounded-[2px] shrink-0">
                      <p className="leading-[normal] relative shrink-0 text-[#5a5a5a] whitespace-nowrap">AI</p>
                    </div>
                    <div className="bg-[#edeff6] flex items-center justify-center px-[4px] py-[2px] relative rounded-[2px] shrink-0">
                      <p className="leading-[normal] relative shrink-0 text-[#5a5a5a] whitespace-nowrap">SaaS</p>
                    </div>
                    <div className="bg-[#edeff6] flex items-center justify-center px-[4px] py-[2px] relative rounded-[2px] shrink-0">
                      <p className="leading-[normal] relative shrink-0 text-[#5a5a5a] whitespace-nowrap">Life Science</p>
                    </div>
                  </div>
                </div>

                <div className="aspect-[4096/2879] relative rounded-[6.602px] shrink-0 w-full overflow-hidden">
                  <ImageWithFallback alt="Design for Benchling" className="absolute inset-0 w-full h-full object-cover pointer-events-none" src={imgBenchlingBanner} draggable={false} />
                </div>
              </div>
            </div>
          </div>
          
          <div aria-hidden="true" className="absolute border-[#d2d6dd] border-[0.728px] border-solid inset-[-0.728px] pointer-events-none rounded-[9.531px] shadow-[0px_6px_20px_0px_rgba(142,149,165,0.25)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}