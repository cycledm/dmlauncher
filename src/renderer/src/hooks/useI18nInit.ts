import { useCallback } from "react";
import useSWRImmutable from "swr/immutable";
import i18next from "i18next";
import rtb from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import { useElectron } from "./useElectron";

/**
 * i18n初始化hook
 */
export function useI18nInit(): { data: null } {
  const { i18n: electronApi } = useElectron();

  const fetcher = useCallback(async () => {
    const supported = await electronApi.loadSupported();
    await i18next
      .use(initReactI18next)
      .use(rtb((lng: string, ns: string) => electronApi.loadResource(lng, ns)))
      .init({
        debug: import.meta.env.DEV,
        lng: supported.languages[0],
        fallbackLng: supported.languages,
        supportedLngs: supported.languages,
        ns: supported.namespaces,
        defaultNS: "common",
        load: "currentOnly"
      });

    const appLocale = await electronApi.getAppLocale();
    await i18next.changeLanguage(appLocale);
    return null;
  }, [electronApi]);

  const { data } = useSWRImmutable("i18n-init", fetcher, { suspense: true });
  return { data };
}
