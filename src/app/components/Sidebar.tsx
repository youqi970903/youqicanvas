import React from 'react';
import { cn, NODE_TYPES } from './types';

export function Sidebar() {
  const nodeItems = [
    { type: NODE_TYPES.START, label: 'Start point', icon: '📍', color: 'bg-[#f1e6ff]' },
    { type: NODE_TYPES.ROLE, label: 'Role', icon: '👼', color: 'bg-[#d9ebff]' },
    { type: NODE_TYPES.EXPERIENCE, label: 'Experience', icon: '🎞️', color: 'bg-[#d8fce9]' },
    { type: NODE_TYPES.RESULT, label: 'Result', icon: '🌟', color: 'bg-[#edeff6]' },
  ];

  return (
    <div className="w-[240px] flex-shrink-0 h-full p-[20px] flex flex-col gap-[12px] bg-white z-20">
      <h3 className="text-[14px] font-medium text-[#262626] font-['Fira_Code'] tracking-[-0.56px] mb-[8px]">
        Node type
      </h3>
      
      {nodeItems.map((item, index) => (
        <div 
          key={index}
          className="bg-[#F9F9F9] rounded-[8px] p-[8px] flex items-center gap-[12px] border-[0.5px] border-[#d2d6dd] shadow-[0px_0px_5px_0px_rgba(142,149,165,0.1)] cursor-default"
        >
          <div className={cn(
            "flex items-center justify-center size-[36px] rounded-[6.6px]",
            item.color
          )}>
            <span className="text-[20px]">{item.icon}</span>
          </div>
          <span className="text-[14px] font-medium text-[#727D96] font-['Fira_Code'] tracking-[-0.56px]">
            {item.label}
          </span>
        </div>
      ))}

      <div className="mt-auto text-[14px] text-[#8e95a5] font-['Fira_Code'] tracking-[-0.56px] leading-[1.4]">
        More nodes <br />
        coming soon...
      </div>
    </div>
  );
}