import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { NodeCard, isProjectNode } from './components/NodeCard';
import { Connector } from './components/Connector';
import { AsciiBackground } from './components/AsciiBackground';
import { CanvasSettingsPanel } from './components/CanvasSettingsPanel';
import { ToolbarTooltip } from './components/ToolbarTooltip';
import { DEFAULT_TYPOGRAPHY, PAGE_FONTS } from './components/typographySettings';
import { DEFAULT_GRID_SETTINGS } from './components/gridSettings';
import { DEFAULT_ASCII_SETTINGS } from './components/asciiSettings';
import { GridCursor } from './components/GridCursor';
import { NodeData, Connection, NODE_TYPES } from './components/types';
import { cn } from './components/types';

// Tooltip Imports
import { ProjectTooltip } from './components/ProjectTooltip';
import { BornTooltip } from './components/BornTooltip';
import { YouqiTooltip } from './components/YouqiTooltip';
import { WorkTooltip } from './components/WorkTooltip';
import { CreativeTooltip } from './components/CreativeTooltip';
import { BenchlingTooltip } from './components/BenchlingTooltip';
import { ArchivedTooltip } from './components/ArchivedTooltip';

// Importing assets from the Figma export
import imgImage3 from "../imports/image-9.png";
import imgImage2 from "../imports/image-12.png";
import imgImage4 from "figma:asset/9c7e05eddfd34644a301e889436ee77b867e0c26.png";
import imgGradientBackground from "figma:asset/dcdf8ac3d739ccf6bcf41e13e8b3a700f9735fb8.png";
import imgNoise from "figma:asset/c39a2215280e36dcd4f202040d7e3a368d62f083.png";
import imgBenchling from "../imports/LightGradient68/46964bea6e5e03c8226977c782fb781ff64234f5.png";

const DEFAULT_VERTICAL_MARGIN = 16;
const DEFAULT_HORIZONTAL_MARGIN = 40;
const DEFAULT_CANVAS_MODE = 'ascii';
// The same world point stays centered when the canvas opens at a different size.
const DEFAULT_CANVAS_VIEW = { centerX: 717.3807, centerY: 593.4584, scale: 0.90592 };

const INITIAL_NODES: NodeData[] = [
  { id: 'born', type: NODE_TYPES.START, label: 'Born!', icon: '👼', position: { x: 34.0909, y: 380.221 } },
  { id: 'youqi', type: NODE_TYPES.ROLE, label: 'Youqi W.', icon: '👧', position: { x: 312.053, y: 335.273 } },
  { id: 'work', type: NODE_TYPES.EXPERIENCE, label: 'Work', icon: '💼', position: { x: 636, y: 400 } },
  { id: 'creative', type: NODE_TYPES.EXPERIENCE, label: 'Creative', icon: '🪄', position: { x: 583, y: 698 } },
  { id: 'benchling', type: NODE_TYPES.EXPERIENCE, label: 'Benchling', icon: '🧬', image: imgBenchling, position: { x: 900, y: 300 } },
  { id: 'project1', type: NODE_TYPES.EXPERIENCE, label: 'Ragene', icon: 'R', image: imgImage3, position: { x: 1000, y: 380 } },
  { id: 'project3', type: NODE_TYPES.EXPERIENCE, label: 'Marlo', icon: 'M', image: imgImage4, position: { x: 1044, y: 630 } },
  { id: 'project2', type: NODE_TYPES.EXPERIENCE, label: 'Ragene AI', icon: 'R', image: imgImage2, position: { x: 1250, y: 360 } },
  { id: 'archived', type: NODE_TYPES.EXPERIENCE, label: 'Archived', icon: '📁', position: { x: 976, y: 870 } },
];

const INITIAL_CONNECTIONS: Connection[] = [
  { sourceId: 'born', targetId: 'youqi' },
  { sourceId: 'youqi', targetId: 'work' },
  { sourceId: 'youqi', targetId: 'creative' },
  { sourceId: 'work', targetId: 'benchling' },
  { sourceId: 'work', targetId: 'project1' },
  { sourceId: 'work', targetId: 'project3' },
  { sourceId: 'work', targetId: 'archived' },
  { sourceId: 'project1', targetId: 'project2' },
];

export default function App() {
  const [nodes] = useState<NodeData[]>(INITIAL_NODES);
  const [nodeDimensions, setNodeDimensions] = useState<Record<string, { width: number; height: number }>>({});
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: DEFAULT_CANVAS_VIEW.scale });
  const [canvasMode, setCanvasMode] = useState<'grid' | 'ascii'>(DEFAULT_CANVAS_MODE);
  const [gridSettings, setGridSettings] = useState(DEFAULT_GRID_SETTINGS);
  const [asciiSettings, setAsciiSettings] = useState(DEFAULT_ASCII_SETTINGS);
  const [typography, setTypography] = useState(DEFAULT_TYPOGRAPHY);
  const [verticalMargin, setVerticalMargin] = useState(DEFAULT_VERTICAL_MARGIN);
  const [horizontalMargin, setHorizontalMargin] = useState(DEFAULT_HORIZONTAL_MARGIN);
  const [settingsResetCount, setSettingsResetCount] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const projectHintRef = useRef<HTMLDivElement>(null);
  const projectHintX = useMotionValue(0);
  const projectHintY = useMotionValue(0);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Center nodes after the initial layout or a full reset.
  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { centerX, centerY, scale } = DEFAULT_CANVAS_VIEW;
      const x = rect.width / 2 - centerX * scale;
      const y = rect.height / 2 - centerY * scale;
      setViewport({ x, y, scale });
    }
  }, [settingsResetCount]);

  // Define motion values at the top level for all nodes
  const bornX = useMotionValue(INITIAL_NODES[0].position.x);
  const bornY = useMotionValue(INITIAL_NODES[0].position.y);
  const youqiX = useMotionValue(INITIAL_NODES[1].position.x);
  const youqiY = useMotionValue(INITIAL_NODES[1].position.y);
  const workX = useMotionValue(INITIAL_NODES[2].position.x);
  const workY = useMotionValue(INITIAL_NODES[2].position.y);
  const creativeX = useMotionValue(INITIAL_NODES[3].position.x);
  const creativeY = useMotionValue(INITIAL_NODES[3].position.y);
  const benchlingX = useMotionValue(INITIAL_NODES[4].position.x);
  const benchlingY = useMotionValue(INITIAL_NODES[4].position.y);
  const project1X = useMotionValue(INITIAL_NODES[5].position.x);
  const project1Y = useMotionValue(INITIAL_NODES[5].position.y);
  const project3X = useMotionValue(INITIAL_NODES[6].position.x);
  const project3Y = useMotionValue(INITIAL_NODES[6].position.y);
  const project2X = useMotionValue(INITIAL_NODES[7].position.x);
  const project2Y = useMotionValue(INITIAL_NODES[7].position.y);
  const archivedX = useMotionValue(INITIAL_NODES[8].position.x);
  const archivedY = useMotionValue(INITIAL_NODES[8].position.y);

  // Map them for easy access
  const nodePositions: Record<string, { x: any, y: any }> = {
    born: { x: bornX, y: bornY },
    youqi: { x: youqiX, y: youqiY },
    work: { x: workX, y: workY },
    creative: { x: creativeX, y: creativeY },
    benchling: { x: benchlingX, y: benchlingY },
    project1: { x: project1X, y: project1Y },
    project3: { x: project3X, y: project3Y },
    project2: { x: project2X, y: project2Y },
    archived: { x: archivedX, y: archivedY }
  };

  const handleNodeResize = useCallback((id: string, width: number, height: number) => {
    setNodeDimensions(prev => {
      if (prev[id]?.width === width && prev[id]?.height === height) return prev;
      return { ...prev, [id]: { width, height } };
    });
  }, []);

  const moveProjectHint = (event: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    const hint = projectHintRef.current;
    if (!canvas || !hint) return;

    const bounds = canvas.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const gap = 12;
    const maxX = Math.max(0, bounds.width - hint.offsetWidth - 4);
    const maxY = Math.max(0, bounds.height - hint.offsetHeight - 4);
    const left = x + gap <= maxX ? x + gap : x - hint.offsetWidth - gap;

    projectHintX.set(Math.max(4, Math.min(left, maxX)));
    projectHintY.set(Math.max(4, Math.min(y + 6, maxY)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // If we click anything that isn't a node or interactive element, start panning
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('.node-card') || target.closest('button') || target.closest('[data-canvas-settings]');
    
    if (!isInteractive) {
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setViewport(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.target instanceof Element && e.target.closest('[data-canvas-settings]')) return;
    // Prevent default scroll behavior to avoid jumping and browser zoom
    e.preventDefault();
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setViewport(prev => {
      // Sensitivity factor for zoom
      const zoomFactor = e.ctrlKey ? 0.02 : 0.002;
      const delta = -e.deltaY * zoomFactor;
      
      const newScale = Math.min(Math.max(prev.scale * (1 + delta), 0.1), 3);
      
      if (newScale === prev.scale) return prev;

      // Calculate where the mouse is relative to the content before scaling
      const mouseInContentX = (mouseX - prev.x) / prev.scale;
      const mouseInContentY = (mouseY - prev.y) / prev.scale;

      // Calculate new x and y to keep the same content under the mouse
      const newX = mouseX - mouseInContentX * newScale;
      const newY = mouseY - mouseInContentY * newScale;

      return {
        x: newX,
        y: newY,
        scale: newScale
      };
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (canvas) {
        canvas.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleMouseMove, handleMouseUp, handleWheel]);

  const zoomIn = () => setViewport(prev => ({ ...prev, scale: Math.min(prev.scale + 0.1, 2) }));
  const zoomOut = () => setViewport(prev => ({ ...prev, scale: Math.max(prev.scale - 0.1, 0.2) }));
  const resetAll = () => {
    setCanvasMode(DEFAULT_CANVAS_MODE);
    setGridSettings(DEFAULT_GRID_SETTINGS);
    setAsciiSettings(DEFAULT_ASCII_SETTINGS);
    setTypography(DEFAULT_TYPOGRAPHY);
    setVerticalMargin(DEFAULT_VERTICAL_MARGIN);
    setHorizontalMargin(DEFAULT_HORIZONTAL_MARGIN);
    setSettingsResetCount((count) => count + 1);
    setHoveredNodeId(null);
    setIsPanning(false);

    // Reset node positions
    bornX.set(INITIAL_NODES[0].position.x);
    bornY.set(INITIAL_NODES[0].position.y);
    youqiX.set(INITIAL_NODES[1].position.x);
    youqiY.set(INITIAL_NODES[1].position.y);
    workX.set(INITIAL_NODES[2].position.x);
    workY.set(INITIAL_NODES[2].position.y);
    creativeX.set(INITIAL_NODES[3].position.x);
    creativeY.set(INITIAL_NODES[3].position.y);
    benchlingX.set(INITIAL_NODES[4].position.x);
    benchlingY.set(INITIAL_NODES[4].position.y);
    project1X.set(INITIAL_NODES[5].position.x);
    project1Y.set(INITIAL_NODES[5].position.y);
    project3X.set(INITIAL_NODES[6].position.x);
    project3Y.set(INITIAL_NODES[6].position.y);
    project2X.set(INITIAL_NODES[7].position.x);
    project2Y.set(INITIAL_NODES[7].position.y);
    archivedX.set(INITIAL_NODES[8].position.x);
    archivedY.set(INITIAL_NODES[8].position.y);
  };

  // Tooltip Overlay Positioning Logic
  const activeNode = nodes.find(n => n.id === hoveredNodeId);
  const tooltipPos = useMemo(() => {
    if (!activeNode || !hoveredNodeId) return null;
    const pos = nodePositions[hoveredNodeId];
    if (!pos) return null;
    
    // Calculate current screen space position
    const screenX = viewport.x + pos.x.get() * viewport.scale;
    const screenY = viewport.y + pos.y.get() * viewport.scale;
    const nodeWidth = 180 * viewport.scale;
    const nodeHeight = (nodeDimensions[hoveredNodeId]?.height || 52) * viewport.scale;

    const side = (screenX + nodeWidth / 2) > window.innerWidth / 2 ? 'left' : 'right';
    
    return {
      x: side === 'right' ? screenX + nodeWidth + 12 : screenX - 12,
      y: screenY,
      side
    };
  }, [hoveredNodeId, viewport, nodeDimensions]);

  return (
    <div
      data-page-typography
      className="flex h-dvh w-full flex-col overflow-hidden bg-white select-none"
      style={{
        fontFamily: PAGE_FONTS[typography.font],
        fontSize: typography.fontSize,
        fontWeight: typography.weight,
        // Leave enough room for the canvas controls when a large margin is selected.
        '--page-margin-x': `max(0px, min(${horizontalMargin}px, (100dvw - 240px) / 2))`,
        '--page-margin-y': `max(0px, min(${verticalMargin}px, (100dvh - 240px) / 2))`,
        '--page-letter-spacing': `${typography.spacing / 100}em`,
      } as React.CSSProperties}
    >
      <header className="relative z-10 flex min-h-[46px] shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 px-[var(--page-margin-x)] pb-1 pt-[var(--page-margin-y)] text-[#262626]">
        <h1>
          Youqi Design &amp; Build across <span className="underline underline-offset-4">Her life</span> &amp;{' '}
          <span className="group relative inline-block whitespace-nowrap">
            <span tabIndex={0} aria-describedby="product-lifecycle-hint">Product lifecycle</span>
            <span
              id="product-lifecycle-hint"
              role="tooltip"
              aria-hidden="true"
              className={cn('ui-hint', 'invisible absolute right-0 top-full mt-1 group-hover:visible group-focus-within:visible')}
            >
              Coming soon
            </span>
          </span>
        </h1>
        <nav aria-label="Portfolio links" className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <button
            onClick={() => window.open('https://drive.google.com/file/d/1LiZJ8TkkyEsqIbZwW7UKxq1xcdb1xKNJ/view?usp=sharing', '_blank')}
            className="text-[#262626] hover:underline cursor-pointer"
          >
            Resume
          </button>
          <div className="w-[1px] h-[13px] bg-[#E2E4EC]" />
          <button
            onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=youqi9793@gmail.com', '_blank')}
            className="text-[#262626] hover:underline cursor-pointer"
          >
            Email
          </button>
          <div className="w-[1px] h-[13px] bg-[#E2E4EC]" />
          <button
            onClick={() => window.open('https://www.linkedin.com/in/youqi-w-1b8105233', '_blank')}
            className="text-[#262626] hover:underline cursor-pointer"
          >
            LinkedIn
          </button>
        </nav>
      </header>

      <main className="relative min-h-0 flex-1 overflow-hidden px-[var(--page-margin-x)] pb-[var(--page-margin-y)] pt-2">
        {/* Canvas Container */}
        <motion.div 
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          className="relative h-full w-full overflow-hidden rounded-[12px] bg-[#f7f7f7]"
          style={{ 
            cursor: isPanning ? 'grabbing' : 'grab',
          }}
        >
          {canvasMode === 'ascii' ? (
            <AsciiBackground settings={asciiSettings} />
          ) : (
            <>
              {/* Noise layer */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url(${imgNoise})` }}
              />

              {/* Gradient background layer */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  backgroundImage: `url(${imgGradientBackground})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />

              {/* Grid Background */}
              <div
                className="absolute inset-0 canvas-background"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, ${gridSettings.lineColor} ${gridSettings.lineWidth}px, transparent 1px),
                    linear-gradient(to bottom, ${gridSettings.lineColor} ${gridSettings.lineWidth}px, transparent 1px)
                  `,
                  backgroundSize: `${gridSettings.cellSize * viewport.scale}px ${gridSettings.cellSize * viewport.scale}px`,
                  backgroundPosition: `${viewport.x}px ${viewport.y}px`,
                  backgroundColor: gridSettings.backgroundColor,
                }}
              />

              <GridCursor settings={gridSettings} />
            </>
          )}

          {/* Node Layer */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
              transformOrigin: '0 0'
            }}
          >
            {/* Nodes Layer - Rendered first to stay behind connectors/arrows */}
            <div className="absolute inset-0 pointer-events-none">
              {nodes.map(node => (
                <div key={node.id} className="node-card pointer-events-auto">
                  <NodeCard 
                    {...node}
                    x={nodePositions[node.id].x}
                    y={nodePositions[node.id].y}
                    onResize={handleNodeResize}
                    onHoverChange={setHoveredNodeId}
                    onProjectMouseMove={moveProjectHint}
                    scale={viewport.scale}
                  />
                </div>
              ))}
            </div>

            {/* SVG Layer for connectors */}
            <svg className="absolute inset-0 overflow-visible w-full h-full pointer-events-none" style={{ zIndex: 20 }}>
              {INITIAL_CONNECTIONS.map((conn, idx) => {
                const sourcePos = nodePositions[conn.sourceId];
                const targetPos = nodePositions[conn.targetId];
                if (!sourcePos || !targetPos) return null;

                const sDim = nodeDimensions[conn.sourceId] || { width: 180, height: 52 };
                const tDim = nodeDimensions[conn.targetId] || { width: 180, height: 52 };

                return (
                  <Connector 
                    key={idx} 
                    sourceX={sourcePos.x}
                    sourceY={sourcePos.y}
                    targetX={targetPos.x}
                    targetY={targetPos.y}
                    sourceWidth={sDim.width}
                    sourceHeight={sDim.height}
                    targetHeight={tDim.height}
                  />
                );
              })}
            </svg>
          </div>

          <motion.div
            ref={projectHintRef}
            aria-hidden="true"
            className={cn('ui-hint', 'absolute left-0 top-0 z-[60]')}
            style={{
              x: projectHintX,
              y: projectHintY,
              visibility: activeNode && isProjectNode(activeNode.label) && !isPanning ? 'visible' : 'hidden',
            }}
          >
            Click to view
          </motion.div>

          {/* Tooltip UI Overlay - Decoupled from canvas transform */}
          <div className="absolute inset-0 pointer-events-none z-50">
            {activeNode && tooltipPos && (
              <div 
                className="absolute"
                style={{ 
                  left: tooltipPos.x, 
                  top: tooltipPos.y,
                  transform: tooltipPos.side === 'left' ? 'translateX(-100%)' : 'none'
                }}
              >
                {activeNode.label === 'Youqi W.' && (
                  <YouqiTooltip isVisible={true} side={tooltipPos.side} />
                )}
                {activeNode.label === 'Benchling' && (
                  <BenchlingTooltip isVisible={true} side={tooltipPos.side} />
                )}
                {activeNode.label === 'Archived' && (
                  <ArchivedTooltip isVisible={true} side={tooltipPos.side} />
                )}
                {activeNode.label === 'Born!' && (
                  <BornTooltip isVisible={true} side={tooltipPos.side} />
                )}
                {activeNode.label === 'Work' && (
                  <WorkTooltip isVisible={true} side={tooltipPos.side} />
                )}
                {activeNode.label === 'Creative' && (
                  <CreativeTooltip isVisible={true} side={tooltipPos.side} />
                )}
                {(activeNode.label === 'Ragene' || activeNode.label === 'Ragene AI' || activeNode.label === 'Marlo') && (
                  <ProjectTooltip label={activeNode.label} isVisible={true} side={tooltipPos.side} />
                )}
              </div>
            )}
          </div>

          <div
            role="group"
            aria-label="Canvas controls"
            className="canvas-control-surface absolute bottom-3 left-1/2 z-30 flex min-h-[42px] w-max max-w-[calc(100%-8px)] -translate-x-1/2 flex-wrap items-center justify-center gap-0.5 px-1 py-1 text-[#262626] min-[480px]:gap-2 min-[480px]:py-2 min-[480px]:px-2"
          >
            <div role="group" aria-label="Canvas appearance" className="relative z-10 flex min-h-[26px] items-center justify-center rounded-[5px] bg-[#ebebeb] p-0.5 min-[480px]:min-w-[102px] min-[480px]:p-1">
              {(['grid', 'ascii'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={canvasMode === mode}
                  onClick={() => setCanvasMode(mode)}
                  className={cn(
                    "min-h-[18px] flex-auto cursor-pointer rounded-[4px] px-1 leading-none focus-visible:outline-2 focus-visible:outline-offset-1 min-[480px]:px-1.5",
                    canvasMode === mode ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                  )}
                >
                  {mode === 'grid' ? 'Grid' : 'ASCII'}
                </button>
              ))}
            </div>
            <CanvasSettingsPanel
              key={settingsResetCount}
              canvasRef={canvasRef}
              verticalMargin={verticalMargin}
              onVerticalMarginChange={setVerticalMargin}
              horizontalMargin={horizontalMargin}
              onHorizontalMarginChange={setHorizontalMargin}
              typography={typography}
              onTypographyChange={setTypography}
              appearance={canvasMode === 'ascii'
                ? { mode: 'ascii', settings: asciiSettings, onChange: setAsciiSettings }
                : { mode: 'grid', settings: gridSettings, onChange: setGridSettings }}
            />
            <div className="relative z-10 flex items-center gap-0.5 min-[480px]:gap-2">
              <button type="button" aria-label="Zoom out" onClick={zoomOut} className="group/toolbar relative grid size-6 cursor-pointer place-items-center rounded-[5px] hover:bg-[#ebebeb] min-[480px]:size-[26px]">
                <svg width="12" height="2" viewBox="0 0 12 2" fill="none" aria-hidden="true">
                  <path d="M1 1H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <ToolbarTooltip label="Zoom out" />
              </button>
              <span className="min-w-[30px] text-center tabular-nums min-[480px]:min-w-[32px]">
                {Math.round(viewport.scale * 100)}%
              </span>
              <button type="button" aria-label="Zoom in" onClick={zoomIn} className="group/toolbar relative grid size-6 cursor-pointer place-items-center rounded-[5px] hover:bg-[#ebebeb] min-[480px]:size-[26px]">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <ToolbarTooltip label="Zoom in" />
              </button>
            </div>
            <button type="button" aria-label="Reset all" onClick={resetAll}
              className="group/toolbar relative z-10 grid size-6 cursor-pointer place-items-center rounded-[5px] hover:bg-[#ebebeb] min-[480px]:size-[26px]">
              <RotateCcw aria-hidden="true" size={16} strokeWidth={2} />
              <ToolbarTooltip label="Reset all" />
            </button>
            <button
              type="button"
              onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=youqi9793@gmail.com', '_blank')}
              className="relative z-10 grid min-h-[26px] cursor-pointer place-items-center whitespace-nowrap rounded-[6px] bg-[#262626] px-1.5 text-white min-[480px]:ml-2 min-[480px]:min-w-[100px] min-[480px]:px-2 transition-opacity hover:opacity-90"
            >
              Ask to edit
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}