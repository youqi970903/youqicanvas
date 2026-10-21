import svgPaths from "./svg-6hys7zjo9y";
import img3 from "figma:asset/465ff88ebe2c44caf85e409db10cb72c0dc0b390.png";

function BoxArrowInUp() {
  return (
    <div className="relative size-[18px]" data-name="box-arrow-in-up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="box-arrow-in-up">
          <path d={svgPaths.p30557bf0} fill="var(--fill-0, #262626)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0 size-[18px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <BoxArrowInUp />
        </div>
      </div>
      <div className="flex flex-col font-['Fira_Code:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#262626] text-[14px] text-nowrap tracking-[-0.56px]">
        <p className="leading-[normal]">Input</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#edeff6] content-stretch flex items-center justify-center px-[4px] py-[2px] relative rounded-[2px] shrink-0">
      <div className="flex flex-col font-['Fira_Code:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#5a5a5a] text-[14px] text-nowrap tracking-[-0.56px]">
        <p className="leading-[normal]">2020 - Present</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
      <Frame5 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['Fira_Code:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#8a91a0] text-[14px] tracking-[-0.56px] w-[100px]">
        <p className="leading-[normal]">Timeline</p>
      </div>
      <Frame4 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-[#edeff6] content-stretch flex items-center justify-center px-[4px] py-[2px] relative rounded-[2px] shrink-0">
      <div className="flex flex-col font-['Fira_Code:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#5a5a5a] text-[14px] text-nowrap tracking-[-0.56px]">
        <p className="leading-[normal]">SaaS</p>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-[#edeff6] content-stretch flex items-center justify-center px-[4px] py-[2px] relative rounded-[2px] shrink-0">
      <div className="flex flex-col font-['Fira_Code:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#5a5a5a] text-[14px] text-nowrap tracking-[-0.56px]">
        <p className="leading-[normal]">B2B</p>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-[#edeff6] content-stretch flex items-center justify-center px-[4px] py-[2px] relative rounded-[2px] shrink-0">
      <div className="flex flex-col font-['Fira_Code:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#5a5a5a] text-[14px] text-nowrap tracking-[-0.56px]">
        <p className="leading-[normal]">AI</p>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="bg-[#edeff6] content-stretch flex items-center justify-center px-[4px] py-[2px] relative rounded-[2px] shrink-0">
      <div className="flex flex-col font-['Fira_Code:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#5a5a5a] text-[14px] text-nowrap tracking-[-0.56px]">
        <p className="leading-[normal]">Data</p>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="bg-[#edeff6] content-stretch flex items-center justify-center px-[4px] py-[2px] relative rounded-[2px] shrink-0">
      <div className="flex flex-col font-['Fira_Code:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#5a5a5a] text-[14px] text-nowrap tracking-[-0.56px]">
        <p className="leading-[normal]">Life Science</p>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="basis-0 content-start flex flex-wrap gap-[4px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame14 />
      <Frame7 />
      <Frame9 />
      {[...Array(2).keys()].map((_, i) => (
        <Frame10 key={i} />
      ))}
      <Frame8 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['Fira_Code:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#8a91a0] text-[14px] tracking-[-0.56px] w-[100px]">
        <p className="leading-[normal]">Industry</p>
      </div>
      <Frame15 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-[#edeff6] content-stretch flex items-center justify-center px-[4px] py-[2px] relative rounded-[2px] shrink-0">
      <div className="flex flex-col font-['Fira_Code:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#5a5a5a] text-[14px] text-nowrap tracking-[-0.56px]">
        <p className="leading-[normal]">Communication</p>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="bg-[#edeff6] content-stretch flex items-center justify-center px-[4px] py-[2px] relative rounded-[2px] shrink-0">
      <div className="flex flex-col font-['Fira_Code:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#5a5a5a] text-[14px] text-nowrap tracking-[-0.56px]">
        <p className="leading-[normal]">Collaboration</p>
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="bg-[#edeff6] content-stretch flex items-center justify-center px-[4px] py-[2px] relative rounded-[2px] shrink-0">
      <div className="flex flex-col font-['Fira_Code:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#5a5a5a] text-[14px] text-nowrap tracking-[-0.56px]">
        <p className="leading-[normal]">Prioritization</p>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="basis-0 content-start flex flex-wrap gap-[4px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame16 />
      <Frame17 />
      <Frame18 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['Fira_Code:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#8a91a0] text-[14px] tracking-[-0.56px] w-[100px]">
        <p className="leading-[normal]">Skills</p>
      </div>
      <Frame19 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame />
      <Frame1 />
      <Frame2 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame12 />
      <Frame20 />
    </div>
  );
}

function BoxArrowRight() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="box-arrow-right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="box-arrow-right">
          <path d={svgPaths.p28804b40} fill="var(--fill-0, #262626)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <BoxArrowRight />
      <div className="flex flex-col font-['Fira_Code:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#262626] text-[14px] text-nowrap tracking-[-0.56px]">
        <p className="leading-[normal]">Output</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#edeff6] content-stretch flex items-center justify-center px-[4px] py-[2px] relative rounded-[4px] shrink-0">
      <div className="flex flex-col font-['Fira_Code:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#5a5a5a] text-[14px] text-nowrap tracking-[-0.56px]">
        <p className="leading-[normal]">Selected Projects</p>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="absolute contents left-0 top-0" data-name="2">
      <div className="absolute left-0 size-[16px] top-0" data-name="3">
        <img alt="" className="block max-w-none size-full" height="16" src={img3} width="16" />
      </div>
      <div className="absolute left-[6.88px] size-[2.4px] top-[13.6px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.4 2.4">
          <circle cx="1.2" cy="1.2" fill="var(--fill-0, #5A5A5A)" id="Ellipse 1" r="1.2" />
        </svg>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Component 3">
      <Component />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex items-center justify-center px-[4px] py-[2px] relative rounded-[4px] shrink-0">
      <div className="flex flex-col font-['Fira_Code:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#5a5a5a] text-[14px] text-nowrap tracking-[-0.56px]">
        <p className="leading-[normal]">Processing more...</p>
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Component1 />
      <Frame22 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame6 />
      <Frame26 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['Fira_Code:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#8a91a0] text-[14px] tracking-[-0.56px] w-[100px]">
        <p className="leading-[normal]">Achievement</p>
      </div>
      <Frame23 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame3 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame13 />
      <Frame24 />
    </div>
  );
}

export default function Frame25() {
  return (
    <div className="bg-white relative rounded-[8.803px] size-full">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[20px] items-start justify-center overflow-clip px-[12px] py-[14px] relative size-full">
          <Frame21 />
          <div className="h-0 relative shrink-0 w-[412px]">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 412 1">
                <line id="Line 56" stroke="var(--stroke-0, #EDEFF6)" x2="412" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
          <Frame11 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#d2d6dd] border-[0.728px] border-solid inset-[-0.728px] pointer-events-none rounded-[9.531px] shadow-[0px_6px_20px_0px_rgba(142,149,165,0.25)]" />
    </div>
  );
}