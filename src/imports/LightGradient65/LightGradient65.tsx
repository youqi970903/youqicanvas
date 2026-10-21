import imgImage4 from "./ce5afed779c7d661ca9284dd4b033685b15e7050.png";
import imgImage5 from "./b1a2ee4f636c7b52e11616f3eb32ea8d52592e9b.png";

function Group() {
  return (
    <div className="absolute contents left-[319.16px] top-[628.59px]">
      <div className="absolute h-[256.528px] left-[911.65px] top-[628.59px] w-[959.73px]" data-name="image 5">
        <div className="absolute inset-0 mix-blend-color-burn overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[368.58%] left-[-44.27%] max-w-none top-[-134.29%] w-[188.55%]" src={imgImage5} />
        </div>
      </div>
      <p className="absolute font-['Graphik:Regular',sans-serif] leading-[normal] left-[319.16px] not-italic text-[#375dff] text-[124.687px] top-[692.15px] tracking-[-4.9875px] whitespace-nowrap">Design for</p>
    </div>
  );
}

export default function LightGradient() {
  return (
    <div className="bg-[#cad0e1] relative size-full" data-name="Light Gradient 65">
      <div className="absolute h-[1530.936px] left-[-382.11px] top-[-8.62px] w-[2930.021px]" data-name="image 4">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-cover size-full" src={imgImage4} />
          <div className="absolute bg-[rgba(255,255,255,0.61)] inset-0" />
        </div>
      </div>
      <div className="absolute bg-[#b8cdff] h-[368.909px] left-[336.47px] top-[598.87px] w-[1517.6px]" />
      <Group />
    </div>
  );
}