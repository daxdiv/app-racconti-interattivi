import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function equalObjects(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>
) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function truncate(str: string, maxLen: number) {
  return str.length > maxLen ? `${str.slice(0, maxLen - 1)}...` : str;
}
