import React, { useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { formatHex8, parse } from "culori";
import { useElectron } from "@renderer/hooks";

import { VscColorMode } from "react-icons/vsc";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";

type Props = {
  icon?: string;
};

export function TitleBar({ icon }: Props): React.JSX.Element {
  const { titlebar } = useElectron();

  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  const updateColor = useCallback(async (): Promise<void> => {
    if (!ref.current) return;
    const focused = await titlebar.isFocused();
    const bgColor = window.getComputedStyle(ref.current).backgroundColor;
    const textColor = window.getComputedStyle(ref.current).color;
    if (!bgColor || !textColor) return;

    const parsedBgColor = parse(bgColor);
    const parsedTextColor = parse(textColor);
    if (parsedBgColor) parsedBgColor.alpha = 0;
    if (parsedTextColor) parsedTextColor.alpha = focused ? 1 : 0.5;

    const color = formatHex8(parsedBgColor);
    const symbolColor = formatHex8(parsedTextColor);
    if (!color || !symbolColor) return;

    titlebar.setColor({ color, symbolColor });
  }, [titlebar]);

  useEffect(() => {
    titlebar.isFocused().then(setFocused);
    titlebar.onFocusChange(setFocused);
    titlebar.onColorModeChange(() => updateColor());
  }, [updateColor, titlebar]);

  useEffect(() => {
    updateColor();
  }, [focused, updateColor]);

  return (
    <div
      className={clsx(
        "relative z-100 size-full",
        "app-drag overflow-hidden select-none",
        "bg-[#f0f0f0] dark:bg-[#202020]",
        {
          "text-black dark:text-white": focused,
          "text-black/50 dark:text-white/50": !focused
        }
      )}
      draggable={false}
      ref={ref}
    >
      <div className="absolute left-[var(--titlebar-x)] h-full w-[var(--titlebar-w)]">
        <div className={clsx("mx-2 h-full", "grid grid-cols-12")}>
          <div className={clsx("col-span-6", "flex items-center justify-start gap-1")}>
            {icon && (
              <img
                className="aspect-square size-[min(1.2rem,calc(var(--titlebar-h)-0.8rem))]"
                src={icon}
              />
            )}
            <span className="font-sans text-sm">{import.meta.env.COMM_APP_TITLE}</span>
          </div>
          <div className={clsx("col-span-2 col-start-11", "flex items-center justify-end")}>
            <ColorModeSwitchButton />
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorModeSwitchButton(): React.JSX.Element {
  const { theme } = useElectron();
  const [colorMode, setColorMode] = useState<"system" | "light" | "dark">("system");

  const styles = {
    icon: clsx("size-full")
  };

  const icons = {
    system: <VscColorMode className={styles.icon} />,
    light: <MdOutlineLightMode className={styles.icon} />,
    dark: <MdOutlineDarkMode className={styles.icon} />
  };

  const handleClick = async (): Promise<void> => {
    switch (colorMode) {
      case "system":
        await theme.setColorMode("light");
        setColorMode("light");
        break;
      case "light":
        await theme.setColorMode("dark");
        setColorMode("dark");
        break;
      case "dark":
        await theme.setColorMode("system");
        setColorMode("system");
        break;
      default:
        break;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "app-no-drag",
        "aspect-square h-4/5 p-1",
        "rounded-[50%]",
        "cursor-pointer",
        "transition-colors duration-250",
        "hover:bg-gray-300/50",
        "dark:hover:bg-gray-500/50"
      )}
    >
      {icons[colorMode]}
    </div>
  );
}
