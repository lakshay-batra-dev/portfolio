export const TYPING_INTERVAL_MS = 12;

export type TypewriterLine = {
  kind: string;
  text: string;
};

export type TypewriterState = {
  index: number;
  chars: number;
};

export function createTypewriterState(): TypewriterState {
  return { index: 0, chars: 0 };
}

export function typewriterLength(line: TypewriterLine) {
  return line.kind === "rule" ? 0 : line.text.length;
}

export function stepTypewriter(state: TypewriterState, lines: TypewriterLine[]): TypewriterState {
  if (lines.length === 0) {
    return state;
  }

  const index = Math.min(state.index, lines.length - 1);
  const length = typewriterLength(lines[index]);
  const chars = Math.min(state.chars, length);

  if (chars < length) {
    return { index, chars: chars + 1 };
  }

  if (index < lines.length - 1) {
    return { index: index + 1, chars: 0 };
  }

  if (index === state.index && chars === state.chars) {
    return state;
  }

  return { index, chars };
}

export function isTypewriterDone(state: TypewriterState, lines: TypewriterLine[]) {
  if (lines.length === 0) {
    return false;
  }

  const last = lines.length - 1;
  return state.index === last && state.chars >= typewriterLength(lines[last]);
}

export function revealedText(line: TypewriterLine, index: number, state: TypewriterState, showFull: boolean) {
  if (showFull) {
    return line.text;
  }

  if (index < state.index) {
    return line.text;
  }

  if (index > state.index) {
    return null;
  }

  return line.text.slice(0, state.chars);
}
