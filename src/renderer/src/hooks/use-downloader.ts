import { useEffect } from "react";
import { atom, useAtom } from "jotai";
import { useElectron } from "./use-electron";

const downloaderInfoAtom = atom<Global.Types.DownloaderInfo | null>(null);

interface UseDownloaderResponse {
  downloaderInfo: Global.Types.DownloaderInfo | null;
}

export function useDownloader(): UseDownloaderResponse {
  const { downloader } = useElectron();
  const [downloaderInfo, setDownloaderInfo] = useAtom(downloaderInfoAtom);

  useEffect(() => {
    if (downloaderInfo) return;
    downloader.onUpdateProgress((data: Global.Types.DownloaderInfo) => {
      setDownloaderInfo(data);
    });
  }, [downloader, downloaderInfo, setDownloaderInfo]);

  return { downloaderInfo };
}
