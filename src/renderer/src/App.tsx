import React, { Suspense } from "react";
import clsx from "clsx";
import { useLocation, Outlet, useNavigation } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import { useI18nInit } from "@renderer/hooks";
import { SideBar } from "@renderer/components";
import { Spinner } from "@renderer/components";
import { TitleBar } from "@renderer/components";

import icon from "@renderer/assets/electron.svg";

function I18nProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  useI18nInit();
  return <React.Fragment>{children}</React.Fragment>;
}

export default function App(): React.JSX.Element {
  const location = useLocation();
  const navigation = useNavigation();

  return (
    <div
      className={clsx(
        "h-dvh max-h-dvh w-dvw max-w-dvw",
        "bg-white text-black dark:bg-gray-950 dark:text-white",
        "grid grid-rows-[var(--titlebar-h)_1fr]",
        "ms-track-box ms-theme-dark"
      )}
    >
      {/* 窗口标题栏 */}
      <TitleBar icon={icon} />
      <div className={clsx("relative size-full overflow-hidden")}>
        <ErrorBoundary
          fallback={<h2 className="text-2xl font-bold">Oops, an error has occurred.</h2>}
        >
          <Suspense fallback={<Spinner className="size-full" size="4rem" center pulse />}>
            <I18nProvider>
              <div className={clsx("size-full", "grid grid-cols-[var(--sidebar-w)_1fr]")}>
                {/* 侧边导航栏 */}
                <SideBar />
                {/* 主内容区域 */}
                <div className={clsx("relative", "size-full", "overflow-hidden")}>
                  <ErrorBoundary
                    fallback={<h2 className="text-2xl font-bold">Oops, an error has occurred.</h2>}
                    key={navigation.location?.key || location.key}
                  >
                    <Suspense
                      fallback={<Spinner className="size-full" size="4rem" center pulse />}
                      key={navigation.location?.key || location.key}
                    >
                      <Outlet />
                    </Suspense>
                  </ErrorBoundary>
                </div>
              </div>
            </I18nProvider>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
