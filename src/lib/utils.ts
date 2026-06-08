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
