interface useElectronResponse {
  getCurrentColorMode: () => Promise<"system" | "light" | "dark">;
  setColorMode: (mode: "system" | "light" | "dark") => Promise<"system" | "light" | "dark">;
  downloader: Window["api"]["downloader"];
}

export function useElectron(): useElectronResponse {
  const getCurrentColorMode = window.api.theme.getCurrentColorMode;
  const setColorMode = window.api.theme.setColorMode;
  const downloader = window.api.downloader;
  return { getCurrentColorMode, setColorMode, downloader };
}
