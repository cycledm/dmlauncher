interface useElectronResponse {
  getCurrentColorMode: () => Promise<"system" | "light" | "dark">;
  setColorMode: (mode: "system" | "light" | "dark") => Promise<"system" | "light" | "dark">;
}

export function useElectron(): useElectronResponse {
  const getCurrentColorMode = window.api.theme.getCurrentColorMode;
  const setColorMode = window.api.theme.setColorMode;
  return { getCurrentColorMode, setColorMode };
}
