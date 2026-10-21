import React, { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { cn } from './types';
import svgPaths from '../../imports/svg-4lgsuaqq70';
import project1Preview from '../../imports/image-9.png';
import project2Preview from '../../imports/image-12.png';
import project3Preview from 'figma:asset/9c7e05eddfd34644a301e889436ee77b867e0c26.png';

interface TooltipData {
  input: {
    role: string;
    team: string[];
    time: string;
  };
  output: {
    description: string;
    tags: string[];
  };
  previewImage: string;
}

const PROJECT_DATA: Record<string, TooltipData> = {
  'Ragene': {
    input: {
      role: 'Product Designer',
      team: ['1 Product Manager', '3 Developers', '2 Bioinformatics Scientists'],
      time: '2023 – 2024',
    },
    output: {
      description: 'Accelerate data analysis by enhancing no-code visual programming platform',
      tags: ['No-code', 'Web', 'SaaS', 'Data analysis'],
    },
    previewImage: project1Preview,
  },
  'Ragene AI': {
    input: {
      role: 'Product Designer',
      team: ['2 Product Manager', '4 Developers', '2 Bioinformatics Scientists'],
      time: '2024 - 2025',
    },
    output: {
      description: 'Power scientific research by integrating AI into analysis tool',
      tags: ['AI Agent', 'LLM', 'Web', 'Data analysis'],
    },
    previewImage: project2Preview,
  },
  'Marlo': {
    input: {
      role: 'Product Designer',
      team: ['1 Product Manager', '2 Developers', '1 Marketing', '1 Visual Designer'],
      time: '2023',
    },
    output: {
      description: 'Promote user posting by redesigning "Create post" experience',
      tags: ['Growth design', 'toC', 'Mobile'],
    },
    previewImage: project3Preview,
  },
};

interface ProjectTooltipProps {
  label: string;
  isVisible: boolean;
  side?: 'left' | 'right';
}

function BoxArrowInUp() {
  return (
    <div className="relative size-[18px]">
      <svg className="block size-full" fill="none" viewBox="0 0 18 18">
        <path d={svgPaths.p30557bf0} fill="#262626" />
      </svg>
    </div>
  );
}

function BoxArrowRight() {
  return (
    <div className="relative size-[18px]">
      <svg className="block size-full" fill="none" viewBox="0 0 18 18">
        <path d={svgPaths.p28804b40} fill="#262626" />
      </svg>
    </div>
  );
}

export function ProjectTooltip({ label, isVisible, side = 'right' }: ProjectTooltipProps) {
  const data = PROJECT_DATA[label];
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

  if (!data) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, x: side === 'right' ? 0 : 0, y: -10 }}
          animate={{ opacity: 1, x: 0, y: yOffset }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "relative w-[432px] bg-white rounded-[9px] shadow-[0px_6px_20px_0px_rgba(142,149,165,0.25)] border-[0.7px] border-[#d2d6dd] px-[12px] py-[14px] pointer-events-none"
          )}
        >
          {/* Input Section */}
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center gap-[6px]">
              <div className="rotate-90 flex items-center justify-center shrink-0">
                <BoxArrowInUp />
              </div>
              <span className="text-[14px] font-medium text-[#262626] font-['Fira_Code'] tracking-[-0.56px]">Input</span>
            </div>
            
            <div className="flex flex-col gap-[12px]">
              <div className="flex items-start gap-[40px]">
                <span className="text-[14px] text-[#8a91a0] w-[100px] shrink-0 font-['Fira_Code'] tracking-[-0.56px]">Role</span>
                <span className="text-[14px] bg-[#edeff6] px-[4px] py-0 rounded-[2px] text-[#5a5a5a] font-['Fira_Code'] tracking-[-0.56px]">
                  {data.input.role}
                </span>
              </div>
              
              <div className="flex items-start gap-[40px]">
                <span className="text-[14px] text-[#8a91a0] w-[100px] shrink-0 font-['Fira_Code'] tracking-[-0.56px]">Team</span>
                <div className="flex flex-wrap gap-[4px] grow">
                  {data.input.team.map((member, i) => (
                    <span key={i} className="text-[14px] bg-[#edeff6] px-[4px] py-0 rounded-[2px] text-[#5a5a5a] font-['Fira_Code'] tracking-[-0.56px]">
                      {member}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-start gap-[40px]">
                <span className="text-[14px] text-[#8a91a0] w-[100px] shrink-0 font-['Fira_Code'] tracking-[-0.56px]">Time</span>
                <span className="text-[14px] bg-[#edeff6] px-[4px] py-0 rounded-[2px] text-[#5a5a5a] font-['Fira_Code'] tracking-[-0.56px]">
                  {data.input.time}
                </span>
              </div>
            </div>
          </div>

          <div className="my-[16px] h-[1px] bg-[#EDEDED] w-full" />

          {/* Output Section */}
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center gap-[6px]">
              <BoxArrowRight />
              <span className="text-[14px] font-medium text-[#262626] font-['Fira_Code'] tracking-[-0.56px]">Output</span>
            </div>

            <div className="flex flex-col gap-[12px]">
              <div className="flex items-start gap-[40px]">
                <span className="text-[14px] text-[#8a91a0] w-[100px] shrink-0 font-['Fira_Code'] tracking-[-0.56px]">Project</span>
                <div className="text-[14px] bg-[#edeff6] px-[4px] py-0 rounded-[2px] text-[#5a5a5a] font-['Fira_Code'] tracking-[-0.56px] leading-[1.3] grow">
                  {data.output.description}
                </div>
              </div>

              <div className="flex items-start gap-[40px]">
                <span className="text-[14px] text-[#8a91a0] w-[100px] shrink-0 font-['Fira_Code'] tracking-[-0.56px]">Tag</span>
                <div className="flex flex-wrap gap-[4px] grow">
                  {data.output.tags.map((tag, i) => (
                    <span key={i} className="text-[14px] bg-[#edeff6] px-[4px] py-0 rounded-[2px] text-[#5a5a5a] font-['Fira_Code'] tracking-[-0.56px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Image */}
          <div className="mt-[20px] rounded-[6px] overflow-hidden bg-[#f1f8ff] h-[290px]">
            <ImageWithFallback
              src={data.previewImage}
              alt="Project Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}