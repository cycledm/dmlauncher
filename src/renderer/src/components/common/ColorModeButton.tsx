import React from "react";
import { clsx } from "clsx";
import { useTheme } from "@renderer/hooks";
import { cn } from "@renderer/utils";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { VscColorMode } from "react-icons/vsc";

const styles = {
  icon: clsx("size-full"),
};

const icons = {
  system: <VscColorMode className={styles.icon} />,
  light: <MdOutlineLightMode className={styles.icon} />,
  dark: <MdOutlineDarkMode className={styles.icon} />,
};

type Props = React.HTMLAttributes<HTMLButtonElement>;

export function ColorModeButton({ className, ...props }: Props): React.JSX.Element {
  const { colorMode, setColorMode } = useTheme();

  const handleClick = async (): Promise<void> => {
    switch (colorMode) {
      case "system":
        await setColorMode("light");
        break;
      case "light":
        await setColorMode("dark");
        break;
      case "dark":
        await setColorMode("system");
        break;
      default:
        break;
    }
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={cn(
        "app-no-drag",
        "aspect-square h-4/5 p-1",
        "rounded-[50%]",
        "cursor-pointer",
        "transition-colors duration-250",
        "hover:bg-gray-300/50",
        "dark:hover:bg-gray-500/50",
        className,
      )}
    >
      {icons[colorMode]}
    </button>
  );
}
