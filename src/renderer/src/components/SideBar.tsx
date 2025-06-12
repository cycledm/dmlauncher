import React, { useRef, useState } from "react";
import clsx from "clsx";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { Popover } from "@base-ui-components/react/popover";
import routes from "@renderer/routes";

export function SideBar(): React.JSX.Element {
  const { t } = useTranslation("page");

  return (
    <div className={clsx("size-full", "bg-red-50", "overflow-hidden")}>
      <div className={clsx("relative", "size-full", "px-1 py-1")}>
        <nav className={clsx("size-full")}>
          <ul className={clsx("w-full", "flex flex-col gap-0.5", "items-center justify-start")}>
            {routes.map(({ id, path }, idx) => (
              <SideBarItem key={id} popoverText={t(`${id}.name`)}>
                <NavLink className={clsx("size-full")} to={path ?? "/"} viewTransition>
                  {({ isActive }) => (
                    <div
                      className={clsx(
                        "size-full",
                        "flex items-center justify-center",
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
