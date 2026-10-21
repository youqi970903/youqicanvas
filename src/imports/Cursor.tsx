import svgPaths from "./svg-ol0fzlg84r";

export default function Cursor() {
  return (
    <div className="relative size-full" data-name="Cursor">
      <div className="absolute inset-[-2.92%_-12.07%_-16.69%_-12.07%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.724 23.2167">
          <g filter="url(#filter0_d_77_23)" id="Cursor">
            <path d={svgPaths.p4f1b440} fill="var(--fill-0, #262626)" />
            <path d={svgPaths.p224f0f0} stroke="var(--stroke-0, white)" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="23.2167" id="filter0_d_77_23" width="21.724" x="2.23517e-08" y="-2.98023e-08">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_77_23" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_77_23" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}