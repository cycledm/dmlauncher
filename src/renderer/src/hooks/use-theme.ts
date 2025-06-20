import { useAtom } from "jotai";
import { colorModeAtom } from "@renderer/atoms";
import { useElectron } from "./use-electron";

interface UseThemeResponse {
  colorMode: SharedTypes.ColorMode;
  setColorMode: (mode: SharedTypes.ColorMode) => Promise<void>;
}

export function useTheme(): UseThemeResponse {
  const { theme } = useElectron();
  const [colorMode, setColorMode] = useAtom(colorModeAtom);

  const changeColorMode = async (mode: SharedTypes.ColorMode): Promise<void> => {
    await theme.setColorMode(mode);
    setColorMode(mode);
  };

  return { colorMode, setColorMode: changeColorMode };
}
