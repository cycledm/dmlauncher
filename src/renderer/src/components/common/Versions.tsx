import React, { useState } from "react";
import { clsx } from "clsx";

export function Versions(): React.JSX.Element {
  const versionStyles = ["float-left block px-[20px] py-0", "text-[14px]/[14px] opacity-80"];
  const [versions] = useState(window.electron.process.versions);

  return (
    <ul
      className={clsx(
        "absolute bottom-[30px] mx-auto my-0 inline-flex list-none items-center overflow-hidden px-0 py-[15px]",
        "rounded-[22px] bg-blue-200 font-mono backdrop-blur-[24px] dark:bg-[#202127]",
      )}
    >
      <li className={clsx(versionStyles, "border-r-[1px] border-solid border-[#515c67]")}>
        Electron v{versions.electron}
      </li>
      <li className={clsx(versionStyles, "border-r-[1px] border-solid border-[#515c67]")}>
        Chromium v{versions.chrome}
      </li>
      <li className={clsx(versionStyles, "border-none")}>Node v{versions.node}</li>
    </ul>
  );
}
