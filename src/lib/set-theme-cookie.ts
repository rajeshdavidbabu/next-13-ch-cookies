"use server";

import { cookies } from "next/headers";
import { themeCookieName } from "./utils";

type Theme = "light" | "dark" | undefined;

// Cookie value set and accessed by the server
export async function setTheme(theme?: Theme) {
  cookies().set({
    name: themeCookieName,
    value: theme ?? "",
    path: "/",
    httpOnly: true,
  });
}
