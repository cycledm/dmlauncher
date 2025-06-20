/**
 * 下载任务状态
 */
export type DownloadTaskStatus = "pending" | "downloading" | "completed" | "failed";

/**
 * 下载器任务信息
 */
export interface DownloadTask {
  id: string;
  status: DownloadTaskStatus;
  url: string;
  transferred: number;
  total: number;
  directory?: string;
  filename?: string;
  fails?: number;
  startTime?: number;
}

/**
 * 下载参数
 */
export interface DownloadOptions {
  url: string;
  directory?: string;
  filename?: string;
  size?: number;
}

/**
 * 下载器任务和进度信息
 */
export interface DownloaderInfo {
  progress: number;
  percent: number;
  transferred: number;
  total: number;
  startTime?: number;
  speed?: number;
  tasks: DownloadTask[];
}

/**
 * 应用的颜色模式
 *
 * 浅色 / 深色 / 自动（与操作系统同步）
 */
export type ColorMode = "light" | "dark" | "system";

/**
 * 支持的语言信息
 */
export interface SupportedLanguages {
  languages: string[];
  namespaces: string[];
}

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
