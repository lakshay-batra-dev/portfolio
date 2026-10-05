import { openingDiagnostics } from "../../data/diagnostics";
import { experience } from "../../data/experience";
import { profile } from "../../data/profile";
import { projects } from "../../data/projects";
import type { BootCompletion, DiagnosticCheck } from "./types";

export function initializeKernel() {
  return {
    name: "portfolio",
    ready: true as const,
    bootedAt: Date.now(),
  };
}

export function loadProjectRegistry() {
  if (!Array.isArray(projects)) {
    throw new Error("Project registry is not a list");
  }

  return {
    count: projects.length,
    source: "local" as const,
    projects,
  };
}

export function loadProfile() {
  if (!profile.name || !profile.role) {
    throw new Error("Profile is incomplete");
  }

  return profile;
}

export function loadExperienceModule() {
  if (!Array.isArray(experience)) {
    throw new Error("Experience module failed to load");
  }

  return {
    ready: true as const,
    count: experience.length,
  };
}

export function initializeDiagnosticEngine() {
  if (!Number.isFinite(openingDiagnostics.anomalyCount) || openingDiagnostics.anomalyCount < 0) {
    throw new Error("Diagnostic configuration is invalid");
  }

  return openingDiagnostics;
}

/** Local only. GitHub is intentionally not contacted during boot. */
export function prepareRepositoryLayer() {
  return {
    mode: "offline" as const,
    ready: true as const,
  };
}

export function checkCaffeine() {
  return { acceptable: true as const };
}

export function negotiateWithCpu() {
  const cores = typeof navigator === "undefined" ? 1 : navigator.hardwareConcurrency || 1;
  return { cores, agreed: cores > 0 };
}

export function searchForSemicolons() {
  return { missing: 0 as const };
}

export function formatAnomalyCount(count: number) {
  return count === 1 ? "1 anomaly detected" : `${count} anomalies detected`;
}

export function prepareApplicationState() {
  const loadedProfile = loadProfile();
  const registry = loadProjectRegistry();
  const diagnostics = initializeDiagnosticEngine();
  const repository = prepareRepositoryLayer();

  return {
    profileLoaded: loadedProfile.name.length > 0,
    projectCount: registry.count,
    repositoryMode: repository.mode,
    diagnosticsReady: diagnostics.anomalyCount >= 0,
  };
}

export function runSystemDiagnostics(): BootCompletion["diagnostics"] {
  const registry = loadProjectRegistry();
  const experienceModule = loadExperienceModule();
  const repository = prepareRepositoryLayer();

  const liveStatus = {
    projects: registry.source === "local" ? "success" : "warning",
    experience: experienceModule.ready ? "success" : "warning",
    repository: repository.ready ? "success" : "warning",
    integrity: "warning",
  } as const satisfies Record<(typeof openingDiagnostics.checks)[number]["id"], DiagnosticCheck["status"]>;

  const checks: DiagnosticCheck[] = openingDiagnostics.checks.map((check) => ({
    id: check.id,
    label: check.label,
    status: liveStatus[check.id],
  }));

  return {
    anomalyCount: openingDiagnostics.anomalyCount,
    integrity: openingDiagnostics.integrity,
    checks,
  };
}

export function fallbackCompletion(): BootCompletion {
  return {
    status: "complete",
    diagnostics: {
      anomalyCount: openingDiagnostics.anomalyCount,
      integrity: openingDiagnostics.integrity,
      checks: openingDiagnostics.checks.map((check) => ({
        id: check.id,
        label: check.label,
        status: check.status,
      })),
    },
    tasks: {},
  };
}
