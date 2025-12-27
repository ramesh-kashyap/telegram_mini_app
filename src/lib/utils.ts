import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function compactNumber(num: number) {
  // round to 2 decimals safely
  const rounded = Math.round(num * 100) / 100;

  // format with compact notation
  return rounded.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    notation: "compact",
  });
}