import React from "react";
import clsx from "clsx";
import { Progress } from "@base-ui-components/react/progress";
import { useDownloader } from "@renderer/hooks";

export default function Downloads(): React.JSX.Element {
  const { downloaderInfo } = useDownloader();

  return (
    <Progress.Root
      className={clsx("grid w-48 grid-cols-2 gap-y-2")}
      value={downloaderInfo?.percent ?? 0}
    >
      <Progress.Label className={clsx("text-sm font-medium text-gray-900")}>
        Progress
      </Progress.Label>
      <Progress.Value className={clsx("col-start-2 text-right text-sm text-gray-900")} />
      <Progress.Track
        className={clsx(
          "col-span-full h-2 overflow-hidden rounded bg-gray-200 shadow-[inset_0_0_0_1px] shadow-gray-200"
        )}
      >
        <Progress.Indicator className={clsx("block bg-gray-500 transition-all duration-500")} />
      </Progress.Track>
    </Progress.Root>
  );
}
