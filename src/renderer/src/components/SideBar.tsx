import React, { useRef, useState } from "react";
import { clsx } from "clsx";
import { Link, linkOptions } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Popover } from "@base-ui-components/react/popover";
import { Progress } from "@base-ui-components/react/progress";
import { useDownloader } from "@renderer/hooks";
import { Route as settingsRoute } from "@renderer/routes/app/settings";
import { FiDownload } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { GoRepoTemplate } from "react-icons/go";
import { HiOutlineBars3 } from "react-icons/hi2";
import { RiJavaLine } from "react-icons/ri";

const styles = {
  icon: clsx("size-1/2"),
  backdropColor: clsx("bg-[#f0f0f0] dark:bg-[#202020]"),
  itemColor: clsx("bg-blue-200 dark:bg-blue-700"),
};

const options = linkOptions([
  {
    to: "/app/home",
    key: "home",
    icon: <FiHome className={styles.icon} />,
  },
  {
    to: "/app/java",
    key: "java",
    icon: <RiJavaLine className={styles.icon} />,
  },
  {
    to: "/app/downloads",
    key: "downloads",
    icon: <FiDownload className={styles.icon} />,
  },
  {
    to: "/app/template",
    key: "template",
    icon: <GoRepoTemplate className={styles.icon} />,
  },
  {
    to: "/app/settings",
    key: "settings",
    icon: <HiOutlineBars3 className={styles.icon} />,
  },
]);

export function SideBar(): React.JSX.Element {
  const { t } = useTranslation("routes");
  const { downloaderInfo } = useDownloader();

  return (
    <div className={clsx("app-drag", "size-full", "overflow-hidden", styles.backdropColor)}>
      <div className={clsx("relative", "size-full", "px-1 py-1")}>
        <nav className={clsx("size-full", "container-type-inline-size")}>
          <div className={clsx("size-full", "grid grid-rows-[1fr_100cqw] gap-0.5")}>
            <div
              className={clsx(
                "grid auto-rows-min grid-cols-1 gap-0.5",
                "scrollbar-hidden max-h-[calc(100cqh-100cqw-0.5rem)] overflow-auto",
              )}
            >
              {options
                .filter((opt) => opt.key !== "settings")
                .map((option) => (
                  <SideBarItem key={option.key} popoverText={t(`${option.key}.displayName`)}>
                    <Link
                      {...option}
                      key={option.key}
                      viewTransition
                      draggable={false}
                      className={clsx("app-no-drag", "size-full")}
                    >
                      {({ isActive }) => (
                        <div
                          className={clsx(
                            "size-full",
                            "flex items-center justify-center",
                            "rounded-md",
                            isActive && styles.itemColor,
                          )}
                        >
                          {option.icon}
                        </div>
                      )}
                    </Link>
                    {/* 下载进度条 */}
                    {option.key === "downloads" && downloaderInfo && (
                      <div
                        className={clsx(
                          "absolute bottom-1 h-1.25 w-full",
                          "px-1.5",
                          "transition-opacity duration-500",
                          {
                            "opacity-100":
                              downloaderInfo.percent > 0 && downloaderInfo.percent < 100,
                            "opacity-0":
                              downloaderInfo.percent <= 0 || downloaderInfo.percent >= 100,
                          },
                        )}
                      >
                        <Progress.Root value={downloaderInfo.percent} className={clsx("size-full")}>
                          <Progress.Track
                            className={clsx(
                              "size-full overflow-hidden",
                              "rounded bg-gray-500",
                              "shadow-[inset_0_0_0_1px] shadow-gray-200 dark:shadow-gray-900",
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
              <SideBarItem popoverText={t("settings.displayName")}>
                <Link
                  to={settingsRoute.to}
                  viewTransition
                  draggable={false}
                  className={clsx("app-no-drag", "size-full")}
                >
                  {({ isActive }) => (
                    <div
                      className={clsx(
                        "size-full",
                        "flex items-center justify-center",
                        "rounded-md",
                        isActive && styles.itemColor,
                      )}
                    >
                      {options.find((opt) => opt.key === "settings")?.icon}
                    </div>
                  )}
                </Link>
              </SideBarItem>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

function SideBarItem({
  children,
  popoverText,
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
              "data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0",
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
