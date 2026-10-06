import { useEffect, useRef } from "react";
import { TERMINAL_RESIZE_PAGE, TERMINAL_RESIZE_STEP } from "./terminalResize";

const focus =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn";

export function TerminalResizeHandle({
  height,
  min,
  max,
  onResize,
}: {
  height: number;
  min: number;
  max: number;
  onResize: (height: number) => void;
}) {
  const drag = useRef<{ pointerId: number; stop: () => void } | null>(null);

  function endDrag(pointerId: number) {
    if (drag.current?.pointerId !== pointerId) {
      return;
    }
    drag.current.stop();
    drag.current = null;
    document.documentElement.style.removeProperty("cursor");
    document.documentElement.style.removeProperty("user-select");
  }

  useEffect(() => {
    return () => {
      drag.current?.stop();
      document.documentElement.style.removeProperty("cursor");
      document.documentElement.style.removeProperty("user-select");
    };
  }, []);

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize terminal"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={height}
      tabIndex={0}
      className={`group absolute inset-x-0 top-0 z-10 hidden h-4 -translate-y-1/2 cursor-ns-resize touch-none md:block ${focus}`}
      onPointerDown={(event) => {
        if (event.button !== 0 || drag.current) {
          return;
        }
        event.preventDefault();
        const pointerId = event.pointerId;
        const startY = event.clientY;
        const startHeight = height;
        const node = event.currentTarget;
        const move = (pointer: PointerEvent) => {
          if (pointer.pointerId !== pointerId) {
            return;
          }
          pointer.preventDefault();
          onResize(startHeight + (startY - pointer.clientY));
        };
        const stop = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", release);
          window.removeEventListener("pointercancel", release);
          if (node.hasPointerCapture(pointerId)) {
            node.releasePointerCapture(pointerId);
          }
        };
        const release = (pointer: PointerEvent) => {
          if (pointer.pointerId !== pointerId) {
            return;
          }
          endDrag(pointerId);
        };
        drag.current = { pointerId, stop };
        document.documentElement.style.cursor = "ns-resize";
        document.documentElement.style.userSelect = "none";
        window.addEventListener("pointermove", move, { passive: false });
        window.addEventListener("pointerup", release);
        window.addEventListener("pointercancel", release);
        try {
          node.setPointerCapture(pointerId);
        } catch {
          // Pointer capture is unavailable for this event.
        }
      }}
      onKeyDown={(event) => {
        const page = event.key === "PageUp" || event.key === "PageDown";
        const step = page ? TERMINAL_RESIZE_PAGE : TERMINAL_RESIZE_STEP;
        if (event.key === "ArrowUp" || event.key === "PageUp") {
          event.preventDefault();
          onResize(height + step);
        }
        if (event.key === "ArrowDown" || event.key === "PageDown") {
          event.preventDefault();
          onResize(height - step);
        }
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-boot-line group-hover:bg-boot-dim group-focus-visible:bg-boot-warn"
      />
    </div>
  );
}
