import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCategoryLabel(category?: string) {
  if (!category) return "";

  return category
    .replace(/^[^\p{L}\p{N}]+/u, "")
    .replace(/\bdiaries\b/i, "Notes")
    .trim();
}

/** Curated posts (e.g. X digests) summarize other people's ideas, not original essays. */
export function isEducationPost(category?: string) {
  return !!category && /education|digest/i.test(category);
}

/** Lowercase label shown in the mono meta line on cards and post headers. */
export function metaLabel(category?: string) {
  return isEducationPost(category) ? "education" : "agentic diaries";
}
