import React, { useState } from "react";
import clsx from "clsx";
import { useElectron } from "@renderer/hooks";

import { VscColorMode } from "react-icons/vsc";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";

export function ColorModeSwitchButton(): React.JSX.Element {
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
        "hover:bg-gray-300/50",
        "dark:hover:bg-gray-500/50"
      )}
    >
      {icons[colorMode]}
    </div>
  );
}
