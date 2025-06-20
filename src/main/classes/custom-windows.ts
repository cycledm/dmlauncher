import { app, BrowserWindow, BrowserWindowConstructorOptions, nativeTheme } from "electron";
import path from "path";
import { Worker } from "worker_threads";
import fileTracker from "@main/workers/file-tracker?modulePath";
import { Downloader } from "./downloader";

export type PrimaryBrowserWindowConstructorOptions = Omit<
  BrowserWindowConstructorOptions,
  "autoHideMenuBar" | "titleBarStyle" | "titleBarOverlay" | "backgroundColor"
>;

/**
 * 主要窗口类，包含以下特性：
 * - 本地化文件变化跟踪（仅开发模式）
 * - 自定义标题栏和窗口背景色
 * - 主题色模式切换
 * - 自动注册以上相关局部 IPC 事件
 */
export class PrimaryBrowserWindow extends BrowserWindow {
  constructor(options?: PrimaryBrowserWindowConstructorOptions) {
    // 带有自定义标题栏的窗口参数
    const customOptions: BrowserWindowConstructorOptions = {
      ...options,
      autoHideMenuBar: true,
      titleBarStyle: "hidden",
      titleBarOverlay: {
        color: nativeTheme.shouldUseDarkColors ? "#20202000" : "#f0f0f000",
        symbolColor: nativeTheme.shouldUseDarkColors ? "white" : "black",
        height: 32,
      },
      backgroundColor: nativeTheme.shouldUseDarkColors ? "black" : "white",
    };

    // 使用自定义参数构建窗口
    super(customOptions);

    // 注册局部 IPC 事件
    this.registerIpcEvents();

    // 仅限开发模式
    if (import.meta.env.DEV) {
      this.webContents.openDevTools();
      this.trackLocales();
    }
  }

  /**
   * 注册局部 IPC 事件，仅对当前窗口有效
   */
  private registerIpcEvents(): void {
    const ipc = this.webContents.ipc;
    // 焦点变化时通知渲染进程
    this.on("focus", () => this.webContents.send("titlebar:on-focus-change", true));
    this.on("blur", () => this.webContents.send("titlebar:on-focus-change", false));

    // 主题色，标题栏颜色和窗口背景色相关
    ipc.handle("titlebar:set-color", (_, { color, symbolColor }) =>
      this.setTitleBarOverlay({ color, symbolColor }),
    );
    ipc.handle("titlebar:is-focused", () => this.isFocused());
    ipc.handle("theme:set-color-mode", (_, mode) => {
      nativeTheme.themeSource = mode;
      this.setBackgroundColor(nativeTheme.shouldUseDarkColors ? "black" : "white");
      this.webContents.send("titlebar:on-color-mode-change");
      return nativeTheme.themeSource;
    });
    nativeTheme.on("updated", () => {
      this.webContents.send("titlebar:on-color-mode-change");
    });

    // 下载
    ipc.handle("downloader:download", async (_, opts: Global.Types.DownloadOptions[]) => {
      opts.map((opt) => {
        // opt.url =
        //   "https://mirrors.nju.edu.cn/adoptium/21/jdk/x64/windows/OpenJDK21U-jdk_x64_windows_hotspot_21.0.7_6.zip";
        // opt.directory = path.join(app.getPath("downloads"), "jdk");
        Downloader.pushTask(opt);
      });
      if (!Downloader.isRunning()) {
        Downloader.startAll({
          onStart: () => {
            this.setProgressBar(0, { mode: "indeterminate" });
          },
          onProgress: (data) => {
            this.setProgressBar(data.progress, {
              mode: data.progress > 0 ? "normal" : "indeterminate",
            });
            this.webContents.send("downloader:update-progress", data);
          },
          onComplete: () => {
            this.setProgressBar(-1);
            this.webContents.send("downloader:download-complete");
          },
        });
      }
    });
    // 取消下载
    ipc.handle("downloader:stop-all", () => Downloader.stopAll());
  }

  /**
   * 跟踪本地化文件变化，应该仅在开发模式下调用
   */
  private trackLocales(): void {
    const tracker = new Worker(fileTracker);
    tracker.on("error", (error) => console.error("Worker exit with error:", error));
    tracker.on("exit", (code) => console.log("Worker exit with code:", code));
    tracker.on("message", () => this.reload());
    tracker.postMessage({ dir: path.resolve(app.getAppPath(), "resources", "locales") });
  }
}
