/**
 * Opening diagnostic scenario. These figures are the scripted bridge into
 * the debugger. They are not measurements of Lakshay's work.
 */
export const openingDiagnostics = {
  anomalyCount: 1,
  integrity: 87,
  checks: [
    { id: "projects", label: "Projects", status: "success" },
    { id: "experience", label: "Experience", status: "success" },
    { id: "repository", label: "Repository", status: "success" },
    { id: "integrity", label: "Diagnostic integrity", status: "warning" },
  ],
} as const;
