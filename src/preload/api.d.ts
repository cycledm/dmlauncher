import { ElectronAPI } from "@electron-toolkit/preload";
import API from "./interfaces/api";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: API;
  }
}
