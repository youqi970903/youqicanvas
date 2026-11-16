// Keep the trail renderer's calibration independent of the selected defaults.
export const GRID_TRAIL_REFERENCE = {
  radius: 100,
  strength: 55,
  trailColor: '#5f8bff',
  trailCoolingColor: '#5fc0ff',
};

export const DEFAULT_GRID_SETTINGS = {
  cellSize: 32,
  lineWidth: 0.5,
  backgroundColor: '#fafafa',
  lineColor: '#f0f0f0',
  radius: 150,
  strength: 100,
  useMulticolor: true,
  trailColor: '#d6e1ff',
  trailCoolingColor: '#e5f5ff',
  fadeMs: 2150,
  fadeCurve: 1,
};

export type GridSettings = typeof DEFAULT_GRID_SETTINGS;
