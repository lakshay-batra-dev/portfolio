"use client";

import { RecoveryNotice } from "@/components/system/RecoveryNotice";

const focus =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn";

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <RecoveryNotice
      code="ERROR"
      title="Something went wrong"
      detail="This view could not be displayed."
      action={
        <button type="button" onClick={() => retry()} className={`border border-boot-line px-3 py-2 font-mono text-[12px] tracking-[0.12em] text-boot-text ${focus}`}>
          TRY AGAIN
        </button>
      }
    />
  );
}
