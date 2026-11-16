export const PAGE_FONTS = {
  'Fira Code': '"Fira Code", monospace',
  Menlo: 'Menlo, monospace',
  'System Sans': 'system-ui, sans-serif',
  'Libre Baskerville': '"Libre Baskerville", Georgia, serif',
};

export type TypographySettings = {
  font: keyof typeof PAGE_FONTS;
  fontSize: number;
  weight: number;
  spacing: number;
};

export const DEFAULT_TYPOGRAPHY: TypographySettings = {
  font: 'System Sans',
  fontSize: 14,
  weight: 400,
  spacing: 0,
};
