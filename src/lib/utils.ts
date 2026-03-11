// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyCodes(codes: string[]): string {
  return codes?.join(", ") || "N/A";
}

export function formatCallingCode(code: string): string {
  return code ? `+${code}` : "N/A";
}