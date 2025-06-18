import icon from "/resources/icon.png?asset";

import { shell } from "electron";
import { is } from "@electron-toolkit/utils";
import { fileURLToPath } from "url";
import { PrimaryBrowserWindow, PrimaryBrowserWindowConstructorOptions } from "./custom-windows";

/**
 * Electron 主窗口
 */
export default class MainWindow extends PrimaryBrowserWindow {
  constructor(options?: PrimaryBrowserWindowConstructorOptions) {
    super({
      width: Number(import.meta.env.MAIN_DEFAULT_WIDTH),
      height: Number(import.meta.env.MAIN_DEFAULT_HEIGHT),
      show: false,
      ...(process.platform === "linux" ? { icon } : {}),
      webPreferences: {
        preload: fileURLToPath(new URL("../preload/index.js", import.meta.url)),
        sandbox: false,
      },
      ...options,
    });

    this.on("ready-to-show", () => {
      this.show();
    });

    this.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url);
      return { action: "deny" };
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
      this.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    } else {
      this.loadFile(fileURLToPath(new URL("../renderer/index.html", import.meta.url)));
    }
  }
}
