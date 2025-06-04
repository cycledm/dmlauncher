import React from "react";
import Router from "./components/Router";
import Spinner from "./components/Spinner";
import TitleBar from "./components/TitleBar";
import icon from "@renderer/assets/electron.svg";
import { useI18nInit } from "./hooks";

export default function App(): React.JSX.Element {
  const { loading } = useI18nInit();

  return (
    <div className="text-black dark:text-white">
      <TitleBar icon={icon} />
      <Router />
      {loading && <Spinner fullscreen pulse />}
    </div>
  );
}
