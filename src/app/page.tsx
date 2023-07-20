import Image from "next/image";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { TimeZone } from "@/components/time-zone";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import {
  clientHints,
  getClientHintCookieValue,
  timeZoneCookieName,
} from "@/lib/utils";

// Returns the user's client hint timezone preference
export function getTimeZone(cookies: ReadonlyRequestCookies): string {
  return getClientHintCookieValue(clientHints[timeZoneCookieName], cookies);
}

export default function Home() {
  const cookieStorage = cookies();
  const timeZone = getTimeZone(cookieStorage);
  console.log(timeZone);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <DarkModeToggle />
      </div>
      <TimeZone timeZone={timeZone} />

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
    </main>
  );
}
