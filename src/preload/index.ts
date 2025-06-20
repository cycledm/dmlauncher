import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api: Global.Types.API = {
  i18n: {
    getAppLocale: () => ipcRenderer.invoke("i18n:get-app-locale"),
    loadSupported: () => ipcRenderer.invoke("i18n:load-supported"),
    loadResource: (lng, ns) => ipcRenderer.invoke("i18n:load-resource", lng, ns),
  },
  titlebar: {
    setColor: (colors) => ipcRenderer.invoke("titlebar:set-color", colors),
    isFocused: () => ipcRenderer.invoke("titlebar:is-focused"),
    onFocusChange: (callback) =>
      ipcRenderer.on("titlebar:on-focus-change", (_, focused) => callback(focused)),
    onColorModeChange: (callback) =>
      ipcRenderer.on("titlebar:on-color-mode-change", () => callback()),
  },
  theme: {
    getCurrentColorMode: () => ipcRenderer.invoke("theme:get-current-color-mode"),
    setColorMode: (mode) => ipcRenderer.invoke("theme:set-color-mode", mode),
  },
  downloader: {
    download: (opts) => ipcRenderer.invoke("downloader:download", opts),
    stopAll: () => ipcRenderer.invoke("downloader:stop-all"),
    onUpdateProgress: (callback) =>
      ipcRenderer.on("downloader:update-progress", (_, data) => callback(data)),
    onDownloadComplete: (callback) =>
      ipcRenderer.on("downloader:download-complete", () => callback()),
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
