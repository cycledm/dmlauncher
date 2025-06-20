import { atomWithStorage } from "jotai/utils";
import { LOCAL_STORAGE_KEYS } from "@renderer/constants";

export const colorModeAtom = atomWithStorage<Global.Types.ColorMode>(
  LOCAL_STORAGE_KEYS.COLOR_MODE,
  "system",
);
