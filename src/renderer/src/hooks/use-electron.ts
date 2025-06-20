interface useElectronResponse {
  i18n: Global.Types.I18nAPI;
  theme: Global.Types.ThemeAPI;
  titlebar: Global.Types.TitleBarAPI;
  downloader: Global.Types.DownloaderAPI;
}

export function useElectron(): useElectronResponse {
  const i18n = window.api.i18n;
  const theme = window.api.theme;
  const titlebar = window.api.titlebar;
  const downloader = window.api.downloader;
  return { i18n, theme, titlebar, downloader };
}
