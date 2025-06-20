import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  namespace SharedTypes {
    export * from "./types";
  }

  interface Window {
    electron: ElectronAPI;
    api: SharedTypes.API;
  }
}

export * from "./types";
