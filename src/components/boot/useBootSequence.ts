"use client";

import { useEffect, useState } from "react";
import { fallbackCompletion } from "@/lib/boot/initialize";
import { createInitialSnapshot, runBoot } from "@/lib/boot/runBoot";
import { bootTasks } from "@/lib/boot/tasks";
import type { BootSnapshot } from "@/lib/boot/types";
import { BootAbortedError } from "@/lib/boot/types";

export function useBootSequence() {
  const [snapshot, setSnapshot] = useState<BootSnapshot>(createInitialSnapshot);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    runBoot(bootTasks, {
      signal: controller.signal,
      onSnapshot: (next) => {
        if (!cancelled) {
          setSnapshot(next);
        }
      },
    }).catch((error: unknown) => {
      if (cancelled || error instanceof BootAbortedError) {
        return;
      }

      const completion = fallbackCompletion();
      setSnapshot({
        phase: "BOOT_COMPLETE",
        lines: [
          {
            id: "diagnostic-investigation",
            kind: "banner",
            text: "INVESTIGATION REQUIRED",
            status: "warning",
            elapsedMs: 0,
          },
        ],
        cursorLineId: "diagnostic-investigation",
        activeTaskId: null,
        completed: {},
        completion,
      });
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return snapshot;
}
