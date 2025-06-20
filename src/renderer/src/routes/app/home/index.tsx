import React, { useState } from "react";
import { clsx } from "clsx";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import prettyBytes from "pretty-bytes";
import { useElectron } from "@renderer/hooks";

export const Route = createFileRoute("/app/home/")({
  component: Home,
});

function Home(): React.JSX.Element {
  const { downloader } = useElectron();

  const [progress, setProgress] = useState(0);
  const [transferredBytes, setTransferredBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleDownload = async (): Promise<void> => {
    if (loading) return;
    setLoading(true);
    const { data } = await axios.get(
      "/api/adoptium/assets/latest/21/hotspot?architecture=x64&image_type=jdk&os=windows&vendor=eclipse",
      {
        headers: {
          accept: "application/json",
        },
      },
    );

    const opt = {
      url: data[0].binary.package.link,
      directory: "C:\\Users\\CycleDM\\Downloads\\jdk",
      size: data[0].binary.package.size,
    };

    const opts = Array.from({ length: 20 }).map((_, idx) => {
      return { ...opt, filename: `${idx + 1}.zip` };
    });

    await downloader.download(opts);
    downloader.onUpdateProgress((data) => {
      setProgress(data.percent);
      setTransferredBytes(data.transferred);
      setTotalBytes(data.total);
      setSpeed(data.speed ?? 0);
    });
    downloader.onDownloadComplete(() => {
      setLoading(false);
    });
  };

  const handleCancel = async (): Promise<void> => {
    await downloader.stopAll();
    setProgress(0);
    setTransferredBytes(0);
    setTotalBytes(0);
    setSpeed(0);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <button
        className={clsx(
          "bg-blue-500",
          "text-white",
          "p-2",
          "rounded",
          "cursor-pointer",
          "h-16",
          "w-1/3",
          "hover:brightness-125",
        )}
        onClick={handleDownload}
        disabled={loading}
      >
        {loading ? "Downloading..." : "Download"}
      </button>
      <span>
        {progress.toFixed(2)}% ({transferredBytes} of {totalBytes} bytes)
      </span>
      <span>{`Speed: ${prettyBytes(speed, { binary: true, minimumFractionDigits: 2, maximumFractionDigits: 2 })}/s`}</span>
      <button
        className={clsx(
          "bg-red-600",
          "text-white",
          "p-2",
          "rounded",
          "cursor-pointer",
          "h-16",
          "w-1/5",
          "hover:brightness-125",
        )}
        onClick={handleCancel}
      >
        Cancel / Delete
      </button>
    </div>
  );
}
