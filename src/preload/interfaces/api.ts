import { DownloaderInfoForRenderer, DownloadOptions } from "@main/interfaces/downloader";
import { SupportedLanguages } from "@main/interfaces/i18n";

interface I18nAPI {
  getAppLocale: () => Promise<string>;
  loadSupported: () => Promise<SupportedLanguages>;
  loadResource: (language: string, namespace: string) => Promise<Record<string, string>>;
}

interface TitleBarAPI {
  setColor: (colors: { color: string; symbolColor: string }) => Promise<void>;
  isFocused: () => Promise<boolean>;
  onFocusChange: (callback: (focused: boolean) => void) => void;
  onColorModeChange: (callback: () => void) => void;
}

interface ThemeAPI {
  getCurrentColorMode: () => Promise<"system" | "light" | "dark">;
  setColorMode: (mode: string) => Promise<"system" | "light" | "dark">;
}

interface DownloaderAPI {
  download: (opts: DownloadOptions[]) => Promise<void>;
  stopAll: () => Promise<void>;
  onUpdateProgress: (callback: (data: DownloaderInfoForRenderer) => void) => void;
  onDownloadComplete: (callback: () => void) => void;
}

export default interface API {
  i18n: I18nAPI;
  titlebar: TitleBarAPI;
  theme: ThemeAPI;
  downloader: DownloaderAPI;
}
