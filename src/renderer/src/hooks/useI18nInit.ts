import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "@renderer/utils/i18n";

interface UseI18nInitResponse {
  loading: boolean;
}

/**
 * i18n初始化hook
 */
export function useI18nInit(): UseI18nInitResponse {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async (): Promise<void> => {
      if (!i18n.isInitialized) return;

      try {
        const appLocale = await window.api.i18n.getAppLocale();
        await i18n.changeLanguage(appLocale);
      } catch (error) {
        console.error("Failed to initialize i18n:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [i18n]);

  return { loading };
}
