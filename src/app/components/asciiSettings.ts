export const DEFAULT_ASCII_SETTINGS = {
  cellSize: 10,
  fontSize: 10,
  font: "'Courier New', monospace",
  pattern: ".+..:.x.\nWelcome:)\nHiiiii'm Youqi!\n..:-...:",
  backgroundColor: "#f7f7f7",
  characterColor: "#f2f2f2",
  radius: 140,
  trailColor: "#00ffe1",
  strength: 100,
  fadeMs: 1800,
  fadeCurve: 1.5,
  trailCharacters: "✮ type anything for fun ✮",
};

export type AsciiSettings = typeof DEFAULT_ASCII_SETTINGS;
