import React, { Suspense } from "react";
import { clsx } from "clsx";
import { Outlet } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import { useI18nInit } from "@renderer/hooks";
import { SafeBoundary, SideBar } from "@renderer/components";
import { Spinner } from "@renderer/components";
import { TitleBar } from "@renderer/components";

import icon from "@renderer/assets/electron.svg";

function AppDataContainer({ children }: { children: React.ReactNode }): React.JSX.Element {
  useI18nInit();
  return <React.Fragment>{children}</React.Fragment>;
}

export default function App(): React.JSX.Element {
  return (
    <div
      className={clsx(
        "h-dvh max-h-dvh w-dvw max-w-dvw",
        "bg-white text-black dark:bg-gray-950 dark:text-white",
        "grid grid-rows-[var(--titlebar-h)_1fr]",
        "transition-colors duration-[50ms]"
      )}
    >
      {/* 窗口标题栏 */}
      <TitleBar icon={icon} />
      <div className={clsx("relative size-full overflow-hidden")}>
        <ErrorBoundary
          fallback={<h2 className="text-2xl font-bold">Oops, an error has occurred.</h2>}
        >
          <Suspense fallback={<Spinner className="size-full" size="4rem" center pulse />}>
            <AppDataContainer>
              <div className={clsx("size-full", "grid grid-cols-[3rem_1fr]")}>
                {/* 侧边导航栏 */}
                <SideBar />
                {/* 主内容区域 */}
                <div className={clsx("relative", "size-full", "overflow-hidden")}>
                  <SafeBoundary>
                    <Outlet />
                  </SafeBoundary>
                </div>
              </div>
            </AppDataContainer>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
