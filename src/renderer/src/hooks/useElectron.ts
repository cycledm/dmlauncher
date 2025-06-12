interface useElectronResponse {
  i18n: Window["api"]["i18n"];
  theme: Window["api"]["theme"];
  titlebar: Window["api"]["titlebar"];
  downloader: Window["api"]["downloader"];
}

export function useElectron(): useElectronResponse {
  const i18n = window.api.i18n;
  const theme = window.api.theme;
  const titlebar = window.api.titlebar;
  const downloader = window.api.downloader;
  return { i18n, theme, titlebar, downloader };
}
