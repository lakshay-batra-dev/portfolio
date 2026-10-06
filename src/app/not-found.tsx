import { RecoveryNotice } from "@/components/system/RecoveryNotice";

export default function NotFound() {
  return (
    <RecoveryNotice
      code="404"
      title="Page not found"
      detail={"$ cd /requested-page\ncd: no such file or directory"}
    />
  );
}
