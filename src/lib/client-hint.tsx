"use client";

import React, { useTransition } from "react";
import { clientHints } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function ClientHintCheck() {
  const nonce = useNonce();
  const router = useRouter();
  const [, startTransition] = useTransition();

  React.useEffect(() => {
    const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    function handleThemeChange() {
      document.cookie = `${clientHints.theme.cookieName}=${
        themeQuery.matches ? "dark" : "light"
      }`;
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
      });
    }
    themeQuery.addEventListener("change", handleThemeChange);
    return () => {
      themeQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  return (
    <script
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: `
const cookies = document.cookie.split(';').map(c => c.trim()).reduce((acc, cur) => {
	const [key, value] = cur.split('=');
	acc[key] = value;
	return acc;
}, {});
let cookieChanged = false;
const hints = [
${Object.values(clientHints)
  .map((hint) => {
    const cookieName = JSON.stringify(hint.cookieName);
    return `{ name: ${cookieName}, actual: String(${hint.getValueCode}), cookie: cookies[${cookieName}] }`;
  })
  .join(",\n")}
];
console.log(hints);
for (const hint of hints) {
	if (decodeURIComponent(hint.cookie) !== hint.actual) {
		cookieChanged = true;
		document.cookie = encodeURIComponent(hint.name) + '=' + encodeURIComponent(hint.actual) + ';path=/';
	}
}
if (cookieChanged && navigator.cookieEnabled) {
  console.log('Reloaded the app to set client hints');
	window.location.reload();
}
			`,
      }}
    />
  );
}

// Use nonce for the script tag
export const NonceContext = React.createContext<string>("");
export const NonceProvider = NonceContext.Provider;
export const useNonce = () => React.useContext(NonceContext);
