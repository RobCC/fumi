import type { Theme } from "../types";

export const THEMES: Theme[] = ["dark", "light"];

export function nextTheme(current: Theme): Theme {
  const idx = THEMES.indexOf(current);
  return THEMES[(idx + 1) % THEMES.length];
}
