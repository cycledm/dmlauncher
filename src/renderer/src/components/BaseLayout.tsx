import React, { Suspense, useState } from "react";
import { useLocation, Outlet, NavLink, useNavigation, RouteObject } from "react-router";
import Spinner from "./Spinner";
import clsx from "clsx";
import { Popover } from "@base-ui-components/react/popover";
import { useTranslation } from "react-i18next";

type Props = {
  routes: RouteObject[];
};

export default function BaseLayout({ routes }: Props): React.JSX.Element {
  const location = useLocation();
  const navigation = useNavigation();
  const { t } = useTranslation("page");

  return (
    <div
      className={clsx(
        "flex h-dvh w-dvw overflow-hidden pt-[var(--titlebar-h)]",
        "bg-white text-black dark:bg-gray-950 dark:text-white"
      )}
    >
      <div className="grid size-full grid-cols-[3rem_1fr]">
        {/* 侧边导航栏 */}
        <div className="relative size-full overflow-hidden bg-red-50">
          <div className={clsx("relative size-full px-1 py-1")}>
            <nav className="size-full">
              <ul className="flex w-full flex-col items-center justify-start gap-0.5">
                {routes.map(({ id, path }, idx) => (
                  <SideBarItem key={id} popoverText={t(`${id}.name`)}>
                    <NavLink className="size-full" to={path ?? "/"}>
                      {({ isActive }) => (
                        <div
                          className={clsx(
                            "flex size-full items-center justify-center",
                            "rounded-md",
                            {
                              "bg-red-400": isActive
                            }
                          )}
                        >
                          {idx}
                        </div>
                      )}
                    </NavLink>
                  </SideBarItem>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        {/* 主内容区域 */}
        <div className="relative size-full overflow-hidden">
          <Suspense
            fallback={<Spinner className="size-full" size="4rem" center pulse />}
            key={navigation.location?.key || location.key}
          >
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function SideBarItem({
  children,
  popoverText
}: {
  children: React.ReactNode;
  popoverText: string;
}): React.JSX.Element {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const finalFocus = React.useRef<HTMLElement>(null);

  return (
    <Popover.Root open={popoverOpen}>
      <Popover.Trigger
        className="relative aspect-square w-full"
        tabIndex={-1}
        render={<li />}
        onClick={() => setPopoverOpen(false)}
        onMouseEnter={() => setPopoverOpen(true)}
        onMouseLeave={() => setPopoverOpen(false)}
      >
        {children}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="right" sideOffset={8}>
          <Popover.Popup
            className={clsx(
              "select-none",
              "flex h-[var(--anchor-height)] items-center justify-center",
              "rounded-lg bg-[canvas] px-2 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200",
              "origin-[var(--transform-origin)] transition-[transform,scale,opacity]",
              "dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300",
              "data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0"
            )}
            finalFocus={finalFocus}
          >
            <Popover.Description className="text-base">{popoverText}</Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
