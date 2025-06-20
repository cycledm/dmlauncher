import React from "react";
import { clsx } from "clsx";
import { createFileRoute } from "@tanstack/react-router";
import prettyBytes from "pretty-bytes";
import { Progress } from "@base-ui-components/react/progress";
import { ScrollBox, SimpleCard } from "@renderer/components/common";
import { useDownloader } from "@renderer/hooks";

export const Route = createFileRoute("/app/downloads/")({
  component: Downloads,
});

function Downloads(): React.JSX.Element {
  const { downloaderInfo } = useDownloader();

  if (!downloaderInfo) {
    return <></>;
  }

  return (
    <ScrollBox className={clsx("size-full")}>
      <div className={clsx("flex items-center justify-center")}>
        <div className={clsx("w-full max-w-7xl", "flex flex-col gap-2")}>
          {downloaderInfo.tasks.map((item) => (
            <DownloadItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </ScrollBox>
  );
}

type DownloadItemProps = {
  item: Global.Types.DownloadTask;
};

export function DownloadItem({ item }: DownloadItemProps): React.JSX.Element {
  return (
    <SimpleCard className={clsx("grid grid-cols-4 grid-rows-4 gap-y-0.5", "px-4 py-2")}>
      <div className={clsx("col-span-2 col-start-1 row-span-1 row-start-1", "select-text")}>
        <p className="font-mono text-xs italic">ID: {item.id}</p>
      </div>
      <div className={clsx("col-span-2 col-start-3 row-span-1 row-start-1")}>
        {/* <p className="text-end font-sans text-xs">操作按钮等</p> */}
      </div>
      <div className={clsx("col-span-3 col-start-1 row-span-2 row-start-2", "select-text")}>
        <div className={clsx("size-full overflow-hidden", "flex items-center justify-start")}>
          <p className="font-medium">{item.filename}</p>
        </div>
      </div>
      <div className={clsx("col-span-1 col-start-4 row-span-2 row-start-2")}>
        <Progress.Root
          className={clsx("grid size-full grid-cols-2")}
          value={(item.transferred / item.total) * 100}
        >
          <Progress.Label className="text-sm font-medium">正在下载...</Progress.Label>
          <Progress.Value className="col-start-2 text-right text-sm" />
          <div
            className={clsx(
              "col-span-full h-full overflow-hidden",
              "flex items-center justify-center",
            )}
          >
            <Progress.Track
              className={clsx(
                "h-2 w-full rounded bg-gray-200 shadow-[inset_0_0_0_1px] shadow-gray-200",
              )}
            >
              <Progress.Indicator className="block rounded bg-gray-500 transition-all duration-500" />
            </Progress.Track>
          </div>
        </Progress.Root>
      </div>
      <div className={clsx("col-span-2 col-start-1 row-span-1 row-start-4", "select-text")}>
        <p className="font-sans text-xs">文件大小: {prettyBytes(item.total, { binary: true })}</p>
      </div>
    </SimpleCard>
  );
}
