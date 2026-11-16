import { useState } from 'react';
import GlowCursor from './GlowCursor';
import { CloudTrail } from './CloudTrail';
import { GRID_TRAIL_REFERENCE, type GridSettings } from './gridSettings';

export function GridCursor({ settings }: { settings: GridSettings }) {
  const [unsupported, setUnsupported] = useState(false);

  if (settings.strength === 0) return null;
  if (unsupported) return <CloudTrail settings={settings} />;

  return (
    <GlowCursor
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      color={settings.trailColor}
      secondaryColor={settings.useMulticolor ? settings.trailCoolingColor : settings.trailColor}
      intensity={3 * settings.strength / GRID_TRAIL_REFERENCE.strength}
      trailWidth={6.5 * settings.radius / GRID_TRAIL_REFERENCE.radius}
      linger={settings.fadeMs / (1000 * Math.sqrt(settings.fadeCurve))}
      glow={0.95}
      hotspot={1.65}
      followSpeed={0.6}
      grain={0.17}
      clickBurst
      enabled
      quality="high"
      theme="dark"
      blendMode="normal"
      onUnsupported={() => setUnsupported(true)}
    />
  );
}
