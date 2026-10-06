import type { PinnedRepo } from "./githubTypes";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function textContent(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function parsePinnedProfile(html: string, handle: string): PinnedRepo[] | null {
  if (typeof html !== "string" || typeof handle !== "string" || handle.length === 0) {
    return null;
  }

  const marker = html.indexOf("js-pinned-items-reorder-list");
  if (marker === -1) {
    return null;
  }

  const listEnd = html.indexOf("</ol>", marker);
  if (listEnd === -1) {
    return null;
  }

  const list = html.slice(marker, listEnd);
  const items = list.split("js-pinned-item-list-item").slice(1);
  if (items.length === 0) {
    return [];
  }

  const hrefPattern = new RegExp(`href="(?:https://github.com)?/${escapeRegExp(handle)}/([^"#?/]+)"`);
  const repos = items.flatMap((item): PinnedRepo[] => {
    const href = item.match(hrefPattern);
    const label = textContent(item.match(/class="repo"[^>]*>([^<]*)/)?.[1] ?? "");
    if (!href || !label) {
      return [];
    }

    const name = href[1];

    const description = textContent(item.match(/pinned-item-desc[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? "");
    const language = textContent(item.match(/itemprop="programmingLanguage"[^>]*>([^<]*)/)?.[1] ?? "");

    return [
      {
        name,
        description: description || null,
        language: language || null,
        url: `https://github.com/${handle}/${name}`,
        updated: "",
      },
    ];
  });

  return repos.length > 0 ? repos : null;
}

export function parsePinnedPayload(payload: unknown): PinnedRepo[] | null {
  if (!Array.isArray(payload)) {
    return null;
  }

  const repos: PinnedRepo[] = [];
  for (const item of payload) {
    if (!item || typeof item !== "object") {
      return null;
    }

    const record = item as Record<string, unknown>;
    if (typeof record.name !== "string" || typeof record.url !== "string" || !record.url.startsWith("https://github.com/")) {
      return null;
    }

    repos.push({
      name: record.name,
      description: typeof record.description === "string" && record.description ? record.description : null,
      language: typeof record.language === "string" && record.language ? record.language : null,
      url: record.url,
      updated: typeof record.updated === "string" ? record.updated : "",
    });
  }

  return repos;
}
