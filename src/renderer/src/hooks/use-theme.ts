import { useAtom } from "jotai";
import { colorModeAtom } from "@renderer/atoms";
import { useElectron } from "./use-electron";

interface UseThemeResponse {
  colorMode: Global.Types.ColorMode;
  setColorMode: (mode: Global.Types.ColorMode) => Promise<void>;
}

export function useTheme(): UseThemeResponse {
  const { theme } = useElectron();
  const [colorMode, setColorMode] = useAtom(colorModeAtom);

  const changeColorMode = async (mode: Global.Types.ColorMode): Promise<void> => {
    await theme.setColorMode(mode);
    setColorMode(mode);
  };

  return { colorMode, setColorMode: changeColorMode };
}
