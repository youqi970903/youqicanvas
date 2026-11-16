import { SquareDashed, WandSparkles, X } from 'lucide-react';
import './CanvasSettingsPanel.css';
import { ToolbarTooltip } from './ToolbarTooltip';
import { cn } from './types';
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type RefObject } from 'react';
import type { AsciiSettings } from './asciiSettings';
import { PAGE_FONTS, type TypographySettings } from './typographySettings';

import type { GridSettings } from './gridSettings';

type Appearance =
  | { mode: 'ascii'; settings: AsciiSettings; onChange: (settings: AsciiSettings) => void }
  | { mode: 'grid'; settings: GridSettings; onChange: (settings: GridSettings) => void };

// Saved panel position relative to the canvas toolbar.
const DEFAULT_PANEL_POSITION = { left: -298.765, top: -500.221 };
const settingsButtonClass = 'grid size-6 shrink-0 cursor-pointer place-items-center rounded-[5px] text-black min-[480px]:size-[26px]';
const fieldBorderClass = 'rounded border border-[#e2e4ec]';
const fieldClass = cn(fieldBorderClass, 'w-full min-w-0 bg-white px-2 py-1');

function Slider({ label, value, min, max, step = 1, unit, onChange }: {
  label: string; value: number; min: number; max: number; step?: number;
  unit: string; onChange: (value: number) => void;
}) {
  return (
    <label className="grid min-w-0 gap-0">
      <span className="flex flex-wrap justify-between gap-x-1">
        {label}
        <span aria-hidden="true" className="tabular-nums text-[#52525b]">{value}{unit}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
        aria-valuetext={unit ? `${value}${unit}` : undefined}
        className="settings-slider"
        style={{ '--slider-ratio': (value - min) / (max - min) } as CSSProperties}
      />
    </label>
  );
}

function ColorField({ label, value, onChange }: {
  label: string; value: string; onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1">
      {label}
      <input type="color" value={value} onInput={(event) => onChange(event.currentTarget.value)}
        className={cn(fieldBorderClass, "settings-color h-7 w-full cursor-pointer")}
      />
    </label>
  );
}

function FadeCurve({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-1">
      Fade curve
      <select className={cn(fieldClass, "settings-select")} value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}>
        <option value={1}>Linear</option>
        <option value={1.5}>Soft</option>
        <option value={2.5}>Quick</option>
      </select>
    </label>
  );
}

export function CanvasSettingsPanel({
  canvasRef, appearance, typography, onTypographyChange,
  verticalMargin, onVerticalMarginChange, horizontalMargin, onHorizontalMarginChange,
}: {
  canvasRef: RefObject<HTMLDivElement>;
  appearance: Appearance;
  typography: TypographySettings;
  onTypographyChange: (settings: TypographySettings) => void;
  verticalMargin: number;
  onVerticalMarginChange: (margin: number) => void;
  horizontalMargin: number;
  onHorizontalMarginChange: (margin: number) => void;
}) {
  const { settings, mode } = appearance;
  const updateCommon = (patch: Partial<Pick<AsciiSettings, 'cellSize' | 'radius' | 'strength' | 'fadeMs' | 'fadeCurve' | 'backgroundColor' | 'trailColor'>>) => {
    if (appearance.mode === 'ascii') {
      appearance.onChange({ ...appearance.settings, ...patch });
    } else {
      appearance.onChange({ ...appearance.settings, ...patch });
    }
  };

  const [activePanel, setActivePanel] = useState<'canvas' | 'typography' | 'layout' | null>(null);
  const canvasButtonRef = useRef<HTMLButtonElement>(null);
  const typographyButtonRef = useRef<HTMLButtonElement>(null);
  const layoutButtonRef = useRef<HTMLButtonElement>(null);

  const closePanel = () => {
    if (!activePanel) return;
    const trigger = { canvas: canvasButtonRef, typography: typographyButtonRef, layout: layoutButtonRef }[activePanel];
    setActivePanel(null);
    trigger.current?.focus();
  };
  const panelRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef<{ x: number; y: number } | null>(null);
  const [position, setPosition] = useState(DEFAULT_PANEL_POSITION);

  useEffect(() => {
    const panel = panelRef.current;
    const canvas = canvasRef.current;
    if (!panel || !canvas) return;

    const observer = new ResizeObserver(() => {
      const bounds = panel.getBoundingClientRect();
      const limit = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const dx = Math.min(0, limit.right - bounds.right) + Math.max(0, limit.left - bounds.left);
      const dy = Math.min(0, limit.bottom - bounds.bottom) + Math.max(0, limit.top - bounds.top);
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      setPosition((current) => ({ left: current.left + dx, top: current.top + dy }));
    });
    observer.observe(panel);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [canvasRef]);

  const startDrag = (event: PointerEvent<HTMLHeadingElement>) => {
    if (event.button !== 0 || !panelRef.current) return;
    const bounds = panelRef.current.getBoundingClientRect();
    dragOffset.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const movePanel = (event: PointerEvent<HTMLHeadingElement>) => {
    const offset = dragOffset.current;
    const panel = panelRef.current;
    const canvas = canvasRef.current;
    if (!offset || !panel || !canvas) return;

    const canvasBounds = canvas.getBoundingClientRect();
    const origin = panel.offsetParent?.getBoundingClientRect();
    if (!origin) return;

    const x = Math.max(canvasBounds.left, Math.min(event.clientX - offset.x, canvasBounds.right - panel.offsetWidth));
    const y = Math.max(canvasBounds.top, Math.min(event.clientY - offset.y, canvasBounds.bottom - panel.offsetHeight));
    setPosition({ left: x - origin.left, top: y - origin.top });
  };

  return (
    <div
      data-canvas-settings
      className="flex items-center gap-0.5 min-[480px]:gap-2"
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || !activePanel) return;
        event.preventDefault();
        closePanel();
      }}
    >
      <button
        ref={canvasButtonRef}
        type="button"
        aria-label="Canvas settings"
        aria-pressed={activePanel === 'canvas'}
        aria-expanded={activePanel === 'canvas'}
        aria-controls="canvas-toolbar-settings"
        className={cn(settingsButtonClass, 'group/toolbar relative', activePanel === 'canvas' ? 'bg-[#ebebeb]' : 'hover:bg-[#f2f2f2]')}
        onClick={() => setActivePanel((current) => current === 'canvas' ? null : 'canvas')}
      >
        <WandSparkles aria-hidden="true" size={16} strokeWidth={2} />
        <ToolbarTooltip label="Canvas settings" />
      </button>
      <button
        ref={typographyButtonRef}
        type="button"
        aria-label="Typography settings"
        aria-pressed={activePanel === 'typography'}
        aria-expanded={activePanel === 'typography'}
        aria-controls="canvas-toolbar-settings"
        className={cn(settingsButtonClass, 'group/toolbar relative', activePanel === 'typography' ? 'bg-[#ebebeb]' : 'hover:bg-[#f2f2f2]')}
        onClick={() => setActivePanel((current) => current === 'typography' ? null : 'typography')}
      >
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 4.5v-.75a1.5 1.5 0 0 1 1.5-1.5h9A1.5 1.5 0 0 1 14 3.75v.75M8 2.25v11.5m-2.25 0h4.5" />
        </svg>
        <ToolbarTooltip label="Typography settings" />
      </button>
      <button
        ref={layoutButtonRef}
        type="button"
        aria-label="Layout settings"
        aria-pressed={activePanel === 'layout'}
        aria-expanded={activePanel === 'layout'}
        aria-controls="canvas-toolbar-settings"
        className={cn(settingsButtonClass, 'group/toolbar relative', activePanel === 'layout' ? 'bg-[#ebebeb]' : 'hover:bg-[#f2f2f2]')}
        onClick={() => setActivePanel((current) => current === 'layout' ? null : 'layout')}
      >
        <SquareDashed aria-hidden="true" size={16} strokeWidth={2} />
        <ToolbarTooltip label="Layout settings" />
      </button>
      <div
        ref={panelRef}
        id="canvas-toolbar-settings"
        role="region"
        aria-labelledby="canvas-toolbar-settings-title"
        hidden={!activePanel}
        style={position}
        className={`canvas-control-surface absolute z-20 max-h-[min(65vh,460px)] w-[min(19rem,calc(100dvw-2*var(--page-margin-x)-8px))] flex-col text-[#262626] ${activePanel ? 'flex' : 'hidden'}`}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#e2e4ec] px-3 py-2">
          <h2
            id="canvas-toolbar-settings-title"
            className="flex flex-1 touch-none cursor-grab items-center gap-2 active:cursor-grabbing"
            onPointerDown={startDrag}
            onPointerMove={movePanel}
            onLostPointerCapture={() => { dragOffset.current = null; }}
          >
            <span aria-hidden="true" className="text-[#71717a]">⠿</span>
            {activePanel === 'layout' ? 'Layout' : activePanel === 'typography' ? 'Typography' : mode === 'ascii' ? 'ASCII settings' : 'Grid settings'}
          </h2>
          <button type="button" aria-label="Close settings" title="Close settings" onClick={closePanel}
            className={cn(settingsButtonClass, 'hover:bg-[#f2f2f2]')}>
            <X aria-hidden="true" size={18} strokeWidth={2} />
          </button>
        </div>

        <div key={activePanel} className="grid min-h-0 cursor-default gap-3 overflow-y-auto overscroll-contain p-3">
          {activePanel === 'layout' ? (
            <>
              <Slider label="Top / bottom margin" value={verticalMargin} min={0} max={200} unit=" px"
                onChange={onVerticalMarginChange} />
              <Slider label="Left / right margin" value={horizontalMargin} min={0} max={200} unit=" px"
                onChange={onHorizontalMarginChange} />
            </>
          ) : activePanel === 'typography' ? (
            <div className="grid min-w-0 gap-3">
              <label className="grid min-w-0 gap-1">
                Page font
                <select className={cn(fieldClass, "settings-select")} value={typography.font}
                  onChange={(event) => onTypographyChange({
                    ...typography, font: event.currentTarget.value as TypographySettings['font'],
                  })}>
                  {Object.keys(PAGE_FONTS).map((font) => <option key={font}>{font}</option>)}
                </select>
              </label>
              <Slider label="Page font size" value={typography.fontSize} min={10} max={22} unit=" px"
                onChange={(fontSize) => onTypographyChange({ ...typography, fontSize })} />
              <label className="grid min-w-0 gap-1">
                Font weight
                <select className={cn(fieldClass, "settings-select")} value={typography.weight}
                  onChange={(event) => onTypographyChange({ ...typography, weight: Number(event.currentTarget.value) })}>
                  {[300, 400, 500, 600, 700].map((weight) => <option key={weight}>{weight}</option>)}
                </select>
              </label>
              <Slider label="Letter spacing" value={typography.spacing} min={-12} max={12} unit="%"
                onChange={(spacing) => onTypographyChange({ ...typography, spacing })} />
            </div>
          ) : activePanel === 'canvas' ? (
            <>
              <Slider label={mode === 'ascii' ? 'ASCII character spacing' : 'Grid spacing'}
                value={settings.cellSize} min={6} max={mode === 'ascii' ? 32 : 80}
                unit=" px" onChange={(cellSize) => updateCommon({ cellSize })} />
              {appearance.mode === 'ascii' ? (
                <Slider label="ASCII character size" value={appearance.settings.fontSize} min={4} max={24}
                  unit=" px" onChange={(fontSize) => appearance.onChange({ ...appearance.settings, fontSize })} />
              ) : (
                <Slider label="Line width" value={appearance.settings.lineWidth} min={0.5} max={4} step={0.5}
                  unit=" px" onChange={(lineWidth) => appearance.onChange({ ...appearance.settings, lineWidth })} />
              )}
              <Slider label={mode === 'ascii' ? 'Trail radius' : 'Trail range'}
                value={settings.radius} min={20} max={200} step={5}
                unit={mode === 'ascii' ? ' px' : '%'} onChange={(radius) => updateCommon({ radius })} />
              <Slider label="Trail strength" value={settings.strength} min={0} max={100}
                unit="%" onChange={(strength) => updateCommon({ strength })} />
              <Slider label="Fade duration" value={settings.fadeMs} min={100} max={mode === 'ascii' ? 2000 : 5000} step={50}
                unit=" ms" onChange={(fadeMs) => updateCommon({ fadeMs })} />

              <div className={cn("grid gap-2", mode === "ascii" ? "grid-cols-3" : "grid-cols-2")}>
                <ColorField label="Background" value={settings.backgroundColor}
                  onChange={(backgroundColor) => updateCommon({ backgroundColor })} />
                {appearance.mode === 'ascii' ? (
                  <ColorField label="Characters" value={appearance.settings.characterColor}
                    onChange={(characterColor) => appearance.onChange({ ...appearance.settings, characterColor })} />
                ) : (
                  <ColorField label="Grid lines" value={appearance.settings.lineColor}
                    onChange={(lineColor) => appearance.onChange({ ...appearance.settings, lineColor })} />
                )}
                {appearance.mode === 'ascii' && (
                  <ColorField label="Trail" value={settings.trailColor}
                    onChange={(trailColor) => updateCommon({ trailColor })} />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {appearance.mode === 'ascii' ? (
                  <label className="grid gap-1">
                    ASCII font
                    <select className={cn(fieldClass, "settings-select")} value={appearance.settings.font}
                      onChange={(event) => appearance.onChange({ ...appearance.settings, font: event.currentTarget.value })}>
                      <option value="monospace">Monospace</option>
                      <option value="'Courier New', monospace">Courier New</option>
                      <option value="Menlo, monospace">Menlo</option>
                    </select>
                  </label>
                ) : (
                  <label className="grid gap-1">
                    Trail palette
                    <select className={cn(fieldClass, "settings-select")} value={appearance.settings.useMulticolor ? 'multi' : 'single'}
                      onChange={(event) => appearance.onChange({
                        ...appearance.settings,
                        useMulticolor: event.currentTarget.value === 'multi',
                      })}>
                      <option value="multi">Multicolor</option>
                      <option value="single">Single color</option>
                    </select>
                  </label>
                )}
                <FadeCurve value={settings.fadeCurve} onChange={(fadeCurve) => updateCommon({ fadeCurve })} />
              </div>

              {appearance.mode === 'grid' && (
                <div className="grid grid-cols-2 gap-2">
                  <ColorField label={appearance.settings.useMulticolor ? "Main color" : "Trail color"}
                    value={appearance.settings.trailColor}
                    onChange={(trailColor) => appearance.onChange({ ...appearance.settings, trailColor })} />
                  {appearance.settings.useMulticolor && (
                    <ColorField label="Cooling color" value={appearance.settings.trailCoolingColor}
                      onChange={(trailCoolingColor) => appearance.onChange({ ...appearance.settings, trailCoolingColor })} />
                  )}
                </div>
              )}

              {appearance.mode === 'ascii' && (
                <>
                  <label className="grid gap-1">
                    Pattern rows
                    <textarea className={fieldClass} rows={3} maxLength={240} spellCheck={false}
                      value={appearance.settings.pattern}
                      onChange={(event) => appearance.onChange({ ...appearance.settings, pattern: event.currentTarget.value })} />
                  </label>
                  <label className="grid gap-1">
                    Trail characters
                    <input className={fieldClass} maxLength={32} spellCheck={false}
                      value={appearance.settings.trailCharacters}
                      onChange={(event) => appearance.onChange({ ...appearance.settings, trailCharacters: event.currentTarget.value })} />
                  </label>
                </>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
