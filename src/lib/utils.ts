import { type ClassValue, clsx } from "clsx";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ClientHint {
  cookieName: string;
  getValueCode: string;
  fallbackValue: string;
  getTransformedValue?: (value: string) => string;
}

export interface ClientHints {
  [key: string]: ClientHint;
}

export const themeCookieName = "theme";
export const timeZoneCookieName = "timeZone";

export const clientHints: ClientHints = {
  // Key here is used as name for server-side cookies.
  [themeCookieName]: {
    cookieName: "CH-prefers-color-scheme",
    getValueCode: `window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'`,
    fallbackValue: "light",
    getTransformedValue: (value: string) => {
      return value === "dark" ? "dark" : "light";
    },
  },
  [timeZoneCookieName]: {
    cookieName: "CH-time-zone",
    getValueCode: `Intl.DateTimeFormat().resolvedOptions().timeZone`,
    fallbackValue: "UTC",
  },
};

export function getClientHintCookieValue(
  clientHint: ClientHint,
  cookies: ReadonlyRequestCookies
) {
  const { cookieName, getTransformedValue, fallbackValue } = clientHint;
  console.log(cookieName, cookies.get(cookieName)?.value);
  // If cookie value doesnt exist then fetch from fallback.
  const clientHintValue = cookies.get(cookieName)?.value ?? fallbackValue;
  const decodedClientHintValue = decodeURIComponent(clientHintValue);
  const clientHintCookieValue =
    getTransformedValue?.(decodedClientHintValue) ?? decodedClientHintValue;

  return clientHintCookieValue;
}
