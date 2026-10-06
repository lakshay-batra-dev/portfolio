"use client";

import { useEffect, useRef, useState } from "react";
import { checkingDotsDone, checkingLabel, CHECKING_DOT_MS } from "@/lib/boot/checkingDots";
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

function partitionChecking(lines: LogLine[]) {
  const start = lines.findIndex((line) => line.text === "Checking...");
  if (start < 0) {
    return { before: lines, checking: null, after: [] as LogLine[] };
  }

  let end = start;
  while (end + 1 < lines.length && lines[end + 1]?.text === "Checking...") {
    end += 1;
  }

  return {
    before: lines.slice(0, start),
    checking: lines[start],
    after: lines.slice(end + 1),
  };
}

export function useTypedLog(lines: LogLine[]) {
  const reduced = usePrefersReducedMotion();
  const { before, checking, after } = partitionChecking(lines);
  const [beforeState, setBeforeState] = useState(createTypewriterState);
  const [afterState, setAfterState] = useState(createTypewriterState);
  const [dotFrame, setDotFrame] = useState(0);
  const beforeRef = useRef(before);
  const afterRef = useRef(after);
  const afterReadyRef = useRef(false);

  const beforeDone = reduced || before.length === 0 || isTypewriterDone(beforeState, before);
  const dotsFinished = !checking || reduced || (beforeDone && checkingDotsDone(dotFrame));
  const afterReady = dotsFinished && !reduced;

  useEffect(() => {
    beforeRef.current = before;
    afterRef.current = after;
    afterReadyRef.current = afterReady;
  }, [after, afterReady, before]);

  useEffect(() => {
    if (reduced) {
      return;
    }

    const id = window.setInterval(() => {
      setBeforeState((current) => stepTypewriter(current, beforeRef.current));
      setAfterState((current) => {
        if (!afterReadyRef.current) {
          return current;
        }
        return stepTypewriter(current, afterRef.current);
      });
    }, TYPING_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced || !checking || !beforeDone || checkingDotsDone(dotFrame)) {
      return;
    }

    const id = window.setTimeout(() => setDotFrame((frame) => frame + 1), CHECKING_DOT_MS);
    return () => window.clearTimeout(id);
  }, [beforeDone, checking, dotFrame, reduced]);

  const beforeLines = before.flatMap((line, index) => {
    const shown = revealedText(line, index, beforeState, reduced);
    if (shown === null) {
      return [];
    }
    if (line.kind === "rule") {
      return [{ ...line, shown: "", cursor: false }];
    }
    const cursor = !reduced && !beforeDone && index === beforeState.index;
    return [{ ...line, shown, cursor }];
  });

  const checkingLine: TypedLogLine[] =
    checking && beforeDone
      ? [
          {
            ...checking,
            shown: reduced ? "Checking..." : checkingLabel(dotFrame),
            cursor: !reduced && !dotsFinished,
          },
        ]
      : [];

  const afterLines = dotsFinished
    ? after.flatMap((line, index) => {
        const shown = revealedText(line, index, afterState, reduced);
        if (shown === null) {
          return [];
        }
        if (line.kind === "rule") {
          return [{ ...line, shown: "", cursor: false }];
        }
        const cursor = reduced ? index === after.length - 1 && beforeDone : index === afterState.index;
        return [{ ...line, shown, cursor }];
      })
    : [];

  const typed = [...beforeLines, ...checkingLine, ...afterLines].map((line, index, all) =>
    reduced ? { ...line, cursor: index === all.length - 1 } : line,
  );
  const afterDone = after.length === 0 || isTypewriterDone(afterState, after);
  const done = lines.length > 0 && (reduced || (beforeDone && dotsFinished && afterDone));

  return { lines: typed, done };
}
