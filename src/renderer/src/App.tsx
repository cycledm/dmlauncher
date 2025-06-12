import React, { Suspense } from "react";
import { useLocation, Outlet, useNavigation } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import clsx from "clsx";
import { useI18nInit } from "@renderer/hooks";
import SideBar from "@renderer/components/SideBar";
import Spinner from "@renderer/components/Spinner";
import TitleBar from "@renderer/components/TitleBar";

import icon from "@renderer/assets/electron.svg";

function I18nProvider(): null {
  const { data } = useI18nInit();
  return data;
}

export default function App(): React.JSX.Element {
  const location = useLocation();
  const navigation = useNavigation();

  return (
    <div
      className={clsx(
        "h-dvh max-h-dvh w-dvw max-w-dvw",
        "bg-white text-black dark:bg-gray-950 dark:text-white",
        "grid grid-rows-[var(--titlebar-h)_1fr]"
      )}
    >
      {/* 窗口标题栏 */}
      <TitleBar icon={icon} />
      <div className={clsx("relative size-full overflow-hidden")}>
        <ErrorBoundary
          fallback={<h2 className="text-2xl font-bold">Oops, an error has occurred.</h2>}
        >
          <Suspense fallback={<Spinner className="size-full" size="4rem" center pulse />}>
            <I18nProvider />
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
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
