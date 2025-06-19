import { atomWithStorage } from "jotai/utils";
import { LOCAL_STORAGE_KEYS } from "@renderer/constants";

export const colorModeAtom = atomWithStorage<"system" | "light" | "dark">(
  LOCAL_STORAGE_KEYS.COLOR_MODE,
  "system",
);
