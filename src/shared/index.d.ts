import { ElectronAPI } from "@electron-toolkit/preload";
import { API } from "./types";

declare global {
  namespace SharedTypes {
    export * from "./types";
  }

  interface Window {
    electron: ElectronAPI;
    api: API;
  }
}
