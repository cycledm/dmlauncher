import { app, BrowserWindow, ipcMain, nativeTheme } from "electron";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import { installExtension, REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import MainWindow from "./classes/main-window";
import { i18n } from "./utils";
import { resolve } from "path";

function createMainWindow(): MainWindow {
  const mainWindow = new MainWindow();
  return mainWindow;
}

async function installReactDevTools(): Promise<void> {
  if (import.meta.env.PROD) return;

  try {
    const ext = await installExtension(REACT_DEVELOPER_TOOLS, {
      loadExtensionOptions: { allowFileAccess: true }
    });
    console.log("Added Extension:", ext.name);
  } catch (error) {
    console.error("Adding Extension Failed:", error);
  }
}

// 单例应用锁
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

// 设置应用程序的默认协议处理器（Scheme）
// 在开发模式下，使用 `dmlauncher-dev` 协议
if (!app.isPackaged) {
  app.setAsDefaultProtocolClient(import.meta.env.MAIN_APP_PROTOCOL, process.execPath, [
    resolve(process.argv[1])
  ]);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // React Developer Tools
  await installReactDevTools();

  // Set app user model id for windows
  electronApp.setAppUserModelId("net.southcraft.dmlauncher");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));

  // 全局 IPC 事件
  ipcMain.handle("i18n:get-app-locale", () => app.getLocale());
  ipcMain.handle("i18n:load-supported", () => i18n.loadSupported());
  ipcMain.handle("i18n:load-resource", (_, lng, ns) => i18n.loadResource(lng, ns));
  ipcMain.handle("theme:get-current-color-mode", () => nativeTheme.themeSource);

  const mainWindow = createMainWindow();

  app.on("second-instance", (_event, argv, workingDirectory) => {
    // 当运行第二个实例时，这里会被调用
    // argv: 传递给第二个实例的命令行参数
    // workingDirectory: 第二个实例的工作目录
    console.log("Second instance launched with args:", argv, "in directory:", workingDirectory);

    // 如果主窗口已存在，则将其聚焦
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }

    // 查找命令行参数中的 Protocol
    const protocol = argv.find((arg) => arg.startsWith(import.meta.env.MAIN_APP_PROTOCOL));
    if (protocol) {
      console.log("Found protocol:", protocol);
    }

    // TODO: 解析微软登录，并发送至前端
  });

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
