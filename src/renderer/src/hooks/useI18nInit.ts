import useSWRImmutable from "swr/immutable";
import { Fetcher } from "swr";
import i18next from "i18next";
import rtb from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

const fetcher: Fetcher<null, string> = async () => {
  const supported = await window.api.i18n.loadSupported();
  await i18next
    .use(initReactI18next)
    .use(rtb((lng: string, ns: string) => window.api.i18n.loadResource(lng, ns)))
    .init({
      debug: import.meta.env.DEV,
      lng: supported.languages[0],
      fallbackLng: supported.languages,
      supportedLngs: supported.languages,
      ns: supported.namespaces,
      defaultNS: "common",
      load: "currentOnly"
    });

  const appLocale = await window.api.i18n.getAppLocale();
  await i18next.changeLanguage(appLocale);
  return null;
};

/**
 * i18n初始化hook
 */
export function useI18nInit(): { data: null } {
  const { data } = useSWRImmutable("i18n-init", fetcher, { suspense: true });
  return { data };
}
