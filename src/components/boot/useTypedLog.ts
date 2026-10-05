"use client";

import { useEffect, useRef, useState } from "react";
import {
  createTypewriterState,
  isTypewriterDone,
  revealedText,
  stepTypewriter,
  TYPING_INTERVAL_MS,
} from "@/lib/boot/typewriter";
import type { LogLine } from "@/lib/boot/types";

export type TypedLogLine = LogLine & {
  shown: string;
  cursor: boolean;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return reduced;
}

export function useTypedLog(lines: LogLine[]) {
  const reduced = usePrefersReducedMotion();
  const [state, setState] = useState(createTypewriterState);
  const linesRef = useRef(lines);

  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  useEffect(() => {
    if (reduced) {
      return;
    }

    const id = window.setInterval(() => {
      setState((current) => stepTypewriter(current, linesRef.current));
    }, TYPING_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [reduced]);

  const typed = lines.flatMap((line, index) => {
    const shown = revealedText(line, index, state, reduced);
    if (shown === null) {
      return [];
    }

    if (line.kind === "rule") {
      return [{ ...line, shown: "", cursor: false }];
    }

    const cursor = reduced ? index === lines.length - 1 : index === state.index;

    return [{ ...line, shown, cursor }];
  });

  return {
    lines: typed,
    done: reduced || isTypewriterDone(state, lines),
  };
}
