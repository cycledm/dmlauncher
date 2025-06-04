import i18next from "i18next";
import rtb from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

// 获取可用的语言信息
const supported = await window.api.i18n.loadSupported();

export default i18next
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
