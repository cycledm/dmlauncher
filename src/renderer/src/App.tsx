import React from "react";
import { clsx } from "clsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import i18next from "i18next";
import rtb from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import { TitleBar } from "@renderer/components";
import { SideBar } from "@renderer/components";
import icon from "@renderer/assets/electron.svg";

const supported = await window.api.i18n.loadSupported();
await i18next
  .use(initReactI18next)
  .use(rtb((lng: string, ns: string) => window.api.i18n.loadResource(lng, ns)))
  .init({
    debug: import.meta.env.DEV,
    lng: supported.languages[0],
    fallbackLng: supported.languages,
    supportedLngs: supported.languages,
    ns: supported.namespaces,
    defaultNS: "common",
    load: "currentOnly",
  });

const appLocale = await window.api.i18n.getAppLocale();
await i18next.changeLanguage(appLocale);

// const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
// await sleep(10000);

const queryClient = new QueryClient();

export default function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={clsx(
          "h-dvh max-h-dvh w-dvw max-w-dvw",
          "bg-white text-black dark:bg-gray-950 dark:text-white",
          "grid grid-rows-[var(--titlebar-h)_1fr]",
          "transition-colors duration-[50ms]",
        )}
      >
        {/* 窗口标题栏 */}
        <TitleBar icon={icon} />
        <div className={clsx("relative size-full overflow-hidden")}>
          <div className={clsx("size-full", "grid grid-cols-[3rem_1fr]")}>
            {/* 侧边导航栏 */}
            <SideBar />
            {/* 主内容区域 */}
            <div className={clsx("relative", "size-full", "overflow-hidden")}>
              <Outlet />
            </div>
          </div>
          {/* 开发者工具 */}
          {import.meta.env.DEV && (
            <div className="absolute right-0 bottom-0 me-2 mb-12">
              <ReactQueryDevtools position="bottom" buttonPosition="relative" />
              <TanStackRouterDevtools position="bottom-right" />
            </div>
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
}
