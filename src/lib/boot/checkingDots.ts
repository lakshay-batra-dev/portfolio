export const CHECKING_DOT_MS = 400;

/** Two cycles of `.` `..` `...`, then a final `...` to stop on. */
export const CHECKING_DOTS = [".", "..", "...", ".", "..", "...", "..."] as const;

export function checkingLabel(frame: number) {
  const index = Math.min(Math.max(frame, 0), CHECKING_DOTS.length - 1);
  return `Checking${CHECKING_DOTS[index]}`;
}

export function checkingDotsDone(frame: number) {
  return frame >= CHECKING_DOTS.length - 1;
}
