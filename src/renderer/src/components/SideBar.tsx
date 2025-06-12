import React, { useRef, useState } from "react";
import clsx from "clsx";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { Popover } from "@base-ui-components/react/popover";
import routes from "@renderer/routes";
import { BiSolidHome } from "react-icons/bi";
import { BiSolidCoffee } from "react-icons/bi";
import { VscVscode } from "react-icons/vsc";

export function SideBar(): React.JSX.Element {
  const { t } = useTranslation("page");

  const styles = {
    icon: clsx("size-full"),
    backdropColor: clsx("bg-[#f0f0f0] dark:bg-[#202020]"),
    itemColor: clsx("bg-blue-200 dark:bg-blue-700")
  };

  const icons = {
    home: <BiSolidHome className={styles.icon} />,
    java: <BiSolidCoffee className={styles.icon} />,
    template: <VscVscode className={styles.icon} />
  };

  return (
    <div className={clsx("app-drag", "size-full", "overflow-hidden", styles.backdropColor)}>
      <div className={clsx("relative", "size-full", "px-1 py-1")}>
        <nav className={clsx("size-full")}>
          <ul
            className={clsx(
              "app-no-drag",
              "w-full",
              "flex flex-col gap-0.5",
              "items-center justify-start"
            )}
          >
            {routes.map(({ id, path }) => (
              <SideBarItem key={id} popoverText={t(`${id}.name`)}>
                <NavLink className={clsx("size-full")} to={path ?? "/"} viewTransition>
                  {({ isActive }) => (
                    <div
                      className={clsx(
                        "size-full p-2",
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
              </SideBarItem>
            ))}
          </ul>
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
            <Popover.Description className={clsx("text-base")}>{popoverText}</Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
