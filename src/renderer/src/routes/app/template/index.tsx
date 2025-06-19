import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation, Trans } from "react-i18next";
import { atom, useAtomValue } from "jotai";
import { Versions } from "@renderer/components";
import electronLogo from "@renderer/assets/electron.svg";

export const Route = createFileRoute("/app/template/")({
  component: Template,
});

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
const countAtom = atom(0);
const asyncAtom = atom(async (get) => {
  await sleep(1000);
  return get(countAtom);
});

function Template(): React.JSX.Element {
  useAtomValue(asyncAtom);

  const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");

  const { t } = useTranslation("template");

  const buttonStyles = twMerge(
    clsx("inline-block cursor-pointer px-[20px] py-0 text-center"),
    clsx("rounded-[20px] border-[1px] border-solid border-transparent bg-[#32363f]"),
    clsx("text-[14px]/[38px] font-[600] text-nowrap text-[rgba(255,255,245,0.86)] no-underline"),
    clsx("hover:border-transparent hover:bg-[#414853] hover:text-[rgba(255,255,245,0.86)]"),
  );

  return (
    <div
      className={clsx(
        "m-0 box-border flex h-full w-full items-center justify-center overflow-hidden select-none",
        "bg-gray-100 bg-[url(@renderer/assets/wavy-lines.svg)] bg-cover dark:bg-[#1b1b1f]",
        "font-sans leading-[1.6] font-normal text-black antialiased dark:text-[rgba(255,255,245,0.86)]",
      )}
      style={{ textRendering: "optimizeLegibility" }}
    >
      <div className="mb-[80px] flex flex-col items-center justify-center">
        <img
          alt="logo"
          className={clsx(
            "mb-[20px] h-[128px] w-[128px]",
            "transition-[filter] duration-300 will-change-[filter]",
            "hover:drop-shadow-[0_0_1.2em_#6988e6aa]",
          )}
          draggable={false}
          src={electronLogo}
        />
        <div className="mb-[10px] text-[14px]/[16px] font-[600] text-black dark:text-[rgba(235,235,245,0.6)]">
          {t("poweredBy", { framework: "electron-vite" })}
        </div>
        <div className="mx-[10px] my-0 px-0 py-[16px] text-center text-[28px]/[32px] text-black dark:text-[rgba(255,255,245,0.86)]">
          <Trans
            t={t}
            i18nKey="buildWith"
            components={[
              <span
                key="0"
                className="bg-gradient-to-br from-[#087ea4] from-55% to-[#7c93ee] bg-clip-text font-[700] text-transparent"
              />,
              <span
                key="1"
                className="bg-gradient-to-br from-[#3178c6] from-45% to-[#f0dc4e] bg-clip-text font-[700] text-transparent"
              />,
            ]}
          />
        </div>
        <p className="text-[16px]/[24px] font-[600] text-gray-500 dark:text-[rgba(235,235,245,0.6)]">
          <Trans
            t={t}
            i18nKey={"openDevTool"}
            components={{
              code: (
                <code
                  className={clsx(
                    "rounded-[2px] bg-gray-800 px-[5px] py-[3px] font-mono text-[85%] font-[600] dark:bg-[#282828]",
                  )}
                />
              ),
            }}
          />
        </p>
        <div className="-m-[6px] flex flex-wrap justify-start pt-[32px]">
          <div className="shrink-0 p-[6px]">
            <a
              href="https://electron-vite.org/"
              target="_blank"
              rel="noreferrer"
              className={buttonStyles}
            >
              {t("documentation")}
            </a>
          </div>
          <div className="shrink-0 p-[6px]">
            <a target="_blank" rel="noreferrer" onClick={ipcHandle} className={buttonStyles}>
              {t("sendIPC")}
            </a>
          </div>
        </div>
        <Versions />
      </div>
    </div>
  );
}
