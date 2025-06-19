import { atomWithStorage } from "jotai/utils";

export const colorModeAtom = atomWithStorage<"system" | "light" | "dark">("colorMode", "system");
