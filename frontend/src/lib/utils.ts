import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function equalObjects<T extends Record<string, unknown>>(obj1: T, obj2: T) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function truncate(str: string, maxLen: number) {
  return str.length > maxLen ? `${str.slice(0, maxLen - 1)}...` : str;
}

export function objectToFormData(
  obj: Record<string, unknown>,
  form?: FormData,
  namespace?: string
): FormData {
  const formData = form || new FormData();

  for (const property in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, property)) {
      const formKey = namespace ? `${namespace}[${property}]` : property;

      if (typeof obj[property] === "object" && !(obj[property] instanceof File)) {
        objectToFormData(obj[property] as Record<string, unknown>, formData, formKey);
      } else {
        formData.append(formKey, obj[property] as string);
      }
    }
  }

  return formData;
}
