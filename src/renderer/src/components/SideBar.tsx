import React, { useRef, useState } from "react";
import clsx from "clsx";
import routes from "@renderer/routes";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { Popover } from "@base-ui-components/react/popover";
import { Progress } from "@base-ui-components/react/progress";

import { useDownloader } from "@renderer/hooks";
import { FiHome } from "react-icons/fi";
import { LuCoffee } from "react-icons/lu";
import { GoRepoTemplate } from "react-icons/go";
import { HiOutlineBars3 } from "react-icons/hi2";
import { FiDownload } from "react-icons/fi";

export function SideBar(): React.JSX.Element {
  const { t } = useTranslation("page");
  const { downloaderInfo } = useDownloader();

  const settings = routes.find((route) => route.id === "settings");

  const styles = {
    icon: clsx("size-1/2"),
    backdropColor: clsx("bg-[#f0f0f0] dark:bg-[#202020]"),
    itemColor: clsx("bg-blue-200 dark:bg-blue-700")
  };

  const icons = {
    home: <FiHome className={styles.icon} />,
    java: <LuCoffee className={styles.icon} />,
    downloads: <FiDownload className={styles.icon} />,
    template: <GoRepoTemplate className={styles.icon} />,
    settings: <HiOutlineBars3 className={styles.icon} />
  };

  return (
    <div className={clsx("app-drag", "size-full", "overflow-hidden", styles.backdropColor)}>
      <div className={clsx("relative", "size-full", "px-1 py-1")}>
        <nav className={clsx("size-full", "container-type-inline-size")}>
          <div className={clsx("size-full", "grid grid-rows-[1fr_100cqw] gap-0.5")}>
            <div
              className={clsx(
                "grid auto-rows-min grid-cols-1 gap-0.5",
                "scrollbar-hidden max-h-[calc(100cqh-100cqw-0.5rem)] overflow-auto"
              )}
            >
              {routes
                .filter(({ id }) => id !== "settings")
                .map(({ id, path }) => (
                  <SideBarItem key={id} popoverText={t(`${id}.name`)}>
                    <NavLink
                      className={clsx("app-no-drag", "size-full")}
                      to={path ?? "/"}
                      viewTransition
                      draggable={false}
                    >
                      {({ isActive }) => (
                        <div
                          className={clsx(
                            "size-full",
                            "flex items-center justify-center",
                            "rounded-md",
                            {
                              [styles.itemColor]: isActive
                            }
                          )}
                        >
                          {id ? icons[id] : null}
                        </div>
                      )}
                    </NavLink>
                    {/* 下载进度条 */}
                    {id === "downloads" && downloaderInfo && downloaderInfo.percent < 100 && (
                      <div className={clsx("absolute bottom-0.5 h-1.25 w-full")}>
                        <Progress.Root
                          value={downloaderInfo?.percent ?? 0}
                          className={clsx("size-full", "px-1.5")}
                        >
                          <Progress.Track
                            className={clsx(
                              "size-full overflow-hidden",
                              "rounded bg-gray-500",
                              "shadow-[inset_0_0_0_1px] shadow-gray-200"
                            )}
                          >
                            <Progress.Indicator
                              className={clsx("block bg-green-500", "transition-all duration-500")}
                            />
                          </Progress.Track>
                        </Progress.Root>
                      </div>
                    )}
                  </SideBarItem>
                ))}
            </div>
            <div>
              {settings && (
                <SideBarItem popoverText={t(`${settings.id}.name`)}>
                  <NavLink
                    className={clsx("app-no-drag", "size-full")}
                    to={settings.path ?? "/"}
                    viewTransition
                    draggable={false}
                  >
                    {({ isActive }) => (
                      <div
                        className={clsx(
                          "size-full",
                          "flex items-center justify-center",
                          "rounded-md",
                          {
                            [styles.itemColor]: isActive
                          }
                        )}
                      >
                        {settings.id ? icons[settings.id] : null}
                      </div>
                    )}
                  </NavLink>
                </SideBarItem>
              )}
            </div>
          </div>
        </nav>
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
  const finalFocus = useRef<HTMLElement>(null);

  return (
    <Popover.Root open={popoverOpen}>
      <Popover.Trigger
        className={clsx("relative aspect-square w-full")}
        tabIndex={-1}
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
            <Popover.Description className={clsx("text-base")}>{popoverText}</Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
