import type { PublicRepo } from "./githubTypes";

export function parsePublicRepos(payload: unknown): PublicRepo[] | null {
  if (!Array.isArray(payload)) {
    return null;
  }

  return payload.flatMap((item): PublicRepo[] => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const record = item as Record<string, unknown>;
    if (record.fork === true || typeof record.name !== "string" || typeof record.html_url !== "string") {
      return [];
    }

    return [
      {
        id: typeof record.id === "number" ? record.id : 0,
        name: record.name,
        description: typeof record.description === "string" ? record.description : null,
        language: typeof record.language === "string" ? record.language : null,
        url: record.html_url,
        updated: typeof record.updated_at === "string" ? record.updated_at.slice(0, 10) : "",
      },
    ];
  });
}
