import React, { Suspense } from "react";
import { useLocation, Outlet } from "react-router";
import RouteInfo from "@renderer/interfaces/route-info";
import Spinner from "./Spinner";
import clsx from "clsx";

type Props = {
  routes: RouteInfo[];
};

export default function BaseLayout({ routes }: Props): React.JSX.Element {
  const location = useLocation();

  return (
    <div
      className={clsx(
        "flex h-dvh w-dvw overflow-hidden pt-[var(--titlebar-h)]",
        "bg-white text-black dark:bg-gray-950 dark:text-white"
      )}
      key={routes.find(({ path }) => location.pathname === path)?.key}
    >
      <Suspense fallback={<Spinner className="size-full" size="4rem" center pulse />}>
        <Outlet />
      </Suspense>
    </div>
  );
}
