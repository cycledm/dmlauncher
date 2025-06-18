import React from "react";
import { clsx } from "clsx";
import { CgSpinner } from "react-icons/cg";

type Props = {
  className?: string;
  size?: string | number;
  fullscreen?: boolean;
  center?: boolean;
  pulse?: boolean;
  hidden?: boolean;
};

export function Spinner({
  className,
  size,
  fullscreen,
  center,
  pulse,
  hidden,
}: Props): React.JSX.Element {
  return (
    <div
      className={clsx(
        {
          "flex items-center justify-center self-center justify-self-center": !fullscreen && center,
          "absolute inset-0 z-10 flex min-h-dvh min-w-dvw items-center justify-center bg-white pt-[var(--titlebar-h)] dark:bg-gray-950":
            fullscreen,
        },
        className,
      )}
      hidden={hidden}
    >
      <div className={clsx({ "animate-none": !pulse, "animate-pulse": pulse })}>
        <CgSpinner className="animate-spin" size={fullscreen ? "5rem" : size || "100%"} />
      </div>
      {/* <span className="sr-only">{t("loading")}</span> */}
    </div>
  );
}
