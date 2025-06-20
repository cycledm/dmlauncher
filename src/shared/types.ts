import {
  DownloadTask as DownloadTaskForRenderer,
  DownloaderInfo as DownloaderInfoForRenderer,
  DownloadOptions,
} from "@main/interfaces/downloader";
import { SupportedLanguages } from "@main/interfaces/i18n";

/**
 * 应用的颜色模式
 *
 * 浅色 / 深色 / 自动（与操作系统同步）
 */
export type ColorMode = "light" | "dark" | "system";

/**
 * 下载器任务和进度信息
 */
export type DownloaderInfo = DownloaderInfoForRenderer;

/**
 * 下载器任务信息
 */
export type DownloadTask = DownloadTaskForRenderer;

/**
 * 本地化支持 API
 */
export interface I18nAPI {
  getAppLocale: () => Promise<string>;
  loadSupported: () => Promise<SupportedLanguages>;
  loadResource: (language: string, namespace: string) => Promise<Record<string, string>>;
}

/**
 * 标题栏 API
 */
export interface TitleBarAPI {
  setColor: (colors: { color: string; symbolColor: string }) => Promise<void>;
  isFocused: () => Promise<boolean>;
  onFocusChange: (callback: (focused: boolean) => void) => void;
  onColorModeChange: (callback: () => void) => void;
}

/**
 * 主题 API
 */
export interface ThemeAPI {
  getCurrentColorMode: () => Promise<ColorMode>;
  setColorMode: (mode: ColorMode) => Promise<ColorMode>;
}

/**
 * 下载器 API
 */
export interface DownloaderAPI {
  download: (opts: DownloadOptions[]) => Promise<void>;
  stopAll: () => Promise<void>;
  onUpdateProgress: (callback: (data: DownloaderInfo) => void) => void;
  onDownloadComplete: (callback: () => void) => void;
}

/**
 * 暴露给渲染进程的 API 集合
 */
export interface API {
  i18n: I18nAPI;
  titlebar: TitleBarAPI;
  theme: ThemeAPI;
  downloader: DownloaderAPI;
}
