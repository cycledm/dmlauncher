import { useAtom } from "jotai";
import { colorModeAtom } from "@renderer/atoms";
import { useElectron } from "./electron";

interface UseThemeResponse {
  colorMode: "system" | "light" | "dark";
  setColorMode: (mode: "system" | "light" | "dark") => Promise<void>;
}

export function useTheme(): UseThemeResponse {
  const { theme } = useElectron();
  const [colorMode, setColorMode] = useAtom(colorModeAtom);

  const changeColorMode = async (mode: "system" | "light" | "dark"): Promise<void> => {
    await theme.setColorMode(mode);
    setColorMode(mode);
  };

  return { colorMode, setColorMode: changeColorMode };
}
