const MIN_HEIGHT = 160;
const MAX_RATIO = 0.7;

export const TERMINAL_DEFAULT_HEIGHT = 256;
export const TERMINAL_RESIZE_STEP = 16;
export const TERMINAL_RESIZE_PAGE = 64;

export function terminalHeightLimits(workspaceHeight: number) {
  const max = Math.max(0, Math.floor(workspaceHeight * MAX_RATIO));
  const min = Math.min(MIN_HEIGHT, max);
  return { min, max };
}

export function clampTerminalHeight(height: number, workspaceHeight: number) {
  const { min, max } = terminalHeightLimits(workspaceHeight);
  return Math.min(max, Math.max(min, height));
}
