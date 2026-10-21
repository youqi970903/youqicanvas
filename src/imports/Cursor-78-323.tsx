import svgPaths from "./svg-ib8t6nfb2k";

function Comment() {
  return (
    <div className="absolute bg-[#262626] content-stretch flex items-start left-[17.71px] px-[16px] py-[6px] rounded-[24px] top-[8.55px]" data-name="Comment">
      <div aria-hidden="true" className="absolute border-2 border-[#262626] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white">Click to view</p>
    </div>
  );
}

export default function Cursor() {
  return (
    <div className="relative size-full" data-name="Cursor">
      <Comment />
      <div className="absolute h-[17.985px] left-0 top-0 w-[17.113px]" data-name="Cursor">
        <div className="absolute inset-[-11.12%_-17.53%_-22.24%_-17.55%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.1162 23.9863">
            <g filter="url(#filter0_d_78_192)" id="Cursor">
              <path d={svgPaths.p2e32a00} fill="var(--fill-0, #262626)" />
              <path d={svgPaths.p2b8bc2f0} stroke="var(--stroke-0, white)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="23.9863" id="filter0_d_78_192" width="23.1162" x="0" y="-1.19209e-07">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="1" />
                <feGaussianBlur stdDeviation="1" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_78_192" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_78_192" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}