import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { NodeCard } from './components/NodeCard';
import { Connector } from './components/Connector';
import { CloudTrail } from './components/CloudTrail';
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

const INITIAL_NODES: NodeData[] = [
  { id: 'born', type: NODE_TYPES.START, label: 'Born!', icon: '👼', position: { x: 50, y: 480 } },
  { id: 'youqi', type: NODE_TYPES.ROLE, label: 'Youqi W.', icon: '👧', position: { x: 320, y: 515 } },
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
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 0.86 });
  const [isPanning, setIsPanning] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Center nodes on initial load
  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const scale = 0.86;
      
      // Calculate bounding box of initial nodes
      const minX = Math.min(...INITIAL_NODES.map(n => n.position.x));
      const maxX = Math.max(...INITIAL_NODES.map(n => n.position.x + 200)); // Approx width
      const minY = Math.min(...INITIAL_NODES.map(n => n.position.y));
      const maxY = Math.max(...INITIAL_NODES.map(n => n.position.y + 100)); // Approx height

      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;
      
      const centerX = minX + contentWidth / 2;
      const centerY = minY + contentHeight / 2;

      // Calculate the offset to center the nodes in the viewport
      const x = rect.width / 2 - centerX * scale;
      const y = rect.height / 2 - centerY * scale;

      setViewport({ x, y, scale });
    }
  }, []);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    // If we click anything that isn't a node or interactive element, start panning
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('.node-card') || target.closest('button');
    
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
  const resetZoom = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const scale = 0.86;
      const minX = Math.min(...INITIAL_NODES.map(n => n.position.x));
      const maxX = Math.max(...INITIAL_NODES.map(n => n.position.x + 200));
      const minY = Math.min(...INITIAL_NODES.map(n => n.position.y));
      const maxY = Math.max(...INITIAL_NODES.map(n => n.position.y + 100));
      const centerX = minX + (maxX - minX) / 2;
      const centerY = minY + (maxY - minY) / 2;
      const x = rect.width / 2 - centerX * scale;
      const y = rect.height / 2 - centerY * scale;
      setViewport({ x, y, scale });

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
    }
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
    <div className="flex h-screen w-full bg-white overflow-hidden select-none">
      <AnimatePresence initial={false}>
        {isSidebarVisible && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="overflow-hidden flex-shrink-0"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main 
        layout
        className={cn(
          "flex-1 relative overflow-hidden flex items-center justify-center py-[24px] pr-[24px] z-10",
          isSidebarVisible ? "pl-0" : "pl-[24px]"
        )}
      >
        {/* Canvas Container */}
        <motion.div 
          layout
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          className="w-full h-full bg-white rounded-[24px] shadow-[0px_2px_18px_0px_rgba(0,0,0,0.04)] relative overflow-hidden border border-[#e2e4ec]"
          style={{ 
            cursor: isPanning ? 'grabbing' : 'grab',
          }}
        >
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
                linear-gradient(to right, #ededed 1px, transparent 1px),
                linear-gradient(to bottom, #ededed 1px, transparent 1px)
              `,
              backgroundSize: `${36 * viewport.scale}px ${36 * viewport.scale}px`,
              backgroundPosition: `${viewport.x}px ${viewport.y}px`,
              backgroundColor: '#F7F7F7',
            }}
          />

          {/* Cursor Cloud Trail - Positioned behind nodes but on the canvas */}
          <CloudTrail />

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

          {/* Overlays */}
          {/* Top Left Title Bar */}
          <div className="absolute top-[16px] left-[16px] bg-[rgba(255,255,255,0.8)] h-[42px] px-[12px] flex items-center gap-[8px] rounded-[12px] shadow-[0px_2px_18px_0px_rgba(0,0,0,0.04)] backdrop-blur-sm z-30">
            <span className="text-[28px] leading-none mt-[-4px]">👋</span>
            <h1 className="text-[24px] italic text-[#262626] tracking-[-1.12px] font-['Libre_Baskerville']">
              youqi’s portfolio canvas
            </h1>
            <div className="w-[1px] h-[13px] bg-[#E2E4EC] mx-[8px]" />
            <div className="flex items-center gap-[6px]">
              <svg className="size-[20px]" fill="none" viewBox="0 0 20 20">
                 <path d="M10.001 3.3315C7.53512 3.3315 5.45762 4.54316 3.75095 6.53483C3.16679 7.21566 2.65595 7.94317 2.24012 8.66983C1.98928 9.10983 1.83595 9.44982 1.74595 9.65982C1.65595 9.86899 1.65595 10.1273 1.74595 10.3365C1.83595 10.5465 1.98928 10.8865 2.24012 11.3265C2.65595 12.0531 3.16679 12.7807 3.75095 13.4615C5.45762 15.4532 7.53512 16.6648 10.001 16.6648C12.4668 16.6648 14.5443 15.4532 16.251 13.4615C16.8343 12.7807 17.346 12.0531 17.761 11.3265C18.0126 10.8865 18.166 10.5465 18.256 10.3365C18.346 10.1273 18.346 10.1273 18.256 9.65982" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" />
                 <circle cx="10" cy="10" r="3" stroke="#262626" strokeWidth="1.5" />
              </svg>
              <span className="text-[14px] text-[#262626] font-['Fira_Code'] tracking-[-0.56px]">View only</span>
            </div>
          </div>

          {/* Top Right Links Bar */}
          <div className="absolute top-[16px] right-[16px] bg-[rgba(255,255,255,0.8)] h-[42px] px-[16px] flex items-center gap-[12px] rounded-[12px] shadow-[0px_2px_18px_0px_rgba(0,0,0,0.04)] backdrop-blur-sm z-30">
            <button 
              onClick={() => window.open('https://drive.google.com/file/d/1LiZJ8TkkyEsqIbZwW7UKxq1xcdb1xKNJ/view?usp=sharing', '_blank')}
              className="text-[14px] text-[#262626] font-['Fira_Code'] tracking-[-0.56px] hover:underline cursor-pointer"
            >
              Resume
            </button>
            <div className="w-[1px] h-[13px] bg-[#E2E4EC]" />
            <button 
              onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=youqi9793@gmail.com', '_blank')}
              className="text-[14px] text-[#262626] font-['Fira_Code'] tracking-[-0.56px] hover:underline cursor-pointer"
            >
              Email
            </button>
            <div className="w-[1px] h-[13px] bg-[#E2E4EC]" />
            <button 
              onClick={() => window.open('https://www.linkedin.com/in/youqi-w-1b8105233', '_blank')}
              className="text-[14px] text-[#262626] font-['Fira_Code'] tracking-[-0.56px] hover:underline cursor-pointer"
            >
              LinkedIn
            </button>
          </div>

          {/* Bottom Zoom Controls */}
          <div className="absolute bottom-[16px] left-1/2 -translate-x-1/2 bg-[rgba(255,255,255,0.8)] h-[42px] px-[16px] flex items-center gap-[12px] rounded-[12px] shadow-[0px_2px_18px_0px_rgba(0,0,0,0.04)] backdrop-blur-sm z-30">
            <button
              onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              className={cn(
                "size-[16px] hover:opacity-70 transition-opacity cursor-pointer",
                !isSidebarVisible && "opacity-50"
              )}
            >
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M15.2 0H0.8C0.358 0 0 0.358 0 0.8V15.2C0 15.642 0.358 16 0.8 16H15.2C15.642 16 16 15.642 16 15.2V0.8C16 0.358 15.642 0 15.2 0ZM4.8 14.4H1.6V1.6H4.8V14.4ZM14.4 14.4H6.4V1.6H14.4V14.4Z" fill="#262626" />
              </svg>
            </button>
            <div className="w-[1px] h-[13px] bg-[#E2E4EC]" />
            <div className="flex items-center gap-[12px]">
              <button onClick={zoomOut} className="size-[20px] flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer">
                <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
                  <path d="M1 1H11" stroke="#262626" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <span className="text-[14px] text-[#262626] font-['Fira_Code'] tracking-[-0.56px] min-w-[35px] text-center">
                {Math.round(viewport.scale * 100)}%
              </span>
              <button onClick={zoomIn} className="size-[20px] flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1V11M1 6H11" stroke="#262626" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="w-[1px] h-[13px] bg-[#E2E4EC]" />
            <button onClick={resetZoom} className="text-[14px] text-[#262626] font-['Fira_Code'] tracking-[-0.56px] hover:underline cursor-pointer">
              Reset
            </button>
            <div className="w-[1px] h-[13px] bg-[#E2E4EC]" />
            <button
              onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=youqi9793@gmail.com', '_blank')}
              className="bg-[#262626] text-white text-[14px] px-[8px] py-[4px] rounded-[6px] font-['Fira_Code'] tracking-[-0.56px] hover:opacity-90 transition-opacity cursor-pointer"
            >
              Ask to edit
            </button>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}