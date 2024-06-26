import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return format(date, "LLL dd, y");
}

export function capitalizer(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
