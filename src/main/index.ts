import { app, BrowserWindow, ipcMain, nativeTheme } from "electron";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import { installExtension, REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import MainWindow from "./classes/main-window";
import { i18n } from "./utils";

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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // React Developer Tools
  await installReactDevTools();

  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

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

  createMainWindow();

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
