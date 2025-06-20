interface useElectronResponse {
  i18n: SharedTypes.I18nAPI;
  theme: SharedTypes.ThemeAPI;
  titlebar: SharedTypes.TitleBarAPI;
  downloader: SharedTypes.DownloaderAPI;
}

export function useElectron(): useElectronResponse {
  const i18n = window.api.i18n;
  const theme = window.api.theme;
  const titlebar = window.api.titlebar;
  const downloader = window.api.downloader;
  return { i18n, theme, titlebar, downloader };
}
