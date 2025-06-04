import { SupportedLanguages } from "@main/interfaces/i18n";

interface I18nAPI {
  getAppLocale: () => Promise<string>;
  loadSupported: () => Promise<SupportedLanguages>;
  loadResource: (language: string, namespace: string) => Promise<Record<string, string>>;
}

interface TitleBarAPI {
  setColor: (colors: { color: string; symbolColor: string }) => Promise<void>;
  isFocused: () => Promise<boolean>;
  onFocusChange: (callback: (focused: boolean) => void) => void;
  onColorModeChange: (callback: () => void) => void;
}

interface ThemeAPI {
  getCurrentColorMode: () => Promise<"system" | "light" | "dark">;
  setColorMode: (mode: string) => Promise<"system" | "light" | "dark">;
}

export default interface API {
  i18n: I18nAPI;
  titlebar: TitleBarAPI;
  theme: ThemeAPI;
}
